import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import accountBookRoutes from "./routes/accountBook.routes";
import { prisma } from "./prisma/client";

const app = express();
const port = process.env.PORT || 3002;

const allowedOrigins = [
  "https://account-book-next-eight.vercel.app/", // Vercel 도메인
  "http://localhost:3000", // 로컬 개발용
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // 쿠키, Authorization 허용
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/account-book", accountBookRoutes);

const checkDBConnection = async () => {
  try {
    await prisma.$connect();
    console.log("✅ MySQL DB 연결 성공!");
  } catch (error) {
    console.error("❌ MySQL DB 연결 실패:", error);
    process.exit(1);
  }
};

const startServer = async () => {
  await checkDBConnection();
  app.listen(port, () => {
    console.log(`🚀 서버 실행 중 : ${port}`);
  });
};

startServer();
