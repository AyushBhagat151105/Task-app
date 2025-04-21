import express from "express";
import crypto from "crypto";
import "dotenv/config";
import bcrypt from "bcryptjs";
import apiResponse from "../util/apiRespons.js";
import { PrismaClient } from "@prisma/client";
import sendVerificationEmail from "../util/verificationEmail.js";
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

    if (!token) {
      apiResponse(res, "400", "Invalid Token");
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

// export const forgotPassword = async (req, res) => {

// }
