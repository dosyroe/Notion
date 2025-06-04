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
      const Access = localStorage.getItem('Access');
      try {
        const refreshResponse = await axios.put(
          'http://localhost:5005/api/auth/refresh',
          null, // Тело запроса пустое
          {
            params: { Access }, // Access передаётся в параметрах
            withCredentials: true,
          }
        );
        if (refreshResponse.data?.Access) {
          localStorage.setItem('Access', refreshResponse.data.Access);
          originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.Access}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('Access');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;