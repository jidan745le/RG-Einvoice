import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAppConfig } from '../utils/appConfigService';

// Create context for app configuration
const AppConfigContext = createContext();

/**
 * Custom hook to use app configuration
 * @returns {Object} The app configuration and loading state
 */
export const useAppConfig = () => {
    const context = useContext(AppConfigContext);
    if (!context) {
        throw new Error('useAppConfig must be used within an AppConfigProvider');
    }
    return context;
};

/**
 * Provider component for app configuration
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.appcode - Application code for configuration
 * @param {boolean} props.useMock - Whether to use mock data (for development)
 */
export const AppConfigProvider = ({ children, appcode = 'einvoice' }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                setLoading(true);


                // Fetch real data from API
                const configData = await fetchAppConfig(appcode);
                setConfig(configData);
                setError(null);
            } catch (err) {
                console.error('Failed to load app configuration:', err);
                setError(err.message || 'Failed to load app configuration');
            } finally {
                setLoading(false);
            }
        };

        loadConfig();
    }, [appcode]);

    return (
        <AppConfigContext.Provider value={{ config, loading, error, appcode }}>
            {children}
        </AppConfigContext.Provider>
    );
};

export default AppConfigProvider; 