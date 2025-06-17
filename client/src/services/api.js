// services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred');
    error.response = { data };
    error.status = response.status;
    throw error;
  }
  
  return data;
};

// Helper function to make API requests
const makeRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Send email function
export const sendEmail = async (emailData) => {
  return await makeRequest('/email/send', {
    method: 'POST',
    body: JSON.stringify(emailData),
  });
};

// Get email history function
export const getEmailHistory = async () => {
  return await makeRequest('/email/history', {
    method: 'GET',
  });
};

// Test server connection
export const testConnection = async () => {
  return await makeRequest('/health', {
    method: 'GET',
  });
};

// API utilities object
const apiUtils = {
  sendEmail,
  getEmailHistory,
  testConnection,
  baseUrl: API_BASE_URL
};

export default apiUtils;