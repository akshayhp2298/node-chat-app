import mongoDB from "../MongoDB";
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, createUser } from "../MongoDB/queries/user";
import { getToken } from "../middleware/auth";

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(mongoDB, email);
  if (user && user.password === password) {
    const token = getToken({
      name: user.name,
      email: user.email,
      userId: user.userId,
    });
    res.send({
      error: false,
      message: "user has been loggedin",
      token: `Bearer ${token}`,
    });
    // return;
  } else
    res
      .status(400)
      .send({ error: true, message: "emailID or password is not valid" });
};

export const signupController = async (req, res) => {
  const { name, dob, email, password } = req.body;
  const userId = uuidv4();
  const user = await createUser(mongoDB, {
    userId,
    name,
    dob: new Date(dob),
    email,
    password,
  });
  const token = getToken({
    userId,
    name,
    email,
  });
  res.send({ error: false, message: "user has been created", token });
};
