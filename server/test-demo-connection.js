import mongoose from 'mongoose';

// Connection string mới
const mongoUri = 'mongodb+srv://demo_viewer:demo123456@cluster0.tke6n1k.mongodb.net/hospital?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('🔗 Đang kết nối tới database...\n');
    await mongoose.connect(mongoUri);
    console.log('✅ Kết nối thành công!\n');

    const db = mongoose.connection;

    // Liệt kê tất cả collection
    const collections = await db.db.listCollections().toArray();
    console.log('📚 Các collection trong database:');
    collections.forEach(col => console.log(`   ✓ ${col.name}`));

    // Đếm documents trong mỗi collection
    console.log('\n📊 Số lượng documents:');
    for (const collection of collections) {
      const count = await db.db.collection(collection.name).countDocuments();
      console.log(`   ${collection.name}: ${count} documents`);
    }

    // Chi tiết một số collection quan trọng
    console.log('\n' + '='.repeat(50));
    const importantCollections = ['doctors', 'medicines', 'appointments', 'products'];
    
    for (const collName of importantCollections) {
      const col = collections.find(c => c.name === collName);
      if (col) {
        const count = await db.db.collection(collName).countDocuments();
        if (count > 0) {
          const sample = await db.db.collection(collName).findOne();
          console.log(`\n📄 Sample từ "${collName}":`);
          console.log(JSON.stringify(sample, null, 2).substring(0, 300) + '...');
        }
      }
    }

    await mongoose.disconnect();
    console.log('\n' + '='.repeat(50));
    console.log('✅ Ngắt kết nối thành công!');
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    if (error.message.includes('auth')) {
      console.log('\n💡 Gợi ý: Kiểm tra username/password hoặc IP whitelist');
    }
  }
}

testConnection();
