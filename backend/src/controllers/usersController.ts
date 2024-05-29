import { Request, Response, NextFunction } from "express";
import User from "../model/userModel";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "Email already used", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    return res.json({ status: true, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: "Incorrect Username or password", status: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Incorrect Username or password", status: false });
    }
    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    return res.status(200).json({ status: true, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};