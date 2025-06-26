import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://apimates.testingtest.fr/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.status, error.message);
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
