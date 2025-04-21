import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/User.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
