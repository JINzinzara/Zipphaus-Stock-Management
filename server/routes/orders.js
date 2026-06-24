const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

function readJSON(filename) {
  const filePath = path.join(__dirname, '../data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJSON(filename, data) {
  const filePath = path.join(__dirname, '../data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 발주 제출
router.post('/submit', (req, res) => {
  const { location_id, user_id, items } = req.body;
  const orders = readJSON('orders.json');

  if (items.some(i => i.qty < 0)) {
    return res.status(400).json({ success: false, message: '0 이하 값은 입력할 수 없습니다' })
  }

  const order = {
    id: `order_${Date.now()}`,
    location_id,
    user_id,
    date: new Date().toISOString().split('T')[0],
    items
  };

  orders.push(order);
  writeJSON('orders.json', orders);

  res.json({ success: true, order });
});

// 발주 기록 조회
router.get('/history', (req, res) => {
  const { location_id } = req.query;
  const orders = readJSON('orders.json');

  const result = location_id
    ? orders.filter(o => o.location_id === location_id)
    : orders;

  res.json(result.reverse());
});

module.exports = router;