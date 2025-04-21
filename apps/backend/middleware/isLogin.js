import apiResponse from "../util/apiRespons.js";
import jwt from "jsonwebtoken";

export const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
      return apiResponse(res, "No Token, Authorization Denied");
    }

    const decoded = jwt.verify(token, process.env.JWT);
    console.log(decoded);

    req.user = decoded;

    // if (decoded) {
    //   apiResponse(res, 200, "Token is valid");
    // }

    next();
  } catch (error) {
    console.log(error);
    apiResponse(res, 401, "Token is not valid");
  }
};
