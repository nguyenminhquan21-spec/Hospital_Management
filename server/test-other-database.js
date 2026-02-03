import mongoose from 'mongoose';

// Connection string của nhóm khác
const mongoUri = 'mongodb+srv://viewer_produucts:02112005@cluster0.ab9nmhn.mongodb.net/ecommerce';

async function connectAndViewDatabase() {
  try {
    console.log('Đang kết nối tới database...');
    await mongoose.connect(mongoUri);
    console.log('✅ Kết nối thành công!');

    // Lấy database connection
    const db = mongoose.connection;

    // Liệt kê tất cả collection
    const collections = await db.db.listCollections().toArray();
    console.log('\n📚 Các collection trong database:');
    collections.forEach(col => console.log(`  - ${col.name}`));

    // Lấy số lượng documents trong mỗi collection
    console.log('\n📊 Số lượng documents:');
    for (const collection of collections) {
      const count = await db.db.collection(collection.name).countDocuments();
      console.log(`  ${collection.name}: ${count} documents`);
    }

    // Xem sample data từ collection đầu tiên
    if (collections.length > 0) {
      const firstCollection = collections[0].name;
      console.log(`\n📄 Sample data từ collection "${firstCollection}":"`);
      const sample = await db.db.collection(firstCollection).findOne();
      console.log(JSON.stringify(sample, null, 2));
    }

    await mongoose.disconnect();
    console.log('\n✅ Ngắt kết nối thành công!');
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

connectAndViewDatabase();
