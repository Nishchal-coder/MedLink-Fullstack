/**
 * React Sign-Up Component Example
 * This example shows how to integrate the existing Sign-Up UI with the Express backend
 * 
 * Instructions:
 * 1. Replace the existing form submission handler with this code
 * 2. Update the API_BASE_URL to match your backend server
 * 3. Customize the success/error handling based on your UI requirements
 */

import React, { useState } from 'react';

const SignUpForm = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    nid: ''
  });

  // State for form status
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // API Configuration
  const API_BASE_URL = 'http://localhost:5000'; // Update this to match your backend URL

  /**
   * Handle input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    if (message) {
      setMessage('');
    }
  };

  /**
   * Handle form submission
   * Sends signup data to Express backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.password || !formData.nid) {
      setMessage('All fields are required');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      console.log('🚀 Sending signup request to backend...');
      console.log('📋 Form data:', {
        name: formData.name,
        email: formData.email,
        nid: formData.nid,
        password: '[HIDDEN]'
      });

      // Send POST request to Express backend
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      // Parse response
      const data = await response.json();
      console.log('📥 Response data:', data);

      if (response.ok) {
        // Success - user created
        console.log('✅ User created successfully:', data.userId);
        setMessage(`Welcome ${data.user.name}! Your account has been created successfully.`);
        setIsSuccess(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          nid: ''
        });

        // Optional: Redirect to login page or dashboard
        // setTimeout(() => {
        //   window.location.href = '/login';
        // }, 2000);

      } else {
        // Error - display error message
        console.log('❌ Signup failed:', data.error);
        setMessage(data.error || 'Signup failed. Please try again.');
        setIsSuccess(false);
      }

    } catch (error) {
      // Network or other errors
      console.error('❌ Network error during signup:', error);
      setMessage('Network error. Please check your connection and try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-form">
      <h2>Create Account</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
            disabled={isLoading}
          />
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>

        {/* National ID Field */}
        <div className="form-group">
          <label htmlFor="nid">National ID</label>
          <input
            type="text"
            id="nid"
            name="nid"
            value={formData.nid}
            onChange={handleInputChange}
            placeholder="Enter your National ID"
            required
            disabled={isLoading}
            minLength={10}
            maxLength={20}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="submit-btn"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      {/* Message Display */}
      {message && (
        <div className={`message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Additional Info */}
      <div className="form-info">
        <p>Already have an account? <a href="/login">Sign In</a></p>
      </div>
    </div>
  );
};

export default SignUpForm;

/**
 * CSS Styles (add to your CSS file)
 * 
 * .signup-form {
 *   max-width: 400px;
 *   margin: 0 auto;
 *   padding: 20px;
 *   border: 1px solid #ddd;
 *   border-radius: 8px;
 *   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
 * }
 * 
 * .form-group {
 *   margin-bottom: 15px;
 * }
 * 
 * .form-group label {
 *   display: block;
 *   margin-bottom: 5px;
 *   font-weight: bold;
 * }
 * 
 * .form-group input {
 *   width: 100%;
 *   padding: 10px;
 *   border: 1px solid #ddd;
 *   border-radius: 4px;
 *   font-size: 16px;
 * }
 * 
 * .form-group input:disabled {
 *   background-color: #f5f5f5;
 *   cursor: not-allowed;
 * }
 * 
 * .submit-btn {
 *   width: 100%;
 *   padding: 12px;
 *   background-color: #007bff;
 *   color: white;
 *   border: none;
 *   border-radius: 4px;
 *   font-size: 16px;
 *   cursor: pointer;
 * }
 * 
 * .submit-btn:disabled {
 *   background-color: #6c757d;
 *   cursor: not-allowed;
 * }
 * 
 * .message {
 *   margin-top: 15px;
 *   padding: 10px;
 *   border-radius: 4px;
 *   text-align: center;
 * }
 * 
 * .message.success {
 *   background-color: #d4edda;
 *   color: #155724;
 *   border: 1px solid #c3e6cb;
 * }
 * 
 * .message.error {
 *   background-color: #f8d7da;
 *   color: #721c24;
 *   border: 1px solid #f5c6cb;
 * }
 * 
 * .form-info {
 *   margin-top: 20px;
 *   text-align: center;
 * }
 * 
 * .form-info a {
 *   color: #007bff;
 *   text-decoration: none;
 * }
 * 
 * .form-info a:hover {
 *   text-decoration: underline;
 * }
 */
