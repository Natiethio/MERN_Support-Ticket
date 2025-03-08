import axios from 'axios';

// Create a shared Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001/api', 
  withCredentials: true, 
});


api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Unauthorized. No token provided." &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; 

      try {
        await api.post('/refresh_token');

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); 
  }
);

export default api;
