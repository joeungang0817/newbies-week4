import express from "express";
import { Pool } from "mysql2/promise";
import { z } from "zod";

const calculationSchema = z.object({
  lhs: z.number().int().min(0),
  rhs: z.number().int().min(0),
});

// 계산 API 라우터 함수
export default function calculRouter(db: Pool) {
  const router = express.Router();

  // 데이터베이스에 결과 저장 함수
  async function saveResult(lhs: number, rhs: number, cal: string, result: number) {
    const resultString = `${lhs}${cal === "add" ? "+" : cal === "sub" ? "-" : cal === "mul" ? "*" : cal === "div" ? "/" : "%"}${rhs}=${result}`;
    try {
      await db.query(
        "INSERT INTO Cal_result (lhs, rhs, cal, result_num, result) VALUES (?, ?, ?, ?, ?)",
        [lhs, rhs, cal, result, resultString]
      );
      console.log("결과 저장 성공");
    } catch (error) {
      console.error("결과 저장 실패:", error);
    }
  }
  
  router.get("/status", async (req, res) => {
    try {
      // 예시로 DB 연결 상태 확인을 통해 서버의 상태를 체크
      const [rows] = await db.query("SELECT 1");
      res.status(200).json({ isOnline: true });
    } catch (error) {
      res.status(500).json({ isOnline: false });
    }
  });

  // 덧셈 API
  router.get("/add", async (req, res) => {
    try {
      const { lhs, rhs } = calculationSchema.parse({
        lhs: parseInt(req.query.lhs as string, 10),
        rhs: parseInt(req.query.rhs as string, 10),
      });          
      const result = lhs + rhs;
      await saveResult(lhs, rhs, "add", result);
      res.status(200).json({ result });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // 뺄셈 API
  router.get("/sub", async (req, res) => {
    try {
        const { lhs, rhs } = calculationSchema.parse({
            lhs: parseInt(req.query.lhs as string, 10),
            rhs: parseInt(req.query.rhs as string, 10),
          });
          
      const result = Math.max(0, lhs - rhs);
      await saveResult(lhs, rhs, "sub", result);
      res.status(200).json({ result });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // 곱셈 API
  router.get("/mul", async (req, res) => {
    try {
        const { lhs, rhs } = calculationSchema.parse({
            lhs: parseInt(req.query.lhs as string, 10),
            rhs: parseInt(req.query.rhs as string, 10),
          });          
      const result = lhs * rhs;
      await saveResult(lhs, rhs, "mul", result);
      res.status(200).json({ result });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // 나눗셈 API
  router.get("/div", async (req, res) => {
    try {
      const { lhs, rhs } = calculationSchema.extend({ rhs: z.number().int().positive() }).parse({
        lhs: parseInt(req.query.lhs as string, 10),
        rhs: parseInt(req.query.rhs as string, 10),
      });
      const result = Math.floor(lhs / rhs);
      await saveResult(lhs, rhs, "div", result);
      res.status(200).json({ result });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // 나머지 API
  router.get("/mod", async (req, res) => {
    try {
      const { lhs, rhs } = calculationSchema.extend({ rhs: z.number().int().positive() }).parse({
        lhs: parseInt(req.query.lhs as string, 10),
        rhs: parseInt(req.query.rhs as string, 10),
      });
      const result = lhs % rhs;
      await saveResult(lhs, rhs, "mod", result);
      res.status(200).json({ result });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/history', async (req,res) => {
    try {
      // DB에서 계산 기록을 가져옴
      const hisNum = parseInt(req.query.his_num as string, 10) || 10;
      const query = 'SELECT * FROM Cal_result ORDER BY id DESC LIMIT ?';
      const [results] = await db.query(query,[hisNum]);
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching history:', error);
      res.status(500).json({ error: 'Failed to retrieve calculation history' });
    }
  });

  router.delete("/delete", async (req, res) => {
    const id = req.query.id;
    try {
      const [result] = await db.query("DELETE FROM Cal_result WHERE id = ?", [id]);
      if ((result as any).affectedRows > 0) {
        res.status(200).json({ message: "Result deleted successfully." });
      } else {
        res.status(404).json({ error: "Result not found." });
      }
    } catch (error) {
      console.error("Error deleting result:", error);
      res.status(500).json({ error: "Failed to delete result." });
    }
  });

  router.delete("/delete-all", async (_req, res) => {
    try {
      const [result] = await db.query("DELETE FROM Cal_result");
      res.status(200).json({ message: "All results deleted successfully." });
    } catch (error) {
      console.error("Error deleting all results:", error);
      res.status(500).json({ error: "Failed to delete all results." });
    }
  });

  return router;

  
}
