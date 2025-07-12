import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import QuestionCard from '../components/QuestionCard';
import { Link } from 'react-router-dom';

const QuestionList = () => {
  const { isLoggedIn } = useAuth();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchQuestions = async () => {
        try {
          const res = await fetch('http://localhost:3000/api/questions');
          const data = await res.json();
          setQuestions(data);
        } catch (err) {
          console.error('Error fetching questions:', err);
        }
      };
      fetchQuestions();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to StackIt!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Please log in to explore and answer questions from the community.
        </p>
        <div className="space-x-4">
          <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Register
          </Link>
          <Link to="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Questions</h1>
      {questions.length === 0 ? (
        <p>No questions posted yet.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionCard key={q._id} question={q} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
