import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ handleLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: '',
    role: 'Intern',
    department: '',
    unit: 'Unit 1',
    rollNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [existingUserError, setExistingUserError] = useState('');

  // Modify the form submission to send data to the correct endpoint
const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateForm(formData);
  if (Object.keys(validationErrors).length === 0) {
    try {
      const existingUserResponse = await axios.post(
        'http://localhost:8080/signup/check-existing',
        {
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          rollNumber: formData.rollNumber,
        }
      );

      if (existingUserResponse.data.exists) {
        setExistingUserError('User with the provided details already exists.');
        return;
      }

      setExistingUserError('');

      // Update the endpoint to '/signup/pending'
      const response = await axios.post('http://localhost:8080/signup/pending', {
        Username: formData.username,
        Password: formData.password,
        Email: formData.email,
        Phone: formData.phoneNumber,
        Role: formData.role,
        Department: formData.department,
        Unit: formData.unit,
        RNo: formData.rollNumber,
        Approved: false,
      });
      console.log('Record added to pendingsignups:', response.data);
      alert('Your sign-up request has been submitted. Please wait for admin approval.');
      navigate('/login');
    } catch (error) {
      console.error('Error checking/updating record:', error);
      alert('An error occurred while processing your request. Please try again later.');
    }
  } else {
    setErrors(validationErrors);
  }
};

  const validateForm = (data) => {
    const errors = {};

    if (!data.username) {
      errors.username = 'Username is required';
    }

    if (!data.password) {
      errors.password = 'Password is required';
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    }

    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!data.email) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = 'Invalid email format';
      }
    }

    if (!data.phoneNumber) {
      errors.phoneNumber = 'Phone Number is required';
    } else {
      const phoneNumberRegex = /^\d{10}$/;
      if (!phoneNumberRegex.test(data.phoneNumber)) {
        errors.phoneNumber = 'Invalid phone number format (10 digits only)';
      }
    }

    if (!data.department) {
      errors.department = 'Department is required';
    }

    if (!data.unit) {
      errors.unit = 'Unit is required';
    }

    if (!data.rollNumber) {
      errors.rollNumber = 'Roll Number is required';
    } else {
      const rollNumberRegex = /^\d+$/;
      if (!rollNumberRegex.test(data.rollNumber)) {
        errors.rollNumber = 'Roll Number must only contain digits';
      }
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: null,
    });
  };

  const departmentsOptions = [
    'Cardiology',
    'Dermatology',
    'ENT',
    'Gynecology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Skin',
  ];

  const unitsOptions = Array.from({ length: 10 }, (_, index) => `Unit ${index + 1}`);

  return (
    <div className="container">
      <h2>SignUp</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </label>
        <br />
        <label>
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </label>
        <br />
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </label>
        <br />
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
        </label>
        <br />
        <label>
          Role:
          <select
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="Intern">Intern</option>
            <option value="R1">R1</option>
            <option value="R2">R2</option>
            <option value="R3">R3</option>
            <option value="Prof.">Prof.</option>
          </select>
        </label>
        <br />
        <label>
          Department:
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departmentsOptions.map((department, index) => (
              <option key={index} value={department}>
                {department}
              </option>
            ))}
          </select>
          {errors.department && <p className="error">{errors.department}</p>}
        </label>
        <br />
        <label>
          Unit:
          <select name="unit" value={formData.unit} onChange={handleChange}>
            {unitsOptions.map((unit, index) => (
              <option key={index} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors.unit && <p className="error">{errors.unit}</p>}
        </label>
        <br />
        <label>
          Roll Number:
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
          />
          {errors.rollNumber && <p className="error">{errors.rollNumber}</p>}
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {existingUserError && <p className="error">{existingUserError}</p>}
    </div>
  );
};

export default SignUp;
