import express from 'express';
import cors, { CorsOptions } from "cors"; // cors 패키지 임포트
import arithmeticRoutes from './routes/arithmeticRoutes';
import { createPool } from 'mysql2/promise';

const app = express();
const PORT = 4000;
const whitelist = ["http://127.0.0.1:8080"];

// MySQL 연결 설정
const pool = createPool({
    host: 'localhost',
    user: 'joeungang0817',   // MySQL 사용자 이름
    password: 'aiden0817@', // MySQL 비밀번호
    database: 'calculator_db', // 사용할 데이터베이스 이름
});
// 미들웨어 설정
const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  } satisfies CorsOptions;

app.use(cors(corsOptions)); // CORS 미들웨어 사용
// 라우트 설정
app.use('http://localhost:4000/arithmetics', arithmeticRoutes(pool));
app.use(express.static('../../frontend'));

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});