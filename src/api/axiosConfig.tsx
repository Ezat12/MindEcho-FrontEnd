import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://chef-reclining-deodorize.ngrok-free.dev',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
});

// REQUEST INTERCEPTOR

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

  
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('AXIOS ERROR =>', error?.response?.data);

    if (error?.response?.status === 401) {
      localStorage.clear();
     React Router، يمكنك هنا عمل window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
