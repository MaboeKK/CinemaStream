import axios from 'axios';

const getCsrfToken = async () => {
  try {
    const response = await axios.get('/api/auth/csrf-token', { withCredentials: true });
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF Token:', error);
  }
};

export default getCsrfToken;