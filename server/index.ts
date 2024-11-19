import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import calculRouter from "./route/calcul"; // routes 폴더의 calcul.ts 파일 가져오기

const app = express();
const port = 8080;
const whitelist = ["http://localhost:3000"];

// MySQL 연결 설정
const db = mysql.createPool({
  host: "localhost",
  user: "root", // MySQL 사용자 이름
  password: "aiden0817@", // MySQL 비밀번호
  database: "calculator_db", // 데이터베이스 이름
});

async function testDbConnection() {
    try {
      await db.getConnection();  // DB에 연결
      console.log("MySQL 연결 성공");
    } catch (err) {
      console.error("MySQL 연결 실패:", err);
    }
  }
  
  // MySQL 연결 테스트 실행
testDbConnection();

// CORS 설정
app.use(
    cors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || whitelist.includes(origin)) callback(null, true);
        else callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
);  

// JSON 파싱 설정
app.use(express.json());

// 계산 API 라우터에 데이터베이스 인스턴스를 주입
app.use("/arithmetics/arithmetic", calculRouter(db));

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
