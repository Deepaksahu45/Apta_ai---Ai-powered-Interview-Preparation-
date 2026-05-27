import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const registerUser = async ({ username, email, password }) => {
  try {
    const response = await api.post('/api/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || 'Registration failed. Please try again.';
    throw new Error(message);
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Invalid email or password.';
    throw new Error(message);
  }
};

export const logoutUser = async () => {
  try {
    await api.get('/api/auth/logout');
  } catch (error) {
    console.error('Error logging out user:', error);
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/api/auth/get-me');
    return response.data;
  } catch (error) {
    throw new Error('Session expired');
  }
};
