import axios from 'axios';

/**
 * Mock config data for development and testing
 */
const MOCK_CONFIG = {
    "tenant": {
        "id": "a95aa411-4508-41a1-826b-dfba464d0312",
        "name": "SIMALFA",
        "subscription_plan": "enterprise"
    },
    "application": {
        "id": "17691c77-03ed-4f69-81f1-1b3e98b71799",
        "code": "einvoice",
        "name": "Electronic Invoice System",
        "path": "/einvoice",
        "url": "/e-invoice"
    },
    "settings": {
        "themeSetting": {
            "logoUrl": "/files/5fa33a4d-3f0c-47f0-ab7e-1d04d7382521.png",
            "primaryColor": "#c0a801"
        }
    }
};

/**
 * Fetches application configuration from the API
 * @param {string} appcode - Application code to fetch configuration for
 * @param {boolean} useMock - Whether to use mock data instead of API call
 * @returns {Promise<Object>} Application configuration data
 */
export const fetchAppConfig = async (appcode, useMock = false) => {
    // Use mock data if in development mode or if useMock is true

    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`/api/app-config${appcode ? `?appcode=${appcode}` : ''}`, {
            headers: {
                'Authorization': `Bearer ${token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiZjRkMDA4MTgtZjc3Yi00MjVkLWIwZWItZjc0ZDM5OWM1ZDM4IiwiZW1haWwiOiJhZG1pbkBzaW1hbGZhLmNvbSIsIm5hbWUiOiJTSU1BTEZBIEFkbWluIiwidGVuYW50SWQiOiJiMzc1ZTQyNi0zMzliLTRmMzItOTNmNy05YTM2MWRmZWYxYWMiLCJyb2xlcyI6W3siaWQiOiJiNmZlZmFhNi0yYWVhLTRiYTktOWM3ZC0zYmE2MWI4YWZjZGUiLCJuYW1lIjoiVGVuYW50IEFkbWluaXN0cmF0b3IiLCJkZXNjcmlwdGlvbiI6IkhhcyBmdWxsIGFjY2VzcyB0byBtYW5hZ2UgdGhlIHRlbmFudCIsInRlbmFudElkIjoiYjM3NWU0MjYtMzM5Yi00ZjMyLTkzZjctOWEzNjFkZmVmMWFjIiwiaXNTeXN0ZW1Sb2xlIjp0cnVlLCJjcmVhdGVkQXQiOiIyMDI1LTA1LTA5VDA3OjEzOjA1LjM5N1oiLCJ1cGRhdGVkQXQiOiIyMDI1LTA1LTA5VDA3OjEzOjA1LjM5N1oifV0sInN1YkFwcGxpY2F0aW9ucyI6W3siaWQiOiI3YzZmYTUwZC00NTljLTRjMGEtYjRiYy0xMjFlZDcyOTkyMjAiLCJjb2RlIjoiaW1hZ2VtYXAiLCJuYW1lIjoiSW1hZ2UgTWFwcGluZyBTeXN0ZW0iLCJkZXNjcmlwdGlvbiI6Ik1hbmFnZSBpbWFnZSBtYXBwaW5ncyIsInBhdGgiOiIvaW1hZ2VtYXAiLCJzdWJkb21haW4iOm51bGwsInVybCI6Ii9pbWFnZW1hcCIsInN0YXR1cyI6ImFjdGl2ZSIsImNyZWF0ZWRBdCI6IjIwMjUtMDUtMDlUMDc6MTM6MDUuNTMxWiIsInVwZGF0ZWRBdCI6IjIwMjUtMDUtMDlUMDc6MTM6MDUuNTMxWiJ9LHsiaWQiOiIwYWI3NmM4Ni04Njc5LTQ0ZjEtYTJjYi1mYjIyY2M3YTI1NDIiLCJjb2RlIjoiZWludm9pY2UiLCJuYW1lIjoiRWxlY3Ryb25pYyBJbnZvaWNlIFN5c3RlbSIsImRlc2NyaXB0aW9uIjoiTWFuYWdlIGVsZWN0cm9uaWMgaW52b2ljZXMiLCJwYXRoIjoiL2VpbnZvaWNlIiwic3ViZG9tYWluIjpudWxsLCJ1cmwiOiIvZS1pbnZvaWNlIiwic3RhdHVzIjoiYWN0aXZlIiwiY3JlYXRlZEF0IjoiMjAyNS0wNS0wOVQwNzoxMzowNS41MjRaIiwidXBkYXRlZEF0IjoiMjAyNS0wNS0wOVQwNzoxMzowNS41MjRaIn1dfSwiaWF0IjoxNzQ2Nzc0OTc1LCJleHAiOjE3NDczNzk3NzV9.Tq7n3j_7Fg7iRAgjLDlaqnTpIeh7KXwyezeaZlndf5c'}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching app configuration:', error);
        throw new Error(error.response?.data?.message || 'Failed to retrieve application configuration');
    }
};
