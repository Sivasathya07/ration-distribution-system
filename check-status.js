const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('='.repeat(50));
console.log('RATION DISTRIBUTION SYSTEM - STATUS CHECK');
console.log('='.repeat(50));
console.log();

// Check 1: Environment Variables
console.log('1. Checking Environment Variables...');
if (process.env.MONGO_URI) {
  console.log('   ✅ MONGO_URI is set');
} else {
  console.log('   ❌ MONGO_URI is missing!');
}

if (process.env.JWT_SECRET) {
  console.log('   ✅ JWT_SECRET is set');
} else {
  console.log('   ❌ JWT_SECRET is missing!');
}
console.log();

// Check 2: MongoDB Connection
console.log('2. Checking MongoDB Connection...');
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('   ✅ MongoDB is connected');
    
    // Check 3: Database Collections
    console.log();
    console.log('3. Checking Database Collections...');
    
    const User = require('./server/models/User');
    const Shop = require('./server/models/Shop');
    const Stock = require('./server/models/Stock');
    const Distribution = require('./server/models/Distribution');
    
    const userCount = await User.countDocuments();
    const shopCount = await Shop.countDocuments();
    const stockCount = await Stock.countDocuments();
    const distributionCount = await Distribution.countDocuments();
    
    console.log(`   Users: ${userCount}`);
    console.log(`   Shops: ${shopCount}`);
    console.log(`   Stock Records: ${stockCount}`);
    console.log(`   Distributions: ${distributionCount}`);
    
    if (userCount === 0) {
      console.log('   ⚠️  No users found! Run: node server/seed.js');
    } else {
      console.log('   ✅ Database has data');
      
      // Show admin user
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        console.log();
        console.log('   Admin User Found:');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: admin123 (from seed)`);
      }
    }
    
    console.log();
    console.log('4. Checking Backend Server...');
    
    try {
      const response = await axios.get('http://localhost:5000/api/health', {
        timeout: 3000
      });
      console.log('   ✅ Backend is running!');
      console.log(`   Response: ${JSON.stringify(response.data)}`);
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('   ❌ Backend is NOT running!');
        console.log('   Start it with: npm run dev');
      } else {
        console.log('   ❌ Error connecting to backend:', error.message);
      }
    }
    
    console.log();
    console.log('='.repeat(50));
    console.log('STATUS CHECK COMPLETE');
    console.log('='.repeat(50));
    console.log();
    console.log('Next Steps:');
    console.log('1. If backend is not running: npm run dev');
    console.log('2. If no users found: node server/seed.js');
    console.log('3. Start frontend: cd client && npm start');
    console.log('4. Login at: http://localhost:3000/login');
    console.log();
    
    process.exit(0);
  })
  .catch((error) => {
    console.log('   ❌ MongoDB connection failed!');
    console.log('   Error:', error.message);
    console.log();
    console.log('   Solutions:');
    console.log('   - Check if MongoDB service is running');
    console.log('   - Windows: net start MongoDB');
    console.log('   - Check MONGO_URI in .env file');
    console.log();
    process.exit(1);
  });
