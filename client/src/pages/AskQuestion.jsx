import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { useAuth } from '../context/AuthContext';

const AskQuestion = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: Bearer ${user.token},
        },
        body: JSON.stringify({
          title,
          description,
          tags: tags.split(',').map((tag) => tag.trim()),
        }),
      });

      if (!res.ok) throw new Error('Failed to post question');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Ask a Question</h1>
      {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g. How to manage state in React?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* TinyMCE Editor */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Description</label>
          <Editor
            apiKey="lyllgpv4jw20fyroz7b2lz6kuiv1qljmqeljitkj1453dyne"
            value={description}
            onEditorChange={handleEditorChange}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
              ],
              toolbar:
                'undo redo | bold italic underline | bullist numlist | link image | alignleft aligncenter alignright | code',
            }}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g. react, javascript, hooks"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md font-medium transition"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
};

export default AskQuestion;