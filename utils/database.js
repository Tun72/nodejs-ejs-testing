const mongodb = require("mongodb");
const MongodbClient = mongodb.MongoClient;
const dotenv = require("dotenv");
dotenv.config();

const MongodbConnector = () => {
  return MongodbClient.connect(process.env.MONGODB_URL)
    .then((result) => {
      console.log(result);
      console.log("Database Successfully connected ✅");
    })
    .catch((err) => console.log(err));
};

module.exports = MongodbConnector;
