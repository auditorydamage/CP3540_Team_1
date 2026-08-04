const unitConverter = (unit, value) => {
    switch (unit) {
        // Weight conversions to kg
        case 'lb':
            return value * 0.453592;
            break;
        // Volume conversions to mL (for water tracking)
        case 'fl. oz':
            return value * 29.5735;
            break;
        case 'gal.':
            return value * 3785.41;
            break;
        case 'glass':
            return value * 240;
            break;
        case 'cup':
            return value * 240;
            break;
        // Distance conversions to m (for exercise tracking)
        case 'mi':
            return value * 1609.34;
            break;
        case 'km':
            return value * 1000;
            break;
        case 'yd':
            return value * 0.9144;
            break;
        case 'ft':
            return value * 0.3048;
            break;
        case 'steps':
            return value * 0.762; // Assuming average step length of 0.762 meters
            break;
        // Default case for unsupported units
        default:
            throw new Error(`Unsupported unit: ${unit}`);
    }
};

module.exports = unitConverter;