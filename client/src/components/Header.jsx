import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ Load notifications on login to show unread count
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch('http://localhost:3000/api/notifications', {
          headers: { Authorization: `Bearer ${user.token}` }
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
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">StackIt</Link>

        <nav className="flex gap-4 items-center text-gray-700 relative">
          {isLoggedIn && (
            <>
              <Link to="/ask" className="hover:text-blue-600">Ask</Link>
              <div className="relative">
                <button onClick={handleBellClick} className="relative">
                  🔔
                  {unreadCount > 0 && (
                    <span className="absolute top-[-6px] right-[-10px] bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-8 bg-white shadow-lg w-64 rounded border z-50 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-3 text-gray-600 text-sm">No notifications</div>
                    ) : (
                      notifications.map((n, idx) => (
                        <a
                          key={idx}
                          href={n.link || '#'}
                          className={`block px-4 py-2 text-sm border-b hover:bg-gray-100 ${
                            n.isRead ? 'bg-gray-100' : 'bg-blue-50'
                          }`}
                        >
                          {n.message}
                        </a>
                      ))
                    )}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-500">Hi, {user?.username}</span>
              <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link to="/register" className="hover:text-blue-600">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
