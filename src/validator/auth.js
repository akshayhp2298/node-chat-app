export const validateLogin = async (req, res, next) => {
  const { email, password } = req.body;
  let error = false;
  const messages = [];
  if (!email) {
    error = true;
    messages.push({ field: "email", message: "email not found" });
  }
  if (!password) {
    error = true;
    messages.push({ field: "password", message: "password not found" });
  }
  if (error) {
    res.status(400).send({ error, message: messages });
    return;
  }
  next();
};

export const validateSignup = async (req, res, next) => {
  const { name, dob, email, password } = req.body;
  let error = false;
  const messages = [];
  if (!email) {
    error = true;
    messages.push({ field: "email", message: "email not found" });
  }
  if (!password) {
    error = true;
    messages.push({ field: "password", message: "password not found" });
  }
  if (!name) {
    error = true;
    messages.push({ field: "name", message: "name not found" });
  }
  if (!dob) {
    error = true;
    messages.push({ field: "dob", message: "dob not found" });
  } else {
    const date = new Date(date);
    if (date === "invalid date") {
      error = true;
      messages.push({ field: "dob", message: "dob is not valid" });
    }
  }
  if (error) {
    res.status(400).send({ error, message: messages });
    return;
  }
  next();
};
