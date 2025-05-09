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
                'Authorization': `Bearer ${token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiZjRkMDA4MTgtZjc3Yi00MjVkLWIwZWItZjc0ZDM5OWM1ZDM4IiwiZW1haWwiOiJhZG1pbkBzaW1hbGZhLmNvbSIsIm5hbWUiOiJTSU1BTEZBIEFkbWluIiwidGVuYW50SWQiOiJiMzc1ZTQyNi0zMzliLTRmMzItOTNmNy05YTM2MWRmZWYxYWMiLCJyb2xlcyI6W3siaWQiOiJiNmZlZmFhNi0yYWVhLTRiYTktOWM3ZC0zYmE2MWI4YWZjZGUiLCJuYW1lIjoiVGVuYW50IEFkbWluaXN0cmF0b3IiLCJkZXNjcmlwdGlvbiI6IkhhcyBmdWxsIGFjY2VzcyB0byBtYW5hZ2UgdGhlIHRlbmFudCIsInRlbmFudElkIjoiYjM3NWU0MjYtMzM5Yi00ZjMyLTkzZjctOWEzNjFkZmVmMWFjIiwiaXNTeXN0ZW1Sb2xlIjp0cnVlLCJjcmVhdGVkQXQiOiIyMDI1LTA1LTA5VDA3OjEzOjA1LjM5N1oiLCJ1cGRhdGVkQXQiOiIyMDI1LTA1LTA5VDA3OjEzOjA1LjM5N1oifV0sInN1YkFwcGxpY2F0aW9ucyI6W3siaWQiOiI3YzZmYTUwZC00NTljLTRjMGEtYjRiYy0xMjFlZDcyOTkyMjAiLCJjb2RlIjoiaW1hZ2VtYXAiLCJuYW1lIjoiSW1hZ2UgTWFwcGluZyBTeXN0ZW0iLCJkZXNjcmlwdGlvbiI6Ik1hbmFnZSBpbWFnZSBtYXBwaW5ncyIsInBhdGgiOiIvaW1hZ2VtYXAiLCJzdWJkb21haW4iOm51bGwsInVybCI6Ii9pbWFnZW1hcCIsInN0YXR1cyI6ImFjdGl2ZSIsImNyZWF0ZWRBdCI6IjIwMjUtMDUtMDlUMDc6MTM6MDUuNTMxWiIsInVwZGF0ZWRBdCI6IjIwMjUtMDUtMDlUMDc6MTM6MDUuNTMxWiJ9LHsiaWQiOiIwYWI3NmM4Ni04Njc5LTQ0ZjEtYTJjYi1mYjIyY2M3YTI1NDIiLCJjb2RlIjoiZWludm9pY2UiLCJuYW1lIjoiRWxlY3Ryb25pYyBJbnZvaWNlIFN5c3RlbSIsImRlc2NyaXB0aW9uIjoiTWFuYWdlIGVsZWN0cm9uaWMgaW52b2ljZXMiLCJwYXRoIjoiL2VpbnZvaWNlIiwic3ViZG9tYWluIjpudWxsLCJ1cmwiOiIvZS1pbnZvaWNlIiwic3RhdHVzIjoiYWN0aXZlIiwiY3JlYXRlZEF0IjoiMjAyNS0wNS0wOVQwNzoxMzowNS41MjRaIiwidXBkYXRlZEF0IjoiMjAyNS0wNS0wOVQwNzoxMzowNS41MjRaIn1dfSwiaWF0IjoxNzQ2Nzc0OTc1LCJleHAiOjE3NDczNzk3NzV9.Tq7n3j_7Fg7iRAgjLDlaqnTpIeh7KXwyezeaZlndf5c'}`
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