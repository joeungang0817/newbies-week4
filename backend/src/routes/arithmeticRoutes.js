"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
exports.default = (function (pool) {
    var router = (0, express_1.Router)();
    // GET 요청: 연산 결과 계산
    router.get('/arithmetic/arithmetic/:operator', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var operator, lhs, rhs, result;
        return __generator(this, function (_a) {
            operator = req.params.operator;
            lhs = parseInt(req.query.lhs);
            rhs = parseInt(req.query.rhs);
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
                    return [2 /*return*/, res.status(400).send('Invalid operator')];
            }
            res.json({ result: result });
            return [2 /*return*/];
        });
    }); });
    // POST 요청: 결과를 DB에 저장
    router.post('/arithmetic/result', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, operator, lhs, rhs, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, operator = _a.operator, lhs = _a.lhs, rhs = _a.rhs;
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
                            return [2 /*return*/, res.status(400).send('Invalid operator')];
                    }
                    // 결과 저장
                    return [4 /*yield*/, pool.execute('INSERT INTO Cal_result (lhs, rhs, cal, result_num, result) VALUES (?, ?, ?, ?, ?)', [
                            lhs,
                            rhs,
                            operator,
                            result,
                            "".concat(lhs, " ").concat(operator, " ").concat(rhs, " = ").concat(result),
                        ])];
                case 1:
                    // 결과 저장
                    _b.sent();
                    res.sendStatus(201); // Created
                    return [2 /*return*/];
            }
        });
    }); });
    // DELETE 요청: 결과 삭제
    router.delete('/arithmetic/result/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = parseInt(req.params.id);
                    return [4 /*yield*/, pool.execute('DELETE FROM Cal_result WHERE id = ?', [id])];
                case 1:
                    _a.sent();
                    res.sendStatus(204);
                    return [2 /*return*/];
            }
        });
    }); });
    // GET 요청: 특정 ID의 결과 가져오기
    router.get('/arithmetic/result/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = parseInt(req.params.id);
                    return [4 /*yield*/, pool.execute('SELECT * FROM Cal_result WHERE id = ?', [id])];
                case 1:
                    rows = (_a.sent())[0];
                    if (Array.isArray(rows) && rows.length > 0) {
                        res.json(rows[0]);
                    }
                    else {
                        res.status(404).send('Result not found');
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    return router;
});
