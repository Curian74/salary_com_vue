const generateCodeFromName = (value: string = '') => {
    return value
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_');
};

const codeHelper = {
    generateCodeFromName,
};

export default codeHelper;