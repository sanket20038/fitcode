// src/utils/auth.js

// Get token from localStorage
export const getToken = () => localStorage.getItem('token');

// Get user object from localStorage
export const getUser = () => {
  const raw = localStorage.getItem('user');
  try {
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Invalid user data in localStorage", e);
    return null;
  }
};

// Get userType (e.g., 'owner' or 'client') from localStorage
export const getUserType = () => localStorage.getItem('userType');

// Save auth data safely
export const setAuth = (token, user, userType) => {
  if (token) localStorage.setItem('token', token);
  if (user) localStorage.setItem('user', JSON.stringify(user));
  if (userType) localStorage.setItem('userType', userType);
};

// Clear all auth data
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Check if user is owner
export const isOwner = () => {
  return getUserType() === 'owner';
};

// Check if user is client
export const isClient = () => {
  return getUserType() === 'client';
};
