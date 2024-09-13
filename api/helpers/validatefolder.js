// helpers/validateFolderPath.js

/**
 * Kullanıcı tarafından sağlanan klasör yolunun güvenli olup olmadığını kontrol eder.
 * @param {string} folderPath - Kullanıcı tarafından sağlanan klasör yolu.
 * @returns {boolean} - Güvenli ise true, değilse false.
 */
const validateFolderPath = (folderPath) => {
    // İzin verilen karakterler: a-z, A-Z, 0-9, /, -, _
    const regex = /^[a-zA-Z0-9-_\/]+\/$/;
    return regex.test(folderPath);
};

module.exports = validateFolderPath;
