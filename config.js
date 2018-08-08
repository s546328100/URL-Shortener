module.exports = {
    mongo: {
        host: process.env.NODE_ENV === 'production' ? 'mongodb://0.0.0.0:27017' : 'mongodb://122.114.31.50:27017',
        dbName: 'FreeCodeCamp'
    }
};
