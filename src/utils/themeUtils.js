import {
    argbFromHex,
    Hct,
    hexFromArgb,
    SchemeTonalSpot
} from "@material/material-color-utilities";

/**
 * Generate derived theme colors from a primary color
 * @param {string} primaryColor - Hex color code (e.g. '#c0a801')
 * @returns {Object} Theme object with derived colors
 */
export const generateThemeFromPrimaryColor = (primaryColor) => {
    if (!primaryColor) {
        return {
            primary: '#c0a801', // Default color
            inversePrimary: '#dbc84d',
            inverseSurface: '#20201e',
            textOnPrimary: '#ffffff',
            secondaryContainer: '#f6efba'
        };
    }

    try {
        // Create tonal scheme
        const scheme = new SchemeTonalSpot(
            Hct.fromInt(argbFromHex(primaryColor)),
            false, // isDark - false for light mode
            0.0    // contrastLevel - 0.0 for standard contrast
        );

        // Get primary palette
        const primaryPalette = scheme.primaryPalette;

        return {
            primary: primaryColor,
            inversePrimary: hexFromArgb(primaryPalette.tone(80)),
            inverseSurface: hexFromArgb(primaryPalette.tone(20)),
            textOnPrimary: '#ffffff',
            secondaryContainer: hexFromArgb(primaryPalette.tone(90))
        };
    } catch (error) {
        console.error('Error generating theme colors:', error);
        // Return default theme if there's an error
        return {
            primary: primaryColor,
            inversePrimary: '#dbc84d',
            inverseSurface: '#20201e',
            textOnPrimary: '#ffffff',
            secondaryContainer: '#f6efba'
        };
    }
}; 