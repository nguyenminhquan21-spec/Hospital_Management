import mongoose from 'mongoose';

// Connection string của nhóm khác
const mongoUri = 'mongodb+srv://viewer_user:viewer123456@cluster0.tke6n1k.mongodb.net/hospital';

async function checkProducts() {
  try {
    console.log('🔗 Đang kết nối tới database...');
    await mongoose.connect(mongoUri);
    console.log('✅ Kết nối thành công!\n');

    const db = mongoose.connection;

    // Kiểm tra xem collection products có tồn tại không
    const collections = await db.db.listCollections().toArray();
    const hasProducts = collections.some(col => col.name === 'products');

    if (!hasProducts) {
      console.log('❌ Collection "products" không tồn tại');
      console.log('📚 Các collection có:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    } else {
      // Đếm số products
      const count = await db.db.collection('products').countDocuments();
      console.log(`✅ Collection "products" có ${count} documents\n`);

      if (count > 0) {
        // Lấy vài sản phẩm mẫu
        const products = await db.db.collection('products').find().limit(3).toArray();
        console.log('📦 Sample Products:');
        products.forEach((product, i) => {
          console.log(`\n${i + 1}. ${product.name || product.title || 'No name'}`);
          console.log(`   ID: ${product._id}`);
          if (product.price) console.log(`   Giá: ${product.price}`);
          if (product.description) console.log(`   Mô tả: ${product.description.substring(0, 50)}...`);
        });
      } else {
        console.log('⚠️  Collection "products" trống (0 documents)');
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Ngắt kết nối thành công!');
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

checkProducts();
