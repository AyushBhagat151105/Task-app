import { PrismaClient } from "@prisma/client";
import apiResponse from "../util/apiRespons.js";

const prisma = new PrismaClient();

export const isVerifyed = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      apiResponse(res, 400, "Wrong Email");
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      apiResponse(res, 400, "User not found");
    }

    const isVerifyed = user.verified;

    if (isVerifyed == false) {
      //   console.log("not");
      apiResponse(res, 400, "User Not Verifyed");
    }

    // console.log("yes");
    // apiResponse(res, 200, "User Verifyed");
    next();
  } catch (error) {
    console.log(error);
    apiResponse(res, 500, "User not Verified");
  }
};
