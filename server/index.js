//서버 앱 만들기
const express = require('express');                               
const cors = require('cors');

const app = express();
const PORT = 3001;

// 미들웨어 설정
app.use(cors());                                                // 프론트엔드 통신 허용
app.use(express.json());                                        // JSON 형식의 데이터 받을 수 있게 설정

// 라우트 연결
app.use('/api/auth', require('./routes/auth'));                 // URL경로별로 어떤 파일이 처리할지 연결
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/orders', require('./routes/orders'));
// app.use('/api/pos', require('./routes/pos'));                  이 후 pos api 연동을 한다면 연결

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});