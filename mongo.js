const config = require('./config');
const mongodb = require('mongodb');
const util = require('util');

let mongo = mongodb.MongoClient;
const connect = util.promisify(mongo.connect);

class Mongo {
    constructor() {}

    async connect(name) {
        let client = await connect(
            config.host,
            {useNewUrlParser: true}
        );
        this.client = client;
        this.collection = client.db(config.dbName).collection(name);
        return this;
    }

    insert(doc) {
        return new Promise((resolve, reject) => {
            this.collection.insert(doc, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    update(select, doc) {
        return new Promise((resolve, reject) => {
            this.collection.update(select, doc, {upsert: true}, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    findOne(doc, project) {
        return new Promise((resolve, reject) => {
            this.collection.findOne(doc, project, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = Mongo;
