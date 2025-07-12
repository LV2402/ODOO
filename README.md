# StackIt – A Minimal Q&A Forum Platform

StackIt is a *minimalistic question-and-answer forum* designed to enable collaborative learning and structured knowledge sharing. With a focus on simplicity, usability, and clean design, StackIt helps communities grow by encouraging users to ask questions, share answers, and interact meaningfully.

---

## 🚀 Overview

StackIt streamlines the Q&A experience, similar to platforms like Stack Overflow, but with a lightweight and user-centered approach. It emphasizes quick interactions, modern UI/UX, and community-led moderation.

> 🛠 Built by *Team HAcKV* for the *Odoo Hackathon 2025*  
> 👥 *Team Number:* 0853

Video Link : https://drive.google.com/file/d/1RLs21Wo0axxiwov2Yg84c4U2IPPFqr9z/view?usp=drive_link 

*Team Members:*
- Vamshi Lagishetty  
- Kavya Sahithi  
- Hanvith Sai Alla  
- Advaith Kannayagari  

---

## 👥 User Roles

| Role       | Permissions                                                                 |
|------------|------------------------------------------------------------------------------|
| *Guest*  | View all questions and answers                                               |
| *User*   | Register, log in, ask/answer questions, vote, receive notifications          |
| *Admin*  | Moderate content, ban users, broadcast platform messages, export activity    |

---

## 🔑 Core Features

### 1. Ask Questions
Users can submit questions using:
- *Title* – Concise and descriptive
- *Description* – With support for rich formatting:
  - Bold, Italics, Strikethrough  
  - Numbered/Bulleted Lists  
  - Emojis  
  - Hyperlinks  
  - Image Upload  
  - Text Alignment (Left, Center, Right)

Questions must include *multi-select tags* (e.g., React, JWT).

---

### 2. Answer Questions
- Logged-in users can answer any question.
- Answers support the same formatting as questions via the rich text editor.

---

### 3. Voting & Accepting Answers
- Upvote/downvote system for answers.
- Question authors can *accept* the most relevant answer.

---

### 4. Tagging System
- Enforces use of relevant *multi-select tags* to aid discovery and filtering.

---

### 5. Notification System
- Bell icon in navbar indicates unread notifications.
- Users get notified when:
  - Their question receives an answer  
  - Their answer gets commented on  
  - They’re mentioned using @username  

---

### 6. Admin Panel
Admins can:
- ❌ Remove inappropriate or spam content  
- 🚫 Ban users violating platform rules  
- 📤 Send global announcements  
- 📊 Download platform reports (user activity, feedback, engagement)

---

## 🧠 Tech Stack

- *Frontend:* React.js, Tailwind CSS  
- *Backend:* Node.js, Express.js  
- *Database:* MongoDB  
- *Editor:* TinyMCE (Rich Text Support)  
- *Authentication:* JWT  
- *Deployment:* Coming Soon  

---

## 🛠 Installation & Setup

### Prerequisites

- Node.js ≥ 16.x  
- MongoDB ≥ 5.x  
- Yarn or npm  

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/LV2402/ODOO
cd ODOO

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Set up environment variables
cp .env.example .env
# Edit the .env file to include MongoDB URI, JWT_SECRET, etc.

# Run the backend server
npm start

# Open a new terminal and run the frontend
cd ../client
npm start
