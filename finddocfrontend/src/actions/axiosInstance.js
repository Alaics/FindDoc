import axios from 'axios';
import { useHistory } from 'react-router-dom';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    if (userInfo && userInfo.access) {
      const currentDate = new Date();
      const decodedToken = parseJwt(userInfo.access);

      // Check if the access token exists and if it's expired
      if (decodedToken && decodedToken.exp * 1000 < currentDate.getTime()) {
        try {
          const response = await axios.post('/api/token/refresh/', {
            refresh: userInfo.refresh,
          });

          const newAccessToken = response.data.access;

          // Update localStorage with the new access token
          userInfo.access = newAccessToken;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));

          // Attach the new access token to the request headers
          config.headers.Authorization = `Bearer ${newAccessToken}`;
        } catch (error) {
          console.error('Error refreshing token', error);

          // Handle refresh token expiration (e.g., force logout or redirect to login)
          localStorage.removeItem('userInfo');
          window.location.href = '/login'; // Redirect to login page if refresh fails
        }
      } else {
        // Attach the access token to the request headers if it's still valid
        config.headers.Authorization = `Bearer ${userInfo.access}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to decode JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error parsing token', e);
    return null;
  }
};

export default axiosInstance;
