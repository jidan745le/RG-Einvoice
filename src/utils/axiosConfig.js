import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: '/e-invoice/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to set Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        console.log('Token from localStorage:', token); // Debug log
        if (token) {
            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token}`
            };
            console.log('Request headers:', config.headers); // Debug log
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken');
            const currentUrl = window.location.href;
            // Redirect to home page
            window.location.href = '/?returnUrl=' + encodeURIComponent(currentUrl);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 