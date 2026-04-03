const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const Book = require('./models/Book');
const DiscountCode = require('./models/DiscountCode');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Category.deleteMany({});
  await Book.deleteMany({});
  await DiscountCode.deleteMany({});
  console.log('Cleared old data');

  // --- Users ---
  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass = await bcrypt.hash('user123', 10);

  const admin = await User.create({
    username: 'admin',
    email: 'admin@bookstore.com',
    password: adminPass,
    role: 'admin'
  });
  const user1 = await User.create({
    username: 'nguyenvan',
    email: 'nguyenvan@gmail.com',
    password: userPass,
    role: 'user'
  });
  console.log('Created users: admin (admin123), nguyenvan (user123)');

  // --- Categories ---
  const cats = await Category.insertMany([
    { name: 'Văn học', description: 'Tiểu thuyết, truyện ngắn, thơ' },
    { name: 'Khoa học', description: 'Sách khoa học tự nhiên và ứng dụng' },
    { name: 'Kinh tế', description: 'Sách kinh doanh, tài chính, quản trị' },
    { name: 'Lịch sử', description: 'Sách lịch sử Việt Nam và thế giới' },
    { name: 'Công nghệ', description: 'Lập trình, AI, công nghệ thông tin' },
    { name: 'Thiếu nhi', description: 'Sách dành cho trẻ em' },
  ]);
  console.log(`Created ${cats.length} categories`);

  // --- Books ---
  const books = await Book.insertMany([
    {
      title: 'Dế Mèn Phiêu Lưu Ký',
      author: 'Tô Hoài',
      description: 'Câu chuyện phiêu lưu nổi tiếng của chú Dế Mèn qua nhiều vùng đất, gặp gỡ nhiều loài vật khác nhau.',
      price: 65000,
      category: 'Văn học',
      stock: 50
    },
    {
      title: 'Truyện Kiều',
      author: 'Nguyễn Du',
      description: 'Kiệt tác văn học Việt Nam, kể về cuộc đời đầy sóng gió của nàng Kiều.',
      price: 85000,
      category: 'Văn học',
      stock: 30
    },
    {
      title: 'Nhà Giả Kim',
      author: 'Paulo Coelho',
      description: 'Tiểu thuyết nổi tiếng thế giới về hành trình theo đuổi giấc mơ của chàng chăn cừu Santiago.',
      price: 79000,
      category: 'Văn học',
      stock: 40
    },
    {
      title: 'Sapiens: Lược Sử Loài Người',
      author: 'Yuval Noah Harari',
      description: 'Cuốn sách best-seller kể lại lịch sử phát triển của loài người từ thời tiền sử đến hiện đại.',
      price: 189000,
      category: 'Lịch sử',
      stock: 25
    },
    {
      title: 'Đắc Nhân Tâm',
      author: 'Dale Carnegie',
      description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử trong cuộc sống.',
      price: 76000,
      category: 'Kinh tế',
      stock: 60
    },
    {
      title: 'Lược Sử Thời Gian',
      author: 'Stephen Hawking',
      description: 'Giải thích các khái niệm vật lý phức tạp như Big Bang, lỗ đen một cách dễ hiểu.',
      price: 120000,
      category: 'Khoa học',
      stock: 20
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      description: 'Hướng dẫn viết code sạch, dễ bảo trì - cuốn sách gối đầu giường của lập trình viên.',
      price: 350000,
      category: 'Công nghệ',
      stock: 15
    },
    {
      title: 'Tư Duy Nhanh Và Chậm',
      author: 'Daniel Kahneman',
      description: 'Khám phá hai hệ thống tư duy chi phối cách chúng ta đưa ra quyết định.',
      price: 199000,
      category: 'Khoa học',
      stock: 35
    },
    {
      title: 'Chiến Binh Cầu Vồng',
      author: 'Andrea Hirata',
      description: 'Câu chuyện cảm động về nghị lực vươn lên của những đứa trẻ nghèo ở Indonesia.',
      price: 89000,
      category: 'Văn học',
      stock: 28
    },
    {
      title: 'Hoàng Tử Bé',
      author: 'Antoine de Saint-Exupéry',
      description: 'Câu chuyện cổ tích dành cho người lớn về tình bạn, tình yêu và ý nghĩa cuộc sống.',
      price: 55000,
      category: 'Thiếu nhi',
      stock: 45
    },
    {
      title: 'Python Crash Course',
      author: 'Eric Matthes',
      description: 'Nhập môn lập trình Python từ cơ bản đến nâng cao với các dự án thực tế.',
      price: 280000,
      category: 'Công nghệ',
      stock: 22
    },
    {
      title: 'Nghĩ Giàu Làm Giàu',
      author: 'Napoleon Hill',
      description: 'Cuốn sách kinh điển về tư duy làm giàu và thành công trong cuộc sống.',
      price: 95000,
      category: 'Kinh tế',
      stock: 38
    },
  ]);
  console.log(`Created ${books.length} books`);

  // --- Discount Codes ---
  const codes = await DiscountCode.insertMany([
    { code: 'WELCOME10', discount: 10, description: 'Giảm 10% cho khách hàng mới' },
    { code: 'SUMMER20', discount: 20, description: 'Khuyến mãi hè - Giảm 20%' },
    { code: 'BOOK50K', discount: 50000, description: 'Giảm 50.000đ cho đơn từ 200.000đ' },
  ]);
  console.log(`Created ${codes.length} discount codes`);

  console.log('\n--- SEED COMPLETE ---');
  console.log('Admin login: admin@bookstore.com / admin123');
  console.log('User login:  nguyenvan@gmail.com / user123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
