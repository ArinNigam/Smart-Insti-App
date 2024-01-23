import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import testResource from "./resources/testResource.js";
<<<<<<< Updated upstream

=======
import authResource from "./resources/authResource.js";
import otpResource from "./resources/otpResource.js";
import Connection from "./database/db.js";
import bodyParser from "body-parser";
>>>>>>> Stashed changes
const app = express();

app.use(logger("dev"));
app.use(express.json())
app.use(bodyParser.json());;
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

<<<<<<< Updated upstream
=======
// Get Database connection
Connection();

app.use(authResource);
app.use('/otp', otpResource);
>>>>>>> Stashed changes
app.use("/", testResource);

export default app;
