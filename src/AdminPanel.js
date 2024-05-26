// src/AdminPanel.js
import React, { useState } from 'react';
import './App.css';
import AddRemoveDepartments from './AddRemoveDepartments'; // Import the new component
import AddNewEntries from './AddNewEntries'; // Import the new component
import ApproveReject from './ApproveReject'; // Import the new component

const AdminPanel = ({ user }) => {
  // State to manage the selected sidebar option
  const [selectedOption, setSelectedOption] = useState('AddRemoveDepartments');

  // Function to render the selected component based on the sidebar option
  const renderComponent = () => {
    switch (selectedOption) {
      case 'AddRemoveDepartments':
        // Pass the user prop to AddRemoveDepartments component
        return <AddRemoveDepartments user={user} />;
      case 'AddNewEntries':
        return <AddNewEntries />;
      case 'ApproveReject':
        return <ApproveReject />;
      // Add more cases for additional sidebar options
      default:
        return null;
    }
  };

  return (
    <div className="admin-panel">
      <div className="sidebar">
        <button onClick={() => setSelectedOption('AddRemoveDepartments')}>Add or Remove Departments</button>
        <button onClick={() => setSelectedOption('AddNewEntries')}>Add New Entries</button>
        <button onClick={() => setSelectedOption('ApproveReject')}>Approve/Reject New User Requests</button>
      </div>

      <div className="main-content">
        <h2>Admin Panel</h2>
        {renderComponent()}
      </div>
    </div>
  );
};

export default AdminPanel;
