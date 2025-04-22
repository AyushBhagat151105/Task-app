import express from "express";
import crypto from "crypto";
import "dotenv/config";
import bcrypt from "bcryptjs";
import apiResponse from "../util/apiRespons.js";
import { PrismaClient } from "@prisma/client";
import {
  sendVerificationEmail,
  sendResetEmail,
} from "../util/verificationEmail.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      apiResponse(res, 400, "Pless fill all filds");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      apiResponse(res, 400, "User alrady exists in DB");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        verifiationToken: verificationToken,
      },
    });

    sendVerificationEmail(user, verificationToken, res);

    apiResponse(res, 200, "User Rgister check your inbox");
  } catch (error) {
    console.log("Register user error:- ", error);
    apiResponse(res, 400, "User Not Registered");
  }
};

export const verifEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const ntoken = token.replace(/^:/, "");
    // console.log(ntoken);

    const Invaliddata = {
      message: "Invalid Token",
    };

    if (!token) {
      apiResponse(res, "400", "Invalid Token", Invaliddata);
    }

    const user = await prisma.user.findFirst({
      where: {
        verifiationToken: ntoken,
      },
    });
    // console.log(user);

    if (!user) {
      apiResponse(res, 400, "Invalid or expired verification token");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verifiationToken: null,
      },
    });

    apiResponse(res, 200, "User verified");
  } catch (error) {
    console.log(error);
    apiResponse(res, 400, "Something went Worng");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      apiResponse(res, 400, "Fill all filds correact");
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    //   console.log(user);
    if (!user) {
      apiResponse(res, 400, "User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      apiResponse(res, 400, "Password is Wrong");
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT, {
      expiresIn: "24h",
    });

    const cookisOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookisOptions);

    const getUser = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    apiResponse(res, 200, "Lgoin", getUser);
  } catch (error) {
    console.log(error);
    apiResponse(res, 500, "Error in login");
  }
};

export const dashboard = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT);
    console.log(decoded);

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
      },
    });

    const data = {
      email: user.email,
      name: user.name,
      role: user.role,
    };

    apiResponse(res, 200, "User Found", data);
  } catch (error) {
    console.log(error);
    apiResponse(res, 400, "Something wnet Wrong");
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  apiResponse(res, 200, "User Logged Out");
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      apiResponse(res, 400, "Email is required");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      apiResponse(res, 400, "User not found with this email");
    }

    const token = crypto.randomBytes(32).toString("hex");

    const storedToken = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        restPasswordToken: token,
        restPasswordExpire: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      },
    });

    if (!storedToken) {
      apiResponse(res, 400, "Error in storing token");
    }

    sendResetEmail(user, token, res, "reset Password");

    apiResponse(res, 200, "Check your email for reset password link");
  } catch (error) {
    console.log(error);
    apiResponse(res, 400, "Something went Wrong");
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      apiResponse(res, 400, "Fill all filds");
    }

    const user = await prisma.user.findFirst({
      where: {
        restPasswordToken: token,
        restPasswordExpire: {
          gte: new Date(Date.now()),
        },
      },
    });

    if (!user) {
      apiResponse(res, 400, "Invalid or expired token");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        restPasswordToken: null,
        restPasswordExpire: null,
      },
    });

    apiResponse(res, 200, "Password reset successfully");
  } catch (error) {
    console.log(error);
    apiResponse(res, 400, "Something went Wrong");
  }
};
