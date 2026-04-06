/* eslint-disable no-console */
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

const results = [];

async function request(name, method, path, { token, body, expected = [200] } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  const ok = expected.includes(res.status);
  results.push({ name, method, path, status: res.status, ok, data });

  if (!ok) {
    const err = new Error(`${name} failed with ${res.status}`);
    err.response = data;
    throw err;
  }

  return data;
}

function printSummary() {
  const pass = results.filter((r) => r.ok).length;
  const fail = results.length - pass;
  console.log('\n=== API TEST SUMMARY ===');
  console.log(`Total: ${results.length} | Pass: ${pass} | Fail: ${fail}`);
  for (const r of results) {
    const mark = r.ok ? 'PASS' : 'FAIL';
    console.log(`${mark} | ${r.status} | ${r.method} ${r.path} | ${r.name}`);
  }
}

(async function run() {
  const runId = Date.now();
  const tempEmail = `apitest_${runId}@mail.com`;
  const tempUsername = `apitest_${runId}`;
  const deleteEmail = `apitest_delete_${runId}@mail.com`;
  const deleteUsername = `apitest_delete_${runId}`;

  let adminToken;
  let userToken;
  let tempUserId;
  let deleteUserId;
  let existingBookId;
  let createdBookId;
  let createdCategoryId;
  let cartItemId;
  let placedOrderId;
  let wishlistItemId;
  let reviewId;
  let createdDiscountId;
  let createdDiscountCode;
  let existingPublisherId;
  let createdPublisherId;
  let createdAddressId;
  let sentNotificationId;
  let createdBannerId;

  try {
    // 2.1 Authentication
    await request('Auth register temp user', 'POST', '/auth/register', {
      body: { username: tempUsername, email: tempEmail, password: '123456' },
      expected: [201]
    });

    const adminLogin = await request('Auth login admin', 'POST', '/auth/login', {
      body: { email: 'admin@bookstore.com', password: 'admin123' },
      expected: [200]
    });
    adminToken = adminLogin.token;

    const userLogin = await request('Auth login temp user', 'POST', '/auth/login', {
      body: { email: tempEmail, password: '123456' },
      expected: [200]
    });
    userToken = userLogin.token;
    tempUserId = userLogin.user?.id;

    await request('Auth me (GET)', 'GET', '/auth/me', {
      token: userToken,
      expected: [200]
    });

    await request('Auth me (PUT)', 'PUT', '/auth/me', {
      token: userToken,
      body: { username: `${tempUsername}_updated` },
      expected: [200]
    });

    const allUsers = await request('Auth users list', 'GET', '/auth/users', {
      token: adminToken,
      expected: [200]
    });

    const foundTemp = allUsers.find((u) => u.email === tempEmail);
    if (foundTemp?._id) tempUserId = foundTemp._id;

    // separate user for delete test
    await request('Auth register delete-target user', 'POST', '/auth/register', {
      body: { username: deleteUsername, email: deleteEmail, password: '123456' },
      expected: [201]
    });

    const usersAfterCreate = await request('Auth users list after create', 'GET', '/auth/users', {
      token: adminToken,
      expected: [200]
    });
    const deleteTarget = usersAfterCreate.find((u) => u.email === deleteEmail);
    deleteUserId = deleteTarget?._id;

    await request('Auth update user role', 'PUT', `/auth/users/${tempUserId}/role`, {
      token: adminToken,
      body: { role: 'user' },
      expected: [200]
    });

    await request('Auth delete user', 'DELETE', `/auth/users/${deleteUserId}`, {
      token: adminToken,
      expected: [200]
    });

    // 2.2 Books
    const books = await request('Books list', 'GET', '/books', { expected: [200] });
    if (!Array.isArray(books) || books.length === 0) {
      throw new Error('No books found. Run seed.js first.');
    }
    existingBookId = books[0]._id;

    await request('Book detail', 'GET', `/books/${existingBookId}`, { expected: [200] });

    const createdBook = await request('Create book', 'POST', '/books', {
      token: adminToken,
      body: {
        title: `API Test Book ${runId}`,
        author: 'API Bot',
        description: 'Created by automated API test',
        price: 123000,
        category: 'Cong nghe',
        publisher: 'NXB Tong Hop',
        stock: 20
      },
      expected: [201]
    });
    createdBookId = createdBook._id;

    await request('Update book', 'PUT', `/books/${createdBookId}`, {
      token: adminToken,
      body: { price: 125000, stock: 22 },
      expected: [200]
    });

    await request('Delete book', 'DELETE', `/books/${createdBookId}`, {
      token: adminToken,
      expected: [200]
    });

    // 2.3 Categories
    await request('Categories list', 'GET', '/categories', { expected: [200] });

    const createdCategory = await request('Create category', 'POST', '/categories', {
      token: adminToken,
      body: { name: `API Category ${runId}`, description: 'Test category' },
      expected: [201]
    });
    createdCategoryId = createdCategory._id;

    await request('Update category', 'PUT', `/categories/${createdCategoryId}`, {
      token: adminToken,
      body: { name: `API Category Updated ${runId}` },
      expected: [200]
    });

    await request('Delete category', 'DELETE', `/categories/${createdCategoryId}`, {
      token: adminToken,
      expected: [200]
    });

    // 2.4 Cart
    await request('Get cart', 'GET', '/cart', { token: userToken, expected: [200] });

    const cartAdded = await request('Add to cart', 'POST', '/cart', {
      token: userToken,
      body: { bookId: existingBookId, quantity: 2 },
      expected: [201]
    });
    cartItemId = cartAdded._id;

    await request('Update cart item', 'PUT', `/cart/${cartItemId}`, {
      token: userToken,
      body: { quantity: 3 },
      expected: [200]
    });

    await request('Delete cart item', 'DELETE', `/cart/${cartItemId}`, {
      token: userToken,
      expected: [200]
    });

    await request('Add to cart again', 'POST', '/cart', {
      token: userToken,
      body: { bookId: existingBookId, quantity: 1 },
      expected: [201]
    });

    await request('Clear cart', 'DELETE', '/cart', {
      token: userToken,
      expected: [200]
    });

    // 2.5 Orders
    await request('Prepare cart for order', 'POST', '/cart', {
      token: userToken,
      body: { bookId: existingBookId, quantity: 1 },
      expected: [201]
    });

    const placedOrder = await request('Place order', 'POST', '/orders', {
      token: userToken,
      body: { discountCode: 'WELCOME10' },
      expected: [201]
    });
    placedOrderId = placedOrder._id;

    await request('My orders', 'GET', '/orders', {
      token: userToken,
      expected: [200]
    });

    await request('All orders (admin)', 'GET', '/orders/all', {
      token: adminToken,
      expected: [200]
    });

    await request('Update order status', 'PUT', `/orders/${placedOrderId}/status`, {
      token: adminToken,
      body: { status: 'shipped' },
      expected: [200]
    });

    // 2.6 Wishlist
    await request('Get wishlist', 'GET', '/wishlist', { token: userToken, expected: [200] });

    const wishlistAdded = await request('Add wishlist item', 'POST', '/wishlist', {
      token: userToken,
      body: { bookId: existingBookId },
      expected: [201]
    });
    wishlistItemId = wishlistAdded._id;

    await request('Delete wishlist item', 'DELETE', `/wishlist/${wishlistItemId}`, {
      token: userToken,
      expected: [200]
    });

    // 2.7 Reviews
    await request('Get reviews by book', 'GET', `/reviews/book/${existingBookId}`, { expected: [200] });

    const review = await request('Add review', 'POST', `/reviews/book/${existingBookId}`, {
      token: userToken,
      body: { rating: 5, comment: 'API test review' },
      expected: [201]
    });
    reviewId = review._id;

    await request('Delete review', 'DELETE', `/reviews/${reviewId}`, {
      token: userToken,
      expected: [200]
    });

    // 2.8 Discount codes
    await request('Discount list', 'GET', '/discountcodes', { token: adminToken, expected: [200] });

    createdDiscountCode = `APITEST${String(runId).slice(-6)}`;
    const createdDiscount = await request('Create discount code', 'POST', '/discountcodes', {
      token: adminToken,
      body: { code: createdDiscountCode, discount: 15, description: 'API test code' },
      expected: [201]
    });
    createdDiscountId = createdDiscount._id;

    await request('Apply discount code', 'POST', '/discountcodes/apply', {
      token: userToken,
      body: { code: createdDiscountCode },
      expected: [200]
    });

    await request('Update discount code', 'PUT', `/discountcodes/${createdDiscountId}`, {
      token: adminToken,
      body: { code: createdDiscountCode, discount: 20, description: 'Updated test code' },
      expected: [200]
    });

    await request('Delete discount code', 'DELETE', `/discountcodes/${createdDiscountId}`, {
      token: adminToken,
      expected: [200]
    });

    // 2.9 Publishers
    const publishers = await request('Publishers list', 'GET', '/publishers', { expected: [200] });
    if (Array.isArray(publishers) && publishers.length > 0) {
      existingPublisherId = publishers[0]._id;
      await request('Publisher detail', 'GET', `/publishers/${existingPublisherId}`, { expected: [200] });
    }

    const createdPublisher = await request('Create publisher', 'POST', '/publishers', {
      token: adminToken,
      body: {
        name: `API Publisher ${runId}`,
        address: 'Ha Noi',
        phone: '0901234567',
        email: `publisher_${runId}@mail.com`
      },
      expected: [201]
    });
    createdPublisherId = createdPublisher._id;

    await request('Update publisher', 'PUT', `/publishers/${createdPublisherId}`, {
      token: adminToken,
      body: { phone: '0909999999' },
      expected: [200]
    });

    await request('Delete publisher', 'DELETE', `/publishers/${createdPublisherId}`, {
      token: adminToken,
      expected: [200]
    });

    // 2.10 Address
    await request('Get addresses', 'GET', '/address', { token: userToken, expected: [200] });

    const createdAddress = await request('Create address', 'POST', '/address', {
      token: userToken,
      body: {
        fullName: 'Nguyen Van API',
        phone: '0901234567',
        address: '123 Le Loi',
        city: 'Thanh pho Ho Chi Minh',
        district: 'Quan 1',
        ward: 'Ben Nghe',
        isDefault: true
      },
      expected: [201]
    });
    createdAddressId = createdAddress._id;

    await request('Update address', 'PUT', `/address/${createdAddressId}`, {
      token: userToken,
      body: { phone: '0909999999', ward: 'Ben Nghe', isDefault: true },
      expected: [200]
    });

    await request('Delete address', 'DELETE', `/address/${createdAddressId}`, {
      token: userToken,
      expected: [200]
    });

    // 2.11 Notifications
    await request('Get my notifications', 'GET', '/notifications', {
      token: userToken,
      expected: [200]
    });

    await request('Mark all notifications read', 'PUT', '/notifications/read-all', {
      token: userToken,
      body: {},
      expected: [200]
    });

    const sentNotif = await request('Admin send notification', 'POST', '/notifications/send', {
      token: adminToken,
      body: {
        userId: tempUserId,
        title: 'Thong bao moi',
        message: 'Don hang da giao',
        type: 'order'
      },
      expected: [201]
    });
    sentNotificationId = sentNotif._id;

    await request('Mark one notification read', 'PUT', `/notifications/${sentNotificationId}/read`, {
      token: userToken,
      body: {},
      expected: [200]
    });

    await request('Delete notification', 'DELETE', `/notifications/${sentNotificationId}`, {
      token: userToken,
      expected: [200]
    });

    // 2.12 Banners
    await request('Get active banners', 'GET', '/banners', { expected: [200] });

    await request('Get all banners', 'GET', '/banners/all', {
      token: adminToken,
      expected: [200]
    });

    const createdBanner = await request('Create banner', 'POST', '/banners', {
      token: adminToken,
      body: {
        title: `API Banner ${runId}`,
        imageUrl: 'https://example.com/banner.jpg',
        link: '/books',
        isActive: true,
        order: 1
      },
      expected: [201]
    });
    createdBannerId = createdBanner._id;

    await request('Update banner', 'PUT', `/banners/${createdBannerId}`, {
      token: adminToken,
      body: { isActive: false },
      expected: [200]
    });

    await request('Delete banner', 'DELETE', `/banners/${createdBannerId}`, {
      token: adminToken,
      expected: [200]
    });

    printSummary();
    process.exit(0);
  } catch (err) {
    console.error('\nERROR:', err.message);
    if (err.response) {
      console.error('Response:', JSON.stringify(err.response, null, 2));
    }
    printSummary();
    process.exit(1);
  }
})();
