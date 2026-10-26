const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
const jsonServer = require('../server/node_modules/json-server');
const auth = require('../server/node_modules/json-server-auth');
const jwt = require('../server/node_modules/jsonwebtoken');
const { JWT_SECRET_KEY } = require('../server/node_modules/json-server-auth/dist/constants');
const routes = require('../server/routes.json');

// Dùng đúng middleware của CLI, file DB tạm và cổng động để không đụng app đang chạy.
async function startServer(dbPath) {
  const app = jsonServer.create();
  const router = jsonServer.router(dbPath);
  app.db = router.db;
  app.use(jsonServer.defaults({ logger: false }));
  app.use(auth.rewriter(routes));
  app.use(auth);
  app.use(router);
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return server;
}

test('JSON Server: JWT, quyền sở hữu và lưu review qua lần khởi động lại', async (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'tuan9-api-'));
  const dbPath = path.join(temp, 'db.json');
  fs.copyFileSync(path.join(__dirname, '../server/db.seed.json'), dbPath);
  let server = await startServer(dbPath);
  t.after(async () => {
    if (server.listening) await new Promise((resolve) => server.close(resolve));
    // temp do mkdtemp tạo ngay trong OS temp, chỉ xoá file của bài test.
    fs.unlinkSync(dbPath);
    fs.rmdirSync(temp);
  });
  async function request(url, { token, body, method = 'GET' } = {}) {
    const response = await fetch(`http://127.0.0.1:${server.address().port}${url}`, {
      method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { status: response.status, data: await response.json() };
  }
  const credentials = { email: 'test@gmail.com', password: '123456' };
  let token;
  let createdId;

  await t.test('có 20 sách và sách bắt buộc id 8', async () => {
    const books = await request('/books');
    assert.equal(books.status, 200);
    assert.equal(books.data.length, 20);
    assert.equal((await request('/books/8')).data.title, 'Tư Duy Nhanh Và Chậm');
  });
  await t.test('phân trang sách tại server không trùng và không bỏ sót', async () => {
    const first = await request('/books?_page=1&_limit=10');
    const second = await request('/books?_page=2&_limit=10');
    const third = await request('/books?_page=3&_limit=10');
    assert.equal(first.status, 200);
    assert.equal(second.status, 200);
    assert.equal(first.data.length, 10);
    assert.equal(second.data.length, 10);
    assert.deepEqual(third.data, []);
    assert.equal(new Set([...first.data, ...second.data].map((book) => book.id)).size, 20);
  });
  await t.test('đăng nhập mẫu trả JWT có hạn 1 giờ, không trả mật khẩu', async () => {
    const login = await request('/login', { method: 'POST', body: credentials });
    assert.equal(login.status, 200);
    assert.equal(login.data.user.id, 4);
    assert.equal('password' in login.data.user, false);
    token = login.data.accessToken;
    const payload = jwt.decode(token);
    assert.equal(payload.exp - payload.iat, 3600);
  });
  await t.test('sai mật khẩu và email chưa đăng ký trả lỗi', async () => {
    assert.equal((await request('/login', { method: 'POST', body: { ...credentials, password: 'wrong123' } })).data, 'Incorrect password');
    assert.equal((await request('/login', { method: 'POST', body: { ...credentials, email: 'missing@example.com' } })).data, 'Cannot find user');
  });
  await t.test('đăng ký lưu hash và không cho email trùng', async () => {
    const body = { email: 'new@example.com', password: '123456', name: 'Sinh viên mới' };
    const registration = await request('/register', { method: 'POST', body });
    assert.equal(registration.status, 201);
    assert.ok(registration.data.accessToken);
    assert.equal('password' in registration.data.user, false);
    assert.equal((await request('/register', { method: 'POST', body })).data, 'Email already exists');
    const saved = JSON.parse(fs.readFileSync(dbPath, 'utf8')).users.find((user) => user.email === body.email);
    assert.match(saved.password, /^\$2[aby]\$/);
    assert.notEqual(saved.password, body.password);
  });
  await t.test('users 600: chỉ xem chính mình bằng token hợp lệ', async () => {
    assert.equal((await request('/users/4', { token })).status, 200);
    assert.equal((await request('/users/4')).status, 401);
    assert.equal((await request('/users/1', { token })).status, 403);
    assert.equal((await request('/users/4', { token: 'broken' })).status, 401);
  });
  await t.test('books 444: khách cũng xem được, không ghi được', async () => {
    assert.equal((await request('/books', { method: 'POST', token, body: { title: 'Không cho ghi' } })).status, 403);
  });
  await t.test('reviews 644: thiếu token hoặc giả userId bị chặn', async () => {
    const body = { bookId: 8, userId: 4, rating: 5, comment: 'Test' };
    assert.equal((await request('/reviews', { method: 'POST', body })).status, 401);
    assert.equal((await request('/reviews', { method: 'POST', token, body: { ...body, userId: 1 } })).status, 403);
  });
  await t.test('token đã hết hạn bị từ chối khi gửi review', async () => {
    const expired = jwt.sign({ email: credentials.email }, JWT_SECRET_KEY, { subject: '4', expiresIn: -1 });
    const response = await request('/reviews', { method: 'POST', token: expired, body: { userId: 4, bookId: 8, rating: 5 } });
    assert.equal(response.status, 401);
    assert.equal(response.data, 'jwt expired');
  });
  await t.test('test@gmail.com gửi review cho sách 8 và truy vấn ra mới nhất trước', async () => {
    const created = await request('/reviews', { method: 'POST', token, body: {
      bookId: 8, userId: 4, userName: 'Tài khoản Test', rating: 5,
      comment: 'Bài thực hành tuần 9 - kiểm tra lưu review.', createdAt: new Date().toISOString(),
    } });
    assert.equal(created.status, 201);
    createdId = created.data.id;
    const list = await request('/reviews?bookId=8&_sort=createdAt&_order=desc');
    assert.equal(list.data[0].id, createdId);
    assert.ok(list.data.every((review) => review.bookId === 8));
    assert.ok(JSON.parse(fs.readFileSync(dbPath, 'utf8')).reviews.some((review) => review.id === createdId));
  });
  await t.test('lọc sách liên quan tại server, loại sách hiện tại', async () => {
    const list = await request(`/books?category=${encodeURIComponent('Kỹ năng')}&id_ne=8&_limit=10`);
    assert.equal(list.data.length, 4);
    assert.ok(list.data.every((book) => book.id !== 8 && book.category === 'Kỹ năng'));
  });
  await t.test('review vẫn còn khi server khởi động lại', async () => {
    await new Promise((resolve) => server.close(resolve));
    server = await startServer(dbPath);
    assert.equal((await request(`/reviews/${createdId}`)).data.bookId, 8);
  });
  await t.test('không xoá review người khác, xoá được review của mình', async () => {
    assert.equal((await request('/reviews/1', { method: 'DELETE', token })).status, 403);
    assert.equal((await request(`/reviews/${createdId}`, { method: 'DELETE', token })).status, 200);
    assert.equal((await request(`/reviews/${createdId}`)).status, 404);
  });
});
