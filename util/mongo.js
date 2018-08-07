const config = require('../config').mongo;
const mongodb = require('mongodb');
const util = require('util');

let mongo = mongodb.MongoClient;
let ObjectId = mongodb.ObjectID;
const mongoConnect = util.promisify(mongo.connect);

class Mongo {
    constructor() {}

    async connect() {
        let client = await mongoConnect(config.host, {useNewUrlParser: true});
        this.client = client;
        this.db = client.db(config.dbName);
        return this;
    }

    async insert(name, doc) {
        if (!this.client) await this.connect();

        let collection = this.db.collection(name);
        return new Promise((resolve, reject) => {
            collection.insert(doc, (err, result) => {
                if (err) reject(err);
                resolve(result.ops[0]);
            });
        });
    }

    async update(name, select, doc) {
        if (!this.client) await this.connect();

        let collection = this.db.collection(name);
        return new Promise((resolve, reject) => {
            collection.update(select, doc, {upsert: true}, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    async findOne(name, doc, project = {}) {
        if (!this.client) await this.connect();

        let collection = this.db.collection(name);
        return new Promise((resolve, reject) => {
            collection.findOne(doc, {projection: project}, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    id(_id) {
        return ObjectId(_id);
    }

}

module.exports = new Mongo();
