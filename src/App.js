import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';
import AddNewEntries from './AddNewEntries';
import axios from 'axios'; // Import axios for making HTTP requests
import { useCookies } from 'react-cookie';

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  useEffect(() => {
    // Check for user authentication on page load
    const storedUser = cookies.user;
    if (storedUser) {
      setUser(storedUser);
      // Redirect to AdminPanel if user is Prof./R2/R3
      if (storedUser.role === 'Prof.' || storedUser.role === 'R2' || storedUser.role === 'R3') {
        navigate('/admin');
      } else if (storedUser.role === 'Intern' || storedUser.role === 'R1') {
        // Redirect to AddNewEntries if user is Intern/R1
        navigate('/add-new-entries');
      }
    }
  }, [navigate, cookies.user]);

  const handleLogin = async (userData) => {
    setUser(userData);

    // Set a cookie upon successful login
    setCookie('user', userData, { path: '/' });

    // Redirect based on user role
    if (userData.role === 'Prof.' || userData.role === 'R2' || userData.role === 'R3') {
      navigate('/admin');
    } else if (userData.role === 'Intern' || userData.role === 'R1') {
      navigate('/add-new-entries');
    } else {
      // Redirect to Login page for all other roles
      navigate('/login');
    }

    // Send email to admin upon successful signup
    try {
      await axios.post('http://localhost:8080/signup/send-email', userData);
      console.log('Email sent to admin');
    } catch (error) {
      console.error('Error sending email to admin:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);

    // Remove the user cookie upon logout
    removeCookie('user');

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <>
      <nav>
        {user ? (
          <>
            <span>Welcome!</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">SignUp</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp handleLogin={handleLogin} />} />
        {user ? (
          <>
            {user.role === 'Prof.' || user.role === 'R2' || user.role === 'R3' ? (
              <Route path="/admin" element={<AdminPanel user={user} />} />
            ) : (
              <Route path="/dashboard" element={<Dashboard />} />
            )}
          </>
        ) : (
          <Route path="/" element={<Login handleLogin={handleLogin} />} />
        )}
        {/* Add the route for AddNewEntries here */}
        <Route path="/add-new-entries" element={<AddNewEntries />} />
      </Routes>
    </>
  );
};

export default App;
