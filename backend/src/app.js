"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var arithmeticRoutes_1 = require("./routes/arithmeticRoutes");
var promise_1 = require("mysql2/promise");
var app = (0, express_1.default)();
var PORT = 3000;
// MySQL 연결 설정
var pool = (0, promise_1.createPool)({
    host: 'localhost',
    user: 'joeungang0817', // MySQL 사용자 이름
    password: 'aiden0817@', // MySQL 비밀번호
    database: 'calculator_db', // 사용할 데이터베이스 이름
});
// 미들웨어 설정
app.use(body_parser_1.default.json());
app.use(express_1.default.static('../../frontend'));
// 라우트 설정
app.use('/arithmetics', (0, arithmeticRoutes_1.default)(pool));
// 서버 시작
app.listen(PORT, function () {
    console.log("Server is running on http://localhost:".concat(PORT));
});
