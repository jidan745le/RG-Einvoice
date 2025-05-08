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
        if (token || !token) {
            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmEyZmVkODktZDA3YS00MTRiLThkYzctMzM2MTFiMzRmOWYyIiwiZW1haWwiOiJhZG1pbkByZ2V4cC5jb20iLCJuYW1lIjoicmdleHAgQWRtaW4iLCJ0ZW5hbnRJZCI6IjhjMTg2Mjg2LTdiMzQtNDBkOS05MzgwLTI5OTQwMWE3ZmQyZSIsInJvbGVzIjpbeyJpZCI6IjQ1MzVlYzAzLWY4NDUtNDkyZS1iZjM1LTBmMTBmZGY1NTRlMiIsIm5hbWUiOiJUZW5hbnQgQWRtaW5pc3RyYXRvciIsImRlc2NyaXB0aW9uIjoiSGFzIGZ1bGwgYWNjZXNzIHRvIG1hbmFnZSB0aGUgdGVuYW50IiwidGVuYW50SWQiOiI4YzE4NjI4Ni03YjM0LTQwZDktOTM4MC0yOTk0MDFhN2ZkMmUiLCJpc1N5c3RlbVJvbGUiOnRydWUsImNyZWF0ZWRBdCI6IjIwMjUtMDUtMDdUMTU6MTQ6MTQuMzI0WiIsInVwZGF0ZWRBdCI6IjIwMjUtMDUtMDdUMTU6MTQ6MTQuMzI0WiJ9XSwic3ViQXBwbGljYXRpb25zIjpbeyJpZCI6ImMwMmUzNjE5LTAzNmMtNGZiNS04YWQwLWY3M2U4YmU2YTFkNCIsImNvZGUiOiJlaW52b2ljZSIsIm5hbWUiOiJFbGVjdHJvbmljIEludm9pY2UgU3lzdGVtIiwiZGVzY3JpcHRpb24iOiJNYW5hZ2UgZWxlY3Ryb25pYyBpbnZvaWNlcyIsInBhdGgiOiIvZWludm9pY2UiLCJzdWJkb21haW4iOm51bGwsInVybCI6Ii9lLWludm9pY2UiLCJzdGF0dXMiOiJhY3RpdmUiLCJjcmVhdGVkQXQiOiIyMDI1LTA1LTA3VDE1OjE0OjE0LjQyM1oiLCJ1cGRhdGVkQXQiOiIyMDI1LTA1LTA3VDE1OjE0OjE0LjQyM1oifSx7ImlkIjoiM2E0MzZhMGEtYTZlZC00OTUyLWFjYmEtN2U0NWE0ZmI5MGE3IiwiY29kZSI6Im1hcmtldGluZ2h1YiIsIm5hbWUiOiJNYXJrZXRpbmcgSHViIiwiZGVzY3JpcHRpb24iOiJNYW5hZ2UgbWFya2V0aW5nIGNhbXBhaWducyIsInBhdGgiOiIvbWFya2V0aW5naHViIiwic3ViZG9tYWluIjpudWxsLCJ1cmwiOiIvbWFya2V0aW5naHViIiwic3RhdHVzIjoiYWN0aXZlIiwiY3JlYXRlZEF0IjoiMjAyNS0wNS0wN1QxNToxNDoxNC40MzlaIiwidXBkYXRlZEF0IjoiMjAyNS0wNS0wN1QxNToxNDoxNC40MzlaIn0seyJpZCI6IjJiM2ZhMDA0LTRkYmYtNDgxOS1iODdiLWZmMGE5YmI4OGU4NCIsImNvZGUiOiJpbWFnZW1hcCIsIm5hbWUiOiJJbWFnZSBNYXBwaW5nIFN5c3RlbSIsImRlc2NyaXB0aW9uIjoiTWFuYWdlIGltYWdlIG1hcHBpbmdzIiwicGF0aCI6Ii9pbWFnZW1hcCIsInN1YmRvbWFpbiI6bnVsbCwidXJsIjoiL2ltYWdlbWFwIiwic3RhdHVzIjoiYWN0aXZlIiwiY3JlYXRlZEF0IjoiMjAyNS0wNS0wN1QxNToxNDoxNC40MzFaIiwidXBkYXRlZEF0IjoiMjAyNS0wNS0wN1QxNToxNDoxNC40MzFaIn1dfSwiaWF0IjoxNzQ2NjY4NTcxLCJleHAiOjE3NDcyNzMzNzF9.o99r03crcLlBIRQbYFjZiBfbnjHps-Z728Vov8bF5zk"}`
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
        } else if (error.response && error.response.status === 403) {
            // Redirect to home page
            window.location.href = '/marketplace';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 