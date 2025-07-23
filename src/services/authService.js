import API from '../api/api';

export const register = async (userData) => {
  try {
    const res = await API.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    localStorage.setItem('token', res.data.token);
    return res.data.user;
  } catch (err) {
    throw err.response?.data?.message || 'Registration failed';
  }
};

// Similar login/logout functions