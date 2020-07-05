import mongoDB from "../../MongoDB";

import { getUserByEmail, createUser } from "../../MongoDB/queries/user";

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(mongoDB, email);
  if (user && user.password === password)
    res.send({ error: false, message: "user has been loggedin" });
  else
    res
      .status(400)
      .send({ error: true, message: "emailID or password is not valid" });
};

export const signupController = async (req, res) => {
  const { name, dob, email, password } = req.body;
  const user = await createUser(mongoDB, {
    name,
    dob: new Date(dob),
    email,
    password,
  });
  res.send({ error: false, message: "user has been created", user });
};
