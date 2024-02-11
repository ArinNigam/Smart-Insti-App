import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import testResource from "./resources/testResource.js";

import authResource from "./resources/authResource.js";
import otpResource from "./resources/otpResource.js";
import Connection from "./database/db.js";
import cors from "cors";
import auth from "./middlewares/auth.js";
import roomListResource from "./resources/rooms/roomListResource.js";
import roomResource from "./resources/rooms/roomResource.js";
import lostAndFoundListResource from "./resources/lostAndFound/lostAndFoundListResource.js";

const PORT = `${process.env.PORT || 3000}`;
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Get Database connection
Connection();
app.use(authResource);
app.use(otpResource);
app.use("/", testResource);
app.use("/rooms", roomListResource);
app.use("/room", roomResource);
app.use("/lost-and-found", lostAndFoundListResource);

app.get("/protected", auth, (req, res) => {
  res.json({ message: "Access granted" });
});
export default app;
