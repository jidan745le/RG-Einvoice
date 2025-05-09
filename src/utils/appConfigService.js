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
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching app configuration:', error);
        throw new Error(error.response?.data?.message || 'Failed to retrieve application configuration');
    }
};
