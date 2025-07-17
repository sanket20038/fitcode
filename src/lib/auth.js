export const getToken = () => localStorage.getItem('token');
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
export const getUserType = () => localStorage.getItem('userType');

export const setAuth = (token, user, userType) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('userType', userType);
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const isOwner = () => {
  return getUserType() === 'owner';
};

export const isClient = () => {
  return getUserType() === 'client';
};

