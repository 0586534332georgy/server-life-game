const MongoStore = require('connect-mongo');

const isProduction = process.env.NODE_ENV === 'production';

const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        collectionName: 'sessions',
        ttl: 60 * 60,
        autoRemove: 'native',
    }),
    cookie: {
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? 'None' : 'Lax',
        maxAge: 1000 * 60 * 60,
    },
};

module.exports = sessionConfig;