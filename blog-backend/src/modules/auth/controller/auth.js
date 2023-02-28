import UserModel from "../../../../DB/model/User.model.js";
import jwt from "jsonwebtoken";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import * as dotenv from "dotenv";
import { generateToken } from "../../../utils/GenerateAndVerifyToken.js";
import transporter from "./../../../../DB/emailConfig.js";
import bcrypt from "bcrypt";

dotenv.config();
const { JWT_SECRET_KEY, EMAIL_FROM } = process.env;

export const getAuthModule = (req, res, next) => {
  return res.json({ message: "Auth module" });
};

export const register = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    // let { error } = signUpSchema.validate(req.body, { abortEarly: false });


 
      const checkUser = await UserModel.findOne({ email });
      if (checkUser) {
        return res
          .status(404)
          .json({ message: "Email Exist Please chose another Email" });
      }

      const passwordHash = hash({ plaintext: password });
      await UserModel.create({
        username,
        email,
        password: passwordHash,
      });
      return res
        .status(200)
        .json({ message: "Successfully Register Please Logged In " });

  } catch (err) {
    return res.status(404).json({ message: "Catch Error", err });
  }
};

export const login = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    // const { error } = LoginSchema.validate(req.body, { abortEarly: false });
   
      const user = await UserModel.findOne({
        email: email,
        isDeleted: false,
      });
      if (!user) {
        return res.status(404).json({ message: "Invalid Email or password" });
      }

      const checkPassword = compare({
        plaintext: password,
        hashValue: user.password,
      });

      if (!checkPassword) {
        return res.status(404).json({ message: "Invalid Email or password" });
      }

      const token = generateToken({
        payload: {
          id: user._id,
          name: user.username,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          isLoggedIn: true,
        },
        expiresIn: 60 * 60 * 24 * 30,
      });

      // const token = jwt.sign(
      //   {
      //     id: user._id,
      //     name: user.username,
      //     email: user.email,
      //     role: user.role,
      //     profilePicture: user.profilePicture,
      //     isLoggedIn:true,
      //   },

      //   JWT_SECRET_KEY,
      //   { expiresIn: "1hr" }
      // );

      return res.status(200).json({ message: "Successfully Logged In", token });

  } catch (err) {
    return res.status(404).json({ message: "Catch Error", err });
  }
};
export const resetpassword = async (req, res, next) => {
  try {
    const { oldpassword, password, confirm_pass } = req.body;

    if (password != confirm_pass) {
      return res
        .status(404)
        .json({ message: "Password and comfirm password do not match" });
    }

    const checkUser = await UserModel.findById(req.user.id);
console.log(checkUser);
    if (!checkUser) {
      return res
        .status(404)
        .json({ message: "This User Isnot Exist in database" });
    } else {
      const checkPassword = compare({
        plaintext: oldpassword,
        hashValue: checkUser.password,
      });
      if (!checkPassword) {
        return res
          .status(404)
          .json({ message: "password isnot exist in database" });
      }
    }
    const passwordHash = hash({ plaintext: password });
    await UserModel.findOneAndUpdate(
      { _id: req.user.id },
      {
        password: passwordHash,
      }
    );
    return res
      .status(200)
      .json({ message: "Congratulation ,Your Password Changed " });
  } catch (err) {
    return res.status(404).json({ message: "Catch Error", err });
  }
};

export const sendingemail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (email) {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const secret = user._id + JWT_SECRET_KEY;
        const token = jwt.sign({ userID: user._id }, secret, {
          expiresIn: "15m",
        });
        console.log(token);
        const link = `http://127.0.0.1:3000/reset-password/${user._id}/${token}`;
        // Send Email
        const info = await transporter.sendMail({
          from: EMAIL_FROM,
          to: user.email,
          subject: "abdallah-Blog - Password Reset Link",
          html: `<a href=${link}>Click Here</a> to Reset Your Password`,
        });
        res
          .status(200)
          .json({
            message: "Password Reset Email Sent... Please Check Your Email",
          });
      } else {
        res.status(404).json({ message: "Email doesn't exists" });
      }
    } else {
      res.status(404).json({ message: "Email Field is Required" });
    }
  } catch (err) {
    return res.status(404).json({ message: "Catch Error", err });
  }
};

export const userPasswordResetGen = async (req, res, next) => {
  const { password, confirm_pass } = req.body;
  const { id, token } = req.params;
  const user = await UserModel.findById(id);
  const new_secret = user._id + JWT_SECRET_KEY;
  try {
    jwt.verify(token, new_secret);
    if (password && confirm_pass) {
      if (password !== confirm_pass) {
        res
          .status(404)
          .json({
            message: "New Password and Confirm New Password doesn't match",
          });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await UserModel.findByIdAndUpdate(user._id, {
          $set: { password: newHashPassword },
        });
        res.status(200).json({ message: "Password Reset Successfully" });
      }
    } else {
      res.status(404).json({ message: "All Fields are Required" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Invalid Token" });
  }
};
