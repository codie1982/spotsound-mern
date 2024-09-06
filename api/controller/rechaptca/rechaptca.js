const axios = require('axios');
const GOOGLE_VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify`
module.exports = async function verifyRecaptcha(recaptchaToken) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Google'dan aldığınız gizli anahtarı buraya ekleyin
    const response = await axios.post(
        GOOGLE_VERIFY_URL,
        null,
        {
            params: {
                secret: secretKey,
                response: recaptchaToken,
            },
        }
    );

    return response.data;
};