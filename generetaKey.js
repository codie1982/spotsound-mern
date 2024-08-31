const crypto = require('crypto');
// 32 byte uzunluğunda rastgele bir secret key oluşturur
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Generated Secret Key:', secretKey);