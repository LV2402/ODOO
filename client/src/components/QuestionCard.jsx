import React from 'react';
import { Link } from 'react-router-dom';

const QuestionCard = ({ question }) => {
  return (
    <div className="bg-white shadow-sm border rounded p-4">
      <div className="flex justify-between items-center mb-2">
        <Link to={`/questions/${question._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
          {question.title}
        </Link>
        <span className="text-sm text-gray-500">{question.answers?.length || 0} answers</span>
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        {question.tags.map((tag, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
