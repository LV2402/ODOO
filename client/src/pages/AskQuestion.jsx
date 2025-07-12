import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { useAuth } from '../context/AuthContext';
import QuestionDetail from './QuestionDetail';

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
          Authorization: `Bearer ${user.token}`,
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Ask a Question</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <input
          className="input mb-4 w-full border rounded p-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* TinyMCE Editor for Description */}
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

        {/* Tags Input */}
        <input
          className="input mt-4 w-full border rounded p-2"
          placeholder="Comma separated tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="btn mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AskQuestion;
