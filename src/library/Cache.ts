import { createClient } from 'redis';

let Client = null;

const initCache = async () => {
    Client = await createClient();
    // .on('error', err => console.log('Redis Client Error', err))
    // .connect();
};
const addToCache = async (key, value) => {
    try {
        if (!Client) {
            await initCache();
        }
        await Client.set(key, value);
    } catch (error) {
        return;
    }
};

const getFromCache = async (key) => {
    try {
        if (!Client) {
            await initCache();
        }
        return await Client.get(key);
    } catch (e) {
        return;
    }
};

export { addToCache, getFromCache, initCache };
