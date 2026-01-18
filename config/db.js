// db/db.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI  // local MongoDB
const client = new MongoClient(uri);

let db;

async function connectDB() {
    await client.connect();
    db = client.db();
    console.log("Connected to local MongoDB");
}

function getDB() {
    if (!db) throw new Error("Database not connected");
    return db;
}

module.exports = { connectDB, getDB };
