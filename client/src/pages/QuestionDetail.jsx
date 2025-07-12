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
      const res = await fetch(http://localhost:3000/api/questions/${id});
      const data = await res.json();
      setQuestion(data);
    };
    fetchQuestion();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    try {
      const res = await fetch(http://localhost:3000/api/answers/${id}, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: Bearer ${user?.token},
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
      const res = await fetch(http://localhost:3000/api/answers/${answerId}/vote, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: Bearer ${user.token},
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Vote failed');
      }

      const updatedRes = await fetch(http://localhost:3000/api/questions/${id});
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
    try {
      const res = await fetch(http://localhost:3000/api/answers/${answerId}/accept, {
        method: 'PATCH',
        headers: {
          Authorization: Bearer ${user?.token},
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to accept answer');
      }

      const updatedRes = await fetch(http://localhost:3000/api/questions/${id});
      const updated = await updatedRes.json();
      setQuestion(updated);
    } catch (err) {
      alert('Error accepting answer: ' + err.message);
    }
  };

  if (!question) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-purple-800 mb-4">{question.title}</h2>

      <div
        className="prose prose-purple mb-6 max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: question.description }}
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {question.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      <h3 className="text-xl font-semibold mb-4 text-gray-700">Answers</h3>
      {question.answers.length === 0 ? (
        <p className="text-gray-600 italic mb-6">No answers yet. Be the first to answer!</p>
      ) : (
        <div className="space-y-5 mb-6">
          {question.answers.map((a, i) => (
            <div
              key={i}
              className={`p-4 rounded-md border relative ${
                a.isAccepted ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-white'
              }`}
            >
              {a.isAccepted && (
                <span className="absolute top-2 right-2 bg-green-600 text-white px-2 py-0.5 text-xs rounded">
                  Accepted
                </span>
              )}
              <div
                className="text-gray-800"
                dangerouslySetInnerHTML={{ __html: a.content }}
              />
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <button
                  className={`hover:underline ${
                    votedAnswers[a._id] === 'up' ? 'text-green-700 font-semibold' : 'text-green-500'
                  }`}
                  onClick={() => handleVote(a._id, 'up')}
                >
                  ⬆ Upvote
                </button>
                <button
                  className={`hover:underline ${
                    votedAnswers[a._id] === 'down' ? 'text-red-700 font-semibold' : 'text-red-500'
                  }`}
                  onClick={() => handleVote(a._id, 'down')}
                >
                  ⬇ Downvote
                </button>
                <span className="text-gray-500">{a.votes || 0} votes</span>
                {user?.id === question.author?._id && !a.isAccepted && (
                  <button
                    className="ml-auto text-blue-600 hover:underline"
                    onClick={() => handleAccept(a._id)}
                  >
                    ✅ Accept
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {user ? (
        (user.id || user._id) === question.author?._id ? (
          <p className="mt-4 text-gray-500 italic">You cannot answer your own question.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Your Answer</h4>
            <textarea
              rows="5"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Write your answer in HTML or plain text..."
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              type="submit"
              className="mt-4 bg-purple-700 hover:bg-purple-800 text-white font-medium px-5 py-2 rounded transition"
            >
              Post Answer
            </button>
          </form>
        )
      ) : (
        <p className="mt-6 text-gray-500 text-sm">Please log in to post an answer.</p>
      )}
    </div>
  );
};

export default QuestionDetail;