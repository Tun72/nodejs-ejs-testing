const mongodb = require("mongodb");
const MongodbClient = mongodb.MongoClient;
const dotenv = require("dotenv");
dotenv.config();

let db;
const MongodbConnector = () => {
  return MongodbClient.connect(process.env.MONGODB_URL)
    .then((result) => {
      db = result.db();
      console.log("Database Successfully connected ✅");
    })
    .catch((err) => console.log(err));
};

const getDatabase = () => {
  if (db) {
    return db;
  }

  throw "No Database";
};

module.exports = { MongodbConnector, getDatabase };
