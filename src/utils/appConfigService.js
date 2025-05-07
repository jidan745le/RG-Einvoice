import axios from 'axios';

/**
 * Fetches application configuration from the API
 * @param {string} appcode - Application code to fetch configuration for
 * @returns {Promise<Object>} Application configuration data
 */
export const fetchAppConfig = async (appcode) => {
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
