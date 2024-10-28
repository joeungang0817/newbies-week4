import { Router } from 'express';

export default (pool: any) => {
    const router = Router();

    // GET 요청: 연산 결과 계산
    router.get('/arithmetic/:operator', async (req, res) => {
        const { operator } = req.params;
        const lhs = parseInt(req.query.lhs as string);
        const rhs = parseInt(req.query.rhs as string);
        let result;

        // 연산 수행
        switch (operator) {
            case 'add':
                result = lhs + rhs;
                break;
            case 'sub':
                result = lhs - rhs;
                break;
            case 'mul':
                result = lhs * rhs;
                break;
            case 'div':
                result = lhs / rhs;
                break;
            case 'mod':
                result = lhs % rhs;
                break;
            default:
                return res.json({ok:false});
        }

        res.json({ result:result,ok:true });
    });

    // POST 요청: 결과를 DB에 저장
    router.post('/result', async (req, res) => {
        console.log(req.body);
        const operator = req.body.operator;
        const lhs = req.body.lhs;
        const rhs = req.body.rhs;
        let result;

        // 연산 수행
        switch (operator) {
            case 'add':
                result = lhs + rhs;
                break;
            case 'sub':
                result = lhs - rhs;
                break;
            case 'mul':
                result = lhs * rhs;
                break;
            case 'div':
                result = lhs / rhs;
                break;
            case 'mod':
                result = lhs % rhs;
                break;
            default:
                return res.json({ok:false});
        }

        // 결과 저장
        await pool.execute('INSERT INTO Cal_result (lhs, rhs, cal, result_num, result) VALUES (?, ?, ?, ?, ?)', [
            lhs,
            rhs,
            operator,
            result,
            `${lhs} ${operator} ${rhs} = ${result}`,
        ]);

        res.json({ok:true}); // Created
    });

    // DELETE 요청: 결과 삭제
    router.delete('/result/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        await pool.execute('DELETE FROM Cal_result WHERE id = ?', [id]);
        res.json({ok:true});
    });

    // GET 요청: 특정 ID의 결과 가져오기
    router.get('result/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        const [rows] = await pool.execute('SELECT * FROM Cal_result WHERE id = ?', [id]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.json({ok:true});
        }
    });

    return router;
};
