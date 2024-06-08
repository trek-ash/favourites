import dotenv from 'dotenv';

dotenv.config();

// DECLARE ALL VARIABLES
const NODE_ENV = process.env.NODE_ENV || '';
const MONGO_URL= process.env.MONGO_URL 

const REDIS_URL = process.env.REDIS_URL;
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGO_URL_LOCAL = MONGO_URL 

const config = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: SERVER_PORT,
    },
    redis: {
        url: REDIS_URL
    }
};

//CHECK FOR ENVIRONMENT
if (NODE_ENV === 'production') {
    config.mongo.url = "mongodb://127.0.0.1:27017/favouritesList";
    config.server.port = SERVER_PORT;
} else if (NODE_ENV === 'local') {
    config.mongo.url = "mongodb://127.0.0.1:27017/favouritesList";
    config.server.port = SERVER_PORT;
}

//EXPORT
export default config;
