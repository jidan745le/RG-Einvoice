import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAppConfig } from '../utils/appConfigService';
import { generateThemeFromPrimaryColor } from '../utils/themeUtils';

// 默认主题设置
export const DEFAULT_THEME = {
    primary: '#c0a801',
    inversePrimary: '#dbc84d',
    inverseSurface: '#20201e',
    textOnPrimary: '#ffffff',
    secondaryContainer: '#f6efba'
};

// 导出 THEME 对象以供组件使用
export const THEME = { ...DEFAULT_THEME };

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
export const AppConfigProvider = ({ children, appcode = 'einvoice', useMock = false }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState(DEFAULT_THEME);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                setLoading(true);

                // Fetch configuration data
                const configData = await fetchAppConfig(appcode, useMock);
                setConfig(configData);

                // Generate theme based on primary color
                if (configData?.settings?.themeSetting?.primaryColor) {
                    const generatedTheme = generateThemeFromPrimaryColor(
                        configData.settings.themeSetting.primaryColor
                    );

                    // Update THEME object for backward compatibility
                    Object.keys(THEME).forEach(key => {
                        THEME[key] = generatedTheme[key];
                    });

                    setTheme(generatedTheme);
                }

                setError(null);
            } catch (err) {
                console.error('Failed to load app configuration:', err);
                setError(err.message || 'Failed to load app configuration');
            } finally {
                setLoading(false);
            }
        };

        loadConfig();
    }, [appcode, useMock]);

    return (
        <AppConfigContext.Provider value={{ config, loading, error, appcode, theme }}>
            {children}
        </AppConfigContext.Provider>
    );
};

export default AppConfigProvider; 