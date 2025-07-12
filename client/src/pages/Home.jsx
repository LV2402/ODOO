import React from 'react';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-800 to-indigo-900 text-white px-6 py-10 flex flex-col items-center">
      {/* Team Section */}
      <section className="mb-16 w-full max-w-4xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Team HAcKV – Odoo Hackathon 2025</h1>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto">Code, Build, Repeat!</p>

        <div className="mt-8 text-left">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">👨‍💻 Team Members</h2>
          <ul className="text-lg space-y-2 text-gray-100 pl-5 list-disc">
            <li><span className="font-medium text-white">Vamshi Lagishetty</span> – Frontend & Backend</li>
            <li><span className="font-medium text-white">Hanvith Sai Alla</span> – Frontend</li>
            <li><span className="font-medium text-white">Kavya Sahithi</span> – Backend</li>
            <li><span className="font-medium text-white">Kannayagari Advaith</span> – Frontend</li>
          </ul>
        </div>
      </section>

      {/* Event Info */}
      <section className="mb-16 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">📢 Odoo Hackathon 2025</h2>
        <p className="text-gray-200 leading-relaxed">
          <span className="font-semibold text-white">Odoo Hackathon</span> is a 24-hour marathon for developers to showcase creativity and code solutions to real-world problems. Whether you're a student, fresher, or enthusiast, this event is for you!
        </p>

        <div className="mt-4 space-y-2 text-gray-300">
          <p><strong className="text-white">📍 Location:</strong> Gandhinagar, Gujarat</p>
          <p><strong className="text-white">🗓 Dates:</strong> 11–12 August 2025</p>
          <p><strong className="text-white">🎯 Format:</strong> Online (1st round), Offline (finals)</p>
          <p><strong className="text-white">🏆 Prizes:</strong> ₹1.5 Lakhs + Certificates + Internships</p>
        </div>
      </section>

      {/* Project Info */}
      <section className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">💡 Our Project – StackIt</h2>
        <p className="text-gray-200 leading-relaxed">
          <span className="font-semibold text-white">StackIt</span> is a minimal Q&A forum platform built to foster collaborative learning and structured knowledge sharing. Simple, intuitive, and focused on the core user experience — asking and answering questions within a community.
        </p>
      </section>
    </div>
  );
};

export default Home;