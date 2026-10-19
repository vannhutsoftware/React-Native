import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import jsonServer from 'json-server';
import { validateCredentials } from '../src/utils/validation';
import type { User } from '../src/types/auth';
import type { Book, Review } from '../src/types/book';
import { sampleBooks, sampleReviews } from './seed';

interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

interface Session {
  token: string;
  userId: string;
  expiresAt: number;
}

const server = jsonServer.create();
const dbPath = process.env.DB_FILE || path.join(__dirname, 'db.json');
if (!existsSync(dbPath)) copyFileSync(path.join(__dirname, 'db.example.json'), dbPath);
const router = jsonServer.router<{
  users: StoredUser[]; books: Book[]; orders: unknown[]; reviews: Review[]; sessions: Session[];
}>(
  dbPath,
);
// Bổ sung sessions mà vẫn giữ nguyên tài khoản đã đăng ký ở câu 1.
router.db.defaults({ sessions: [] }).write();
if (router.db.get('books').size().value() === 0) {
  router.db.set('books', sampleBooks).write();
  if (router.db.get('reviews').size().value() === 0) {
    router.db.set('reviews', sampleReviews).write();
  }
}
// Bổ sung danh mục cho dữ liệu cũ, giữ nguyên sách và đánh giá đã lưu.
for (const book of router.db.get('books').value()) {
  if (!book.category) {
    const category = sampleBooks.find((sample) => sample.id === book.id)?.category ?? 'Khác';
    router.db.get('books').find({ id: book.id }).assign({ category }).write();
  }
}
server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

// Auth dùng middleware riêng vì json-server thuần chỉ cung cấp CRUD.
server.post(['/login', '/register'], (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const errors = validateCredentials({ email, password });
  if (errors.email || errors.password) {
    return res.status(400).json({ message: errors.email || errors.password });
  }

  const users = router.db.get('users').value();
  const existing = users.find((user) => user.email === email);
  if (req.path === '/register') {
    if (existing) return res.status(409).json({ message: 'Email đã được đăng ký.' });

    const salt = randomBytes(16).toString('hex');
    const user: StoredUser = {
      id: randomUUID(), email, salt,
      passwordHash: scryptSync(password, salt, 64).toString('hex'),
    };
    router.db.get('users').push(user).write();
    return res.status(201).json({ id: user.id, email: user.email });
  }

  if (!existing || !timingSafeEqual(
    scryptSync(password, existing.salt, 64), Buffer.from(existing.passwordHash, 'hex'),
  )) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
  }

  const token = randomUUID();
  router.db.get('sessions').push({
    token, userId: existing.id, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }).write();
  return res.json({ token, user: { id: existing.id, email: existing.email } });
});

function authenticatedUser(authorization: string | undefined) {
  const token = authorization?.match(/^Bearer (\S+)$/)?.[1];
  if (!token) return undefined;
  const session = router.db.get('sessions').find({ token }).value();
  return session && session.expiresAt > Date.now()
    ? router.db.get('users').find({ id: session.userId }).value()
    : undefined;
}

server.get('/auth/me', (req, res) => {
  const user = authenticatedUser(req.headers.authorization);
  if (!user) return res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
  return res.json({ id: user.id, email: user.email });
});

server.post('/logout', (req, res) => {
  const token = req.headers.authorization?.match(/^Bearer (\S+)$/)?.[1];
  router.db.get('sessions').remove({ token }).write();
  return res.sendStatus(204);
});

server.post('/reviews', (req, res) => {
  const user = authenticatedUser(req.headers.authorization);
  if (!user) return res.status(401).json({ message: 'Vui lòng đăng nhập để đánh giá.' });

  const { bookId, rating, comment } = req.body ?? {};
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Số sao phải là số nguyên từ 1 đến 5.' });
  }
  if (typeof comment !== 'string' || !comment.trim()) {
    return res.status(400).json({ message: 'Vui lòng nhập bình luận.' });
  }
  if (typeof bookId !== 'string' || !router.db.get('books').find({ id: bookId }).value()) {
    return res.status(404).json({ message: 'Không tìm thấy sách.' });
  }

  const review: Review = {
    id: randomUUID(), bookId, userId: user.id, userName: user.email.split('@')[0],
    rating, comment: comment.trim(),
  };
  router.db.get('reviews').push(review).write();
  return res.status(201).json(review);
});

// Chỉ cho đọc hoặc tạo qua API đã xác thực ở trên.
server.use('/reviews', (req, res, next) => {
  if (req.method === 'GET') return next();
  return res.status(405).json({ message: 'Không hỗ trợ thao tác này.' });
});

// Không công khai dữ liệu mật khẩu qua các route CRUD mặc định.
server.use(['/users', '/sessions', '/db'], (_req, res) => res.status(403).json({ message: 'Không cho phép truy cập.' }));
server.use(router);
const port = Number(process.env.PORT || 3001);
server.listen(port, '0.0.0.0', () => console.log(`BookStore API: http://localhost:${port}`));
