import jwt from "jsonwebtoken";
import mongoDB from "../MongoDB";
import { getUserById } from "../MongoDB/queries/user";

export const getToken = user =>
  jwt.sign(
    {
      data: user,
    },
    process.env.JWTSECRET,
    { expiresIn: 60 * 60 }
  );

export const verifyToken = token => {
  try {
    const data = jwt.verify(token, process.env.JWTSECRET);
    return data;
  } catch (e) {
    console.log(e);
    return { error: true, message: "Unable to validate" };
  }
};

export default async (req, res, next) => {
  const token = req.header.authorization.split(" ")[1];
  const data = verifyToken(token);
  if (data.error) {
    res.status(401).send({ error: true, message: `You're unAuthorized` });
    return;
  }
  const user = await getUserById(mongoDB, data.userId);

};
