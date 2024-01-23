import express from 'express';
import User from "../models/user.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middlewares/auth.js';
import * as errorMessages from '../constants/errorMessages.js';

const authRouter = express.Router();

// Sign-Up Route
authRouter.post('/signup',async (req,res)=>{
   try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser){
            return res.status(400).json({ msg: errorMessages.userAlreadyExists });
        }
        const hashedPassword = await bcryptjs.hash(password,8);
        let user = new User({
            email,
            password: hashedPassword,
            name,
        });
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error:e.message});
    }
})

// Sign-In Route
authRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: errorMessages.userNotFound });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ msg: errorMessages.incorrectPassword });
    }

    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ error: errorMessages.internalServerError });
  }
});

// If token is valid
authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get user Data
authRouter.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});

export default authRouter