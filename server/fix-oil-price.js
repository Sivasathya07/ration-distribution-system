const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('./models/Shop');
const Stock = require('./models/Stock');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await Stock.updateMany(
    { 'items.name': 'Cooking Oil' },
    { $set: { 'items.$[el].pricePerUnit': 40 } },
    { arrayFilters: [{ 'el.name': 'Cooking Oil' }] }
  );
  console.log('✅ Updated Cooking Oil price in', result.modifiedCount, 'stock records');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
