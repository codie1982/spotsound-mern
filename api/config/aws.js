const { S3Client } = require('@aws-sdk/client-s3');
// AWS S3 Konfigürasyonu
const init = () => {
    return new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        },
    });
}

const setParam = (path, data, mimetype) => {
    return {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: path, // Dosya adı
        Body: data,
        ContentType: mimetype,
    }
}
module.exports = { init,setParam }