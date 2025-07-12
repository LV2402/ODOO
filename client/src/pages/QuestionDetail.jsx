import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [votedAnswers, setVotedAnswers] = useState({});

  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await fetch(`http://localhost:3000/api/questions/${id}`);
      const data = await res.json();
      setQuestion(data);
    };
    fetchQuestion();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    try {
      const res = await fetch(`http://localhost:3000/api/answers/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ content: answer }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to post answer');
      }

      const newAnswer = await res.json();
      setQuestion((prev) => ({ ...prev, answers: [...prev.answers, newAnswer] }));
      setAnswer('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVote = async (answerId, direction) => {
    if (!user?.token) {
      alert('You must be logged in to vote.');
      return;
    }

    const currentVote = votedAnswers[answerId];
    const action = currentVote === direction ? 'remove' : direction;

    try {
      const res = await fetch(`http://localhost:3000/api/answers/${answerId}/vote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Vote failed');
      }

      const updatedRes = await fetch(`http://localhost:3000/api/questions/${id}`);
      const updated = await updatedRes.json();
      setQuestion(updated);

      setVotedAnswers((prev) => ({
        ...prev,
        [answerId]: action === 'remove' ? null : direction,
      }));
    } catch (err) {
      alert('Error voting: ' + err.message);
    }
  };

  const handleAccept = async (answerId) => {
    console.log('Accepting answer:', answerId);
    try {
      const res = await fetch(`http://localhost:3000/api/answers/${answerId}/accept`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to accept answer');
      }

      
      const updatedRes = await fetch(`http://localhost:3000/api/questions/${id}`);
      const updated = await updatedRes.json();
      setQuestion(updated);
    } catch (err) {
      alert('Error accepting answer: ' + err.message);
    }
  };

  if (!question) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-2">{question.title}</h2>
      <div
        className="text-gray-700 mb-4"
        dangerouslySetInnerHTML={{ __html: question.description }}
      />
      <div className="flex gap-2 mb-6">
        {question.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>

      <h3 className="text-xl font-semibold mb-2">Answers</h3>
      {question.answers.length === 0 ? (
        <p className="mb-4">No answers yet.</p>
      ) : (
        question.answers.map((a, i) => (
          <div
            key={i}
            className={`mb-4 p-3 rounded border ${
              a.isAccepted ? 'border-green-600 bg-green-50' : 'bg-gray-50'
            }`}
          >
            <div
              dangerouslySetInnerHTML={{ __html: a.content }}
              className="text-gray-800 mb-2"
            />

            <div className="flex items-center gap-4 text-sm mt-2">
              <button
                className={`hover:underline ${
                  votedAnswers[a._id] === 'up' ? 'text-green-800 font-bold' : 'text-green-600'
                }`}
                onClick={() => handleVote(a._id, 'up')}
              >
                ⬆️ Upvote
              </button>
              <button
                className={`hover:underline ${
                  votedAnswers[a._id] === 'down' ? 'text-red-800 font-bold' : 'text-red-600'
                }`}
                onClick={() => handleVote(a._id, 'down')}
              >
                ⬇️ Downvote
              </button>
              <span className="text-gray-500">{a.votes || 0} votes</span>
              <button
                className="ml-auto text-blue-600 hover:underline"
                onClick={() => handleAccept(a._id)}
              >
                ✅ Accept
              </button>
            </div>
          </div>
        ))
      )}

      {user ? (
        (user.id || user._id) === question.author?._id ? (
          <p className="mt-4 text-gray-600 italic">You cannot answer your own question.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              rows="4"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border rounded p-2 mb-2"
              placeholder="Write your answer in HTML or plain text..."
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button type="submit" className="btn">
              Post Answer
            </button>
          </form>
        )
      ) : (
        <p className="mt-4 text-gray-600">Login to post an answer.</p>
      )}
    </div>
  );
};

export default QuestionDetail;
