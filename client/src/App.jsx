import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Header from './components/Header';
import QuestionList from './pages/QuestionList';
import QuestionDetail from './pages/QuestionDetail';
import AskQuestion from './pages/AskQuestion';
import Home from './pages/Home';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Routes>
        <Route path="/" element={isLoggedIn ? <QuestionList /> : <Home/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
        <Route
          path="/ask"
          element={isLoggedIn ? <AskQuestion /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;