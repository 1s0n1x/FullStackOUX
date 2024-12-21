require(`dotenv`).config();

const PORT = process.env.PORT;
const ENVIRONMENT = process.env.NODE_ENV;
const MONGODB_URI = ENVIRONMENT === 'test' || ENVIRONMENT === 'development' 
    ? process.env.TEST_MONGODB_URI 
    : process.env.MONGODB_URI;

module.exports = {
    ENVIRONMENT,
    MONGODB_URI,
    PORT
}