import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const ApproveReject = () => {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch pending signups
    axios.get('http://localhost:8080/signup/pendingsignups')
      .then(response => {
        setUserData(response.data);
        console.log(response.data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching pending signups:', error);
        setError('An error occurred while fetching pending signups. Please try again later.');
      });
  }, []);

  const handleAction = async (index, action, userId, rollNumber) => {
    try {
      if (action === 'accept') {
        // Make API request to approve user
        await axios.post('http://localhost:8080/approve-user', { userId });
      } else if (action === 'reject') {
        // Make API request to delete user
        await axios.delete(`http://localhost:8080/signup/pendingsignups/${rollNumber}`);
      }
      // Refresh pending signups after action
      const updatedUserData = [...userData];
      updatedUserData.splice(index, 1);
      setUserData(updatedUserData);
    } catch (error) {
      console.error(`Error ${action === 'accept' ? 'accepting' : 'rejecting'} user:`, error);
      setError(`An error occurred while ${action === 'accept' ? 'accepting' : 'rejecting'} user. Please try again later.`);
    }
  };

  return (
    <div className="container-approve-reject">
      {error && <p className="error">{error}</p>}
      <div className="header-row-approve-reject">
        <div>User Name</div>
        <div>Roll Number</div>
        <div>Department</div>
        <div style={{ textAlign: 'center' }}>Unit</div>
        <div>Action</div>
      </div>

      {userData.map((user, index) => (
        <div key={index} className="data-row-approve-reject">
          <div>{user.Username}</div>
          <div>{user.RNo}</div>
          <div>{user.Department}</div>
          <div>{user.Unit}</div>
          <div className="action-buttons-approve-reject">
            <button onClick={() => handleAction(index, 'accept', user._id)}>Accept</button>
            <button onClick={() => handleAction(index, 'reject', user._id, user.RNo)}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApproveReject;
