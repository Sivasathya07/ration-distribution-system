const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Stock = require('./models/Stock');
const Distribution = require('./models/Distribution');

const fix = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected');

  // Get all distributions grouped by shop+month+year
  const groups = await Distribution.aggregate([
    { $group: {
      _id: { shop: '$shop', month: '$month', year: '$year' },
      items: { $push: '$items' }
    }}
  ]);

  let updated = 0;
  for (const g of groups) {
    const { shop, month, year } = g._id;
    const stock = await Stock.findOne({ shop, month, year });
    if (!stock) continue;

    // Flatten all distributed items
    const totals = {};
    g.items.forEach(itemArr => {
      itemArr.forEach(item => {
        if (!totals[item.name]) totals[item.name] = 0;
        totals[item.name] += item.quantity || 0;
      });
    });

    // Update each stock item
    let changed = false;
    stock.items.forEach(si => {
      const dist = totals[si.name] || 0;
      if (dist > 0) {
        si.distributed = dist;
        si.remaining = Math.max(0, si.allocated - dist);
        changed = true;
      }
    });

    if (changed) {
      stock.updatedAt = new Date();
      await stock.save({ validateBeforeSave: false });
      updated++;
    }
  }

  console.log(`✅ Fixed stock for ${updated} shop/month records`);
  process.exit(0);
};

fix().catch(err => { console.error(err); process.exit(1); });
