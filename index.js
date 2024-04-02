import express from "express";

import { config } from "dotenv";

import path from "path";

import cors from "cors";

config({ path: path.resolve("./Config/config.env") });

import DbConnection from "./DataBase/connection.js";
import * as Routers from "./Src/Modules/index.routes.js";

import {
  globalErrorResponse,
  globalNotFoundPageError,
} from "./Src/Utils/errorhandling.js";

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
DbConnection();
app.use(cors());
app.get("/", (req, res) => res.send("Hello World From Host"));

app.use("/user", Routers.userRouter);
app.use("/school", Routers.schoolRouter);
app.use("/classroom", Routers.classroomRouter);

app.all("*", globalNotFoundPageError);

app.use(globalErrorResponse);

app.listen(port, () => console.log("Server listening on port successfully"));
