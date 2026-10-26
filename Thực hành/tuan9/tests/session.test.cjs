require('tsx/cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { AxiosError } = require('axios');
const { getJwtExpiry, validateCredentials } = require('../src/utils/auth.ts');
const { errorMessage } = require('../src/utils/errors.ts');
const { restoreStoredSession, saveStoredSession } = require('../src/services/sessionService.ts');

const user = { id: 4, name: 'Tài khoản Test', email: 'test@gmail.com' };
const tokenWith = (payload) => `e30.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;
const validToken = () => tokenWith({ exp: Math.floor(Date.now() / 1000) + 3600 });
const savedSession = () => ({ token: validToken(), user, expiresAt: 0 });
function storageFor(value) {
  const storage = {
    value,
    async getItem() { return storage.value; },
    async setItem(_key, next) { storage.value = next; },
    async removeItem() { storage.value = null; },
  };
  return storage;
}
function responseError(status, data = '') {
  return new AxiosError('HTTP error', 'ERR_BAD_RESPONSE', undefined, undefined, { status, data });
}

test('form: email hợp lệ và mật khẩu ít nhất 6 ký tự', () => {
  assert.ok(validateCredentials('', '').email);
  assert.ok(validateCredentials('sai-email', '12345').password);
  assert.ok(validateCredentials('sai-email', '123456').email);
  assert.deepEqual(validateCredentials(' test@gmail.com ', '123456'), { email: '', password: '' });
});

test('JWT hỏng, thiếu exp, exp sai kiểu bị coi là không hợp lệ', () => {
  for (const token of ['broken', tokenWith({}), tokenWith({ exp: '9999999999' }), tokenWith({ exp: -1 })]) {
    assert.equal(getJwtExpiry(token), 0);
  }
});

test('không có phiên thì không gọi xác minh', async () => {
  const tokens = [];
  const result = await restoreStoredSession(storageFor(null), async () => assert.fail('Must not call API'), (v) => tokens.push(v));
  assert.equal(result, null);
  assert.deepEqual(tokens, [null]);
});

test('phiên JSON hỏng, JWT hết hạn hoặc thiếu user bị xoá trước khi gọi API', async () => {
  for (const raw of ['not-json', 'null', JSON.stringify({ token: validToken() }),
    JSON.stringify({ token: tokenWith({ exp: 1 }), user, expiresAt: Date.now() + 999999 })]) {
    const storage = storageFor(raw);
    assert.equal(await restoreStoredSession(storage, async () => assert.fail('Must not call API'), () => {}), null);
    assert.equal(storage.value, null);
  }
});

test('khôi phục dùng exp thật, xác minh user, bỏ password trong kết quả API', async () => {
  const saved = savedSession();
  const storage = storageFor(JSON.stringify(saved));
  const tokens = [];
  const restored = await restoreStoredSession(storage, async (id) => {
    assert.equal(id, user.id);
    assert.equal(tokens.at(-1), saved.token);
    return { ...user, name: 'Tên cập nhật', password: 'secret-hash' };
  }, (token) => tokens.push(token));
  assert.equal(restored.user.name, 'Tên cập nhật');
  assert.ok(restored.expiresAt > Date.now());
  assert.equal('password' in restored.user, false);
  assert.equal(storage.value.includes('secret-hash'), false);
});

for (const status of [401, 403, 404]) {
  test(`xác minh trả ${status}: xoá phiên và header token`, async () => {
    const storage = storageFor(JSON.stringify(savedSession()));
    const tokens = [];
    const restored = await restoreStoredSession(storage, async () => { throw responseError(status); }, (v) => tokens.push(v));
    assert.equal(restored, null);
    assert.equal(storage.value, null);
    assert.equal(tokens.at(-1), null);
  });
}

test('mất mạng: không auto-login, giữ bản lưu để thử lại và xoá header token', async () => {
  const raw = JSON.stringify(savedSession());
  const storage = storageFor(raw);
  const tokens = [];
  await assert.rejects(restoreStoredSession(storage, async () => { throw new Error('offline'); }, (v) => tokens.push(v)), /offline/);
  assert.equal(storage.value, raw);
  assert.equal(tokens.at(-1), null);
});

test('lưu phiên chỉ giữ token và user công khai', async () => {
  const storage = storageFor(null);
  const result = await saveStoredSession(storage, {
    ...savedSession(), password: 'plain-password', user: { ...user, password: 'hash', salt: 'salt' },
  });
  assert.deepEqual(result.user, user);
  assert.equal(storage.value.includes('password'), false);
  assert.equal(storage.value.includes('salt'), false);
});

test('dịch lỗi đăng nhập/đăng ký và lỗi mạng sang tiếng Việt', () => {
  assert.equal(errorMessage(responseError(400, 'Incorrect password')), 'Email hoặc mật khẩu không đúng.');
  assert.equal(errorMessage(responseError(400, 'Email already exists')), 'Email đã được sử dụng.');
  assert.match(errorMessage(responseError(401, 'jwt expired')), /hết hạn/);
  assert.match(errorMessage(new AxiosError('Network Error')), /Không kết nối/);
});
