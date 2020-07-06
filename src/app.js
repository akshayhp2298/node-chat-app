import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes/router";
import auth from "./routes/auth";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(router);
app.use("/auth", auth);

export default app;
