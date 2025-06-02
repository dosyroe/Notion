import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/api/auth/refresh')
    ) {
      originalRequest._retry = true;
      const AccessToken = localStorage.getItem('AccessToken');
      try {
        const refreshResponse = await axios.put(
          'http://localhost:5005/api/auth/refresh',
          { AccessToken: AccessToken },
          { withCredentials: true }
        );
        if (refreshResponse.data?.AccessToken) {
          localStorage.setItem('AccessToken', refreshResponse.data.AccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.AccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('AccessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;