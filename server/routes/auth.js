const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// users.json 파일 읽기
function getUsers() {
  const filePath = path.join(__dirname, '../data/users.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { location_id, pin } = req.body;
  const users = getUsers();

  // 매니저 로그인 (location_id 없이 PIN만)
  if (!location_id) {
    const manager = users.find(u => u.role === 'manager' && u.pin === pin);
    if (manager) {
      return res.json({ success: true, user: manager });
    }
    return res.status(401).json({ success: false, message: 'PIN이 올바르지 않습니다' });
  }

  // 직원 로그인 (지점 + PIN)
  const staff = users.find(u => u.location_id === location_id && u.pin === pin);
  if (staff) {
    return res.json({ success: true, user: staff });
  }
  return res.status(401).json({ success: false, message: '지점 또는 PIN이 올바르지 않습니다' });
});

// GET /api/auth/locations
router.get('/locations', (req, res) => {
  const filePath = path.join(__dirname, '../data/locations.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  res.json(JSON.parse(data));
});

module.exports = router;