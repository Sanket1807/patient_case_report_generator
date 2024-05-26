// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Login = ({ handleLogin }) => {
  const navigate = useNavigate();
  const [, setCookie] = useCookies(['user']);

  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Intern');
  const [rollNumberError, setRollNumberError] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d+$/.test(rollNumber)) {
      setRollNumberError('Only digits are allowed in the roll number field');
      return;
    }

    setRollNumberError('');

    if (rollNumber.trim() !== '' && password.trim() !== '') {
      try {
        // Make API request to validate login credentials
        const response = await axios.post('http://localhost:8080/login', {
          rollNumber,
          password,
        });

        console.log('Server Response:', response.data); // Log the entire response

        const userData = response.data;
        console.log('User Data:', userData);

        // Check if the user exists
        if (userData) {
          console.log('User Role:', userData.Role); // Check the role property

          // Check if the user has the required privileges
          if (userData.Role === 'Prof.' || userData.Role === 'R2' || userData.Role === 'R3') {
            handleLogin(userData);

            // Redirect to the AdminPanel.js page
            navigate('/admin');
          } else if (userData.Role === 'Intern' || userData.Role === 'R1') {
            handleLogin(userData);

            // Redirect to the AddNewEntries.js page for Intern/R1 users
            navigate('/add-new-entries');
          } else {
            setLoginError('Insufficient privileges to access the Admin Panel.');
          }
        } else {
          setLoginError('Invalid login credentials.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setLoginError('Invalid login credentials.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Roll Number:
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => {
              const value = e.target.value;

              if (!/^[0-9]*$/.test(value)) {
                setRollNumberError('Only digits are allowed in the roll number field');
              } else {
                setRollNumber(value);
                setRollNumberError('');
              }
            }}
          />
          {rollNumberError && <p style={{ color: 'red' }}>{rollNumberError}</p>}
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        {/* <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Intern">Intern</option>
            <option value="R1">R1</option>
            <option value="R2">R2</option>
            <option value="R3">R3</option>
            <option value="Prof.">Prof.</option>
          </select>
        </label> */}
        <br />
        <button type="submit">Login</button>
      </form>
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
    </div>
  );
};

export default Login;
