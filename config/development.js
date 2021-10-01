require('dotenv').config();

const {
    PORT,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_USER,
    DATABASE_HOST,
    EMAIL_ADDRESS,
    EMAIL_PASSWORD,
    EMAIL_SERVICE,
    PRIVATE_KEY
} = process.env


module.exports = {
    NODE_ENV: 'devopment',
    port: PORT || 5000,
}