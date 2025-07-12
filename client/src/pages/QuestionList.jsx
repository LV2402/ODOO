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
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-800 to-indigo-900 px-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to StackIt! 👋</h1>
        <p className="text-lg text-gray-200 mb-6 max-w-xl">
          Please log in or register to explore questions, help others, and be a part of our tech community.
        </p>
        <div className="flex gap-4">
          <Link
            to="/register"
            className="px-6 py-2 bg-white text-purple-700 font-semibold rounded shadow hover:bg-purple-100 transition"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="px-6 py-2 border border-white text-white rounded hover:bg-white hover:text-purple-800 transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">All Questions</h1>

      {questions.length === 0 ? (
        <p className="text-gray-600 text-center">No questions posted yet. Be the first to ask!</p>
      ) : (
        <div className="space-y-6">
          {questions.map((q) => (
            <QuestionCard key={q._id} question={q} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;