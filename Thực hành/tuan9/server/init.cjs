const { copyFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const db = path.join(__dirname, 'db.json');
if (!existsSync(db)) {
  copyFileSync(path.join(__dirname, 'db.seed.json'), db);
  console.log('Đã tạo db.json từ dữ liệu mẫu.');
}
