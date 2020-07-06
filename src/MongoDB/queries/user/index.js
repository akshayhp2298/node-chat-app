import mongoDB from "../..";

const collection = "user";

export const getUserByEmail = (mongoDB, email) =>
  mongoDB.db("chatApp").collection(collection).findOne({ email });

export const createUser = (mongoDB, user) =>
  mongoDB.db("chatApp").collection(collection).insertOne(user);

export const getUserById = (mongoDB, userId) =>
  mongoDB.db("chatApp").collection(collection).findOne({ userId });
