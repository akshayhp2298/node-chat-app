const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const mongoConnection = new MongoClient(process.env.MONGODBURL, {
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 60000,
  promiseLibrary: Promise,
  poolSize: 10,
});
mongoConnection
  .connect()
  .then(() => {
    console.log("mongoDb Connected");
  })
  .catch(e => {
    console.log(e);
  });

const mongoDB = mongoConnection;

export default mongoDB;
