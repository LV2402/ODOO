import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch('http://localhost:3000/api/notifications', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();
  }, [user]);

  const markAllRead = async () => {
    try {
      await fetch('http://localhost:3000/api/notifications/mark-read', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  const handleBellClick = () => {
    const willOpen = !dropdownOpen;
    setDropdownOpen(willOpen);
    if (willOpen) markAllRead();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  console.log(user)
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="bg-gradient-to-r from-purple-700 to-indigo-800 shadow-md text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-white">
          StackIt
        </Link>

        <nav className="flex gap-4 items-center relative text-sm">
          {isLoggedIn ? (
            <>
              <Link
                to="/ask"
                className="hover:bg-white hover:text-purple-800 px-3 py-1 rounded transition duration-200"
              >
                Ask
              </Link>

              <div className="relative">
                <button onClick={handleBellClick} className="relative hover:text-yellow-300 transition">
                  🔔
                  {unreadCount > 0 && (
                    <span className="absolute top-[-6px] right-[-10px] bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-8 bg-white text-gray-800 shadow-xl w-64 rounded border z-50 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-3 text-sm text-center">No notifications</div>
                    ) : (
                      notifications.map((n, idx) => (
                        <a
                          key={idx}
                          href={n.link || '#'}
                          className={`block px-4 py-2 text-sm border-b hover:bg-gray-100 transition ${
                            n.isRead ? 'bg-gray-50' : 'bg-purple-50'
                          }`}
                        >
                          {n.message}
                        </a>
                      ))
                    )}
                  </div>
                )}
              </div>

              <span className="text-gray-200 text-sm">Hi, {user.user.username}</span>

              <button
                onClick={handleLogout}
                className="text-red-300 hover:text-white hover:underline transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:bg-white hover:text-purple-800 px-3 py-1 rounded transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:bg-white hover:text-purple-800 px-3 py-1 rounded transition duration-200"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
