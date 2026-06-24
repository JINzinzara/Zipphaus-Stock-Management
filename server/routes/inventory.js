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

// 품목 목록 조회 (벤더별로 묶어서 반환)
router.get('/items', (req, res) => {
  const items = readJSON('items.json');
  const vendors = readJSON('vendors.json');

  const result = vendors.map(vendor => ({
    vendor,
    items: items.filter(item => item.vendor_id === vendor.id)
  }));

  res.json(result);
});

// 재고 제출
router.post('/submit', (req, res) => {
  const { location_id, user_id, frequency, counts } = req.body;
  const inventory = readJSON('inventory.json');

  const submission = {
    id: `inv_${Date.now()}`,
    location_id,
    user_id,
    frequency,
    date: new Date().toISOString().split('T')[0],
    counts
  };

  inventory.push(submission);
  writeJSON('inventory.json', inventory);

  res.json({ success: true, submission });
});

module.exports = router;