const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');
const Shop = require('./models/Shop');
const Stock = require('./models/Stock');
const Complaint = require('./models/Complaint');
const Distribution = require('./models/Distribution');

// All 32 Tamil Nadu districts with coordinates
const TN_DISTRICTS = [
  { name: 'Chennai',        coords: [80.2707, 13.0827], pinStart: '600' },
  { name: 'Coimbatore',     coords: [76.9558, 11.0168], pinStart: '641' },
  { name: 'Madurai',        coords: [78.1198, 9.9252],  pinStart: '625' },
  { name: 'Tiruchirappalli',coords: [78.6869, 10.7905], pinStart: '620' },
  { name: 'Salem',          coords: [78.1460, 11.6643], pinStart: '636' },
  { name: 'Tirunelveli',    coords: [77.6695, 8.7139],  pinStart: '627' },
  { name: 'Tiruppur',       coords: [77.3411, 11.1085], pinStart: '641' },
  { name: 'Vellore',        coords: [79.1325, 12.9165], pinStart: '632' },
  { name: 'Erode',          coords: [77.7172, 11.3410], pinStart: '638' },
  { name: 'Thoothukudi',    coords: [78.1348, 8.7642],  pinStart: '628' },
  { name: 'Dindigul',       coords: [77.9803, 10.3673], pinStart: '624' },
  { name: 'Thanjavur',      coords: [79.1378, 10.7870], pinStart: '613' },
  { name: 'Ranipet',        coords: [79.3329, 12.9279], pinStart: '632' },
  { name: 'Sivaganga',      coords: [78.4800, 9.8473],  pinStart: '630' },
  { name: 'Virudhunagar',   coords: [77.9624, 9.5851],  pinStart: '626' },
  { name: 'Nagapattinam',   coords: [79.8449, 10.7672], pinStart: '611' },
  { name: 'Kanyakumari',    coords: [77.5385, 8.0883],  pinStart: '629' },
  { name: 'Dharmapuri',     coords: [78.1580, 12.1211], pinStart: '636' },
  { name: 'Krishnagiri',    coords: [78.2137, 12.5186], pinStart: '635' },
  { name: 'Namakkal',       coords: [78.1674, 11.2189], pinStart: '637' },
  { name: 'Cuddalore',      coords: [79.7680, 11.7480], pinStart: '607' },
  { name: 'Villupuram',     coords: [79.4898, 11.9401], pinStart: '605' },
  { name: 'Tiruvannamalai', coords: [79.0747, 12.2253], pinStart: '606' },
  { name: 'Pudukkottai',    coords: [78.8001, 10.3797], pinStart: '622' },
  { name: 'Ramanathapuram', coords: [78.8308, 9.3639],  pinStart: '623' },
  { name: 'Theni',          coords: [77.4760, 10.0104], pinStart: '625' },
  { name: 'Nilgiris',       coords: [76.7337, 11.4916], pinStart: '643' },
  { name: 'Perambalur',     coords: [78.8801, 11.2333], pinStart: '621' },
  { name: 'Ariyalur',       coords: [79.0767, 11.1400], pinStart: '621' },
  { name: 'Tiruvarur',      coords: [79.6340, 10.7726], pinStart: '610' },
  { name: 'Karur',          coords: [78.0800, 10.9601], pinStart: '639' },
  { name: 'Kallakurichi',   coords: [78.9590, 11.7380], pinStart: '606' },
];

const TAMIL_NAMES = [
  'முருகேசன்','அன்பரசு','செல்வராஜ்','கார்த்திக்','வேலுசாமி','பழனிசாமி','சுப்பிரமணி',
  'ராமசாமி','குமாரசாமி','தங்கவேல்','மாரிமுத்து','இளங்கோவன்','சண்முகம்','பாலசுப்பிரமணி',
  'அருள்','கோவிந்தசாமி','நடராஜன்','பெருமாள்','சிவகுமார்','ஆனந்தன்',
];
const TAMIL_FEMALE = [
  'கவிதா','மீனாட்சி','லட்சுமி','பார்வதி','சரஸ்வதி','தேவகி','லலிதா','கமலா','ரேவதி','சுமதி',
  'அம்மாள்','வள்ளி','மாலதி','ஜோதி','பிரியா','நிர்மலா','சாந்தி','கீதா','ரோஜா','விஜயா',
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const month = new Date().toLocaleString('default', { month: 'long' });
const year  = new Date().getFullYear();

const makeItems = (multiplier) => [
  { name: 'Rice',        allocated: 100*multiplier, remaining: 100*multiplier, distributed: 0, unit: 'kg',    pricePerUnit: 3   },
  { name: 'Wheat',       allocated: 80*multiplier,  remaining: 80*multiplier,  distributed: 0, unit: 'kg',    pricePerUnit: 2   },
  { name: 'Sugar',       allocated: 40*multiplier,  remaining: 40*multiplier,  distributed: 0, unit: 'kg',    pricePerUnit: 13  },
  { name: 'Kerosene',    allocated: 30*multiplier,  remaining: 30*multiplier,  distributed: 0, unit: 'litre', pricePerUnit: 15  },
  { name: 'Cooking Oil', allocated: 20*multiplier,  remaining: 20*multiplier,  distributed: 0, unit: 'litre', pricePerUnit: 40  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}), Shop.deleteMany({}),
      Stock.deleteMany({}), Complaint.deleteMany({}), Distribution.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // ── Admin ──
    const admin = await User.create({
      name: 'System Administrator', email: 'admin@ration.gov.in', password: 'admin123',
      role: 'admin', phone: '9999999999', address: 'Secretariat, Chennai',
      district: 'Chennai', state: 'Tamil Nadu', isApproved: true
    });

    // ── Generate 7 shops per district = 224 shops ──
    const SHOPS_PER_DISTRICT = 7;
    const shopAreas = ['North','South','East','West','Central','Old Town','New Town'];

    let shopkeeperDocs = [];
    let shopDocs = [];
    let shopNum = 1;

    for (const dist of TN_DISTRICTS) {
      for (let s = 0; s < SHOPS_PER_DISTRICT; s++) {
        const area = shopAreas[s];
        const isFemale = s % 3 === 0;
        const skName = isFemale ? rand(TAMIL_FEMALE) + ' அம்மாள்' : rand(TAMIL_NAMES);
        const skEmail = `sk${shopNum}@ration.tn.gov.in`;
        const pincode = `${dist.pinStart}${String(randInt(1,99)).padStart(3,'0')}`;
        const shopCode = `TN${String(shopNum).padStart(4,'0')}`;

        const sk = await User.create({
          name: skName, email: skEmail, password: 'shop123',
          role: 'shopkeeper', phone: `98${String(randInt(10000000,99999999))}`,
          address: `${area} Street, ${dist.name}`,
          district: dist.name, state: 'Tamil Nadu',
          pincode, isApproved: true
        });

        const jitter = () => (Math.random() - 0.5) * 0.15;
        const shop = await Shop.create({
          name: `${dist.name} ${area} Ration Shop`,
          shopNumber: shopCode,
          owner: sk._id,
          address: `${area} Street, ${dist.name}, Tamil Nadu`,
          district: dist.name, state: 'Tamil Nadu',
          pincode,
          phone: sk.phone,
          licenseNumber: `LIC-TN-${shopCode}`,
          location: { type: 'Point', coordinates: [dist.coords[0] + jitter(), dist.coords[1] + jitter()] },
          rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
          totalRatings: randInt(10, 80),
          isActive: true
        });

        await User.findByIdAndUpdate(sk._id, { shop: shop._id });
        shopkeeperDocs.push(sk);
        shopDocs.push(shop);
        shopNum++;
      }
    }

    console.log(`✅ Created ${shopDocs.length} shops across ${TN_DISTRICTS.length} districts`);

    // ── Stock for every shop ──
    const stockDocs = shopDocs.map(shop => ({
      shop: shop._id,
      items: makeItems(randInt(3, 8)),
      month, year,
      allocatedBy: admin._id
    }));
    await Stock.insertMany(stockDocs);
    console.log(`✅ Stock allocated for all ${stockDocs.length} shops`);

    // ── 3 beneficiaries per shop = ~672 beneficiaries ──
    const BENE_PER_SHOP = 3;
    const cardTypes = ['PHH','BPL','AAY','APL'];
    let beneNum = 1;
    const allBeneDocs = [];
    const shopBeneMap = []; // { shopId, beneIndexes }

    for (let i = 0; i < shopDocs.length; i++) {
      const shop = shopDocs[i];
      const dist = TN_DISTRICTS[Math.floor(i / SHOPS_PER_DISTRICT)];
      const indexes = [];
      for (let b = 0; b < BENE_PER_SHOP; b++) {
        const isFemale = b % 2 === 0;
        const beneName = isFemale ? rand(TAMIL_FEMALE) : rand(TAMIL_NAMES);
        allBeneDocs.push({
          name: beneName,
          email: `bene${beneNum}@example.com`,
          password: 'user123',
          role: 'beneficiary',
          phone: `97${String(randInt(10000000,99999999))}`,
          address: `${randInt(1,99)}, Main Road, ${dist.name}`,
          rationCardNumber: `RC-TN-${String(beneNum).padStart(6,'0')}`,
          rationCardType: cardTypes[beneNum % 4],
          familyMembers: randInt(2, 7),
          shop: shop._id,
          district: dist.name,
          state: 'Tamil Nadu',
          pincode: shop.pincode,
          isApproved: true
        });
        indexes.push(allBeneDocs.length - 1);
        beneNum++;
      }
      shopBeneMap.push({ shopId: shop._id, count: BENE_PER_SHOP });
    }

    // Hash passwords in bulk via bcrypt before insertMany
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('user123', 10);
    allBeneDocs.forEach(b => { b.password = hashed; });
    const insertedBenes = await User.insertMany(allBeneDocs, { lean: true });

    // Update shop beneficiary counts
    const shopCountUpdates = shopBeneMap.map(({ shopId, count }) =>
      Shop.findByIdAndUpdate(shopId, { beneficiariesCount: count })
    );
    await Promise.all(shopCountUpdates);

    console.log(`✅ Created ${insertedBenes.length} beneficiaries`);

    // ── Sample complaints ──
    const sampleBeneficiaries = insertedBenes.slice(0, 5).map((bene, i) => ({ bene, shop: shopDocs[i] }));

    // ── Distribution history — last 6 months for first 30 shops ──
    const MONTHS = ['October','November','December','January','February','March'];
    const YEARS  = [2025,2025,2025,2026,2026,2026];
    const distItems = (multiplier) => [
      { name:'Rice',        quantity:5*multiplier,  unit:'kg',    pricePerUnit:3,   totalPrice:15*multiplier  },
      { name:'Wheat',       quantity:3*multiplier,  unit:'kg',    pricePerUnit:2,   totalPrice:6*multiplier   },
      { name:'Sugar',       quantity:1*multiplier,  unit:'kg',    pricePerUnit:13,  totalPrice:13*multiplier  },
      { name:'Kerosene',    quantity:2*multiplier,  unit:'litre', pricePerUnit:15,  totalPrice:30*multiplier  },
      { name:'Cooking Oil', quantity:1*multiplier,  unit:'litre', pricePerUnit:40,  totalPrice:40*multiplier  },
    ];

    const distBulk = [];
    const receiptSet = new Set();
    // Use first 40 shops and their beneficiaries
    const historyShops = shopDocs.slice(0, 40);
    const historyBenes = insertedBenes.slice(0, 120); // 3 per shop

    for (let mi = 0; mi < MONTHS.length; mi++) {
      const m = MONTHS[mi];
      const y = YEARS[mi];
      for (let si = 0; si < historyShops.length; si++) {
        const shop = historyShops[si];
        const shopkeeper = shopkeeperDocs[si];
        // 2-3 beneficiaries per shop per month
        const beneSlice = historyBenes.slice(si * 3, si * 3 + 3);
        for (const bene of beneSlice) {
          const receiptKey = `${bene._id}-${m}-${y}`;
          if (receiptSet.has(receiptKey)) continue;
          receiptSet.add(receiptKey);
          const mult = randInt(1, 2);
          const items = distItems(mult);
          const total = items.reduce((s, i) => s + i.totalPrice, 0);
          const receiptNum = `RCP-${y}-${m.slice(0,3).toUpperCase()}-${String(distBulk.length + 1).padStart(5,'0')}`;
          distBulk.push({
            beneficiary: bene._id,
            shop: shop._id,
            distributedBy: shopkeeper._id,
            items, totalAmount: total,
            month: m, year: y,
            receiptNumber: receiptNum,
            status: 'completed'
          });
        }
      }
    }
    await Distribution.insertMany(distBulk, { ordered: false });
    console.log(`✅ Created ${distBulk.length} distribution records (6 months history)`);

    // ── Deduct stock for current month distributions ──
    const currentMonthDists = distBulk.filter(d => d.month === month && d.year === year);
    const stockDeductMap = {};
    currentMonthDists.forEach(d => {
      const key = d.shop.toString();
      if (!stockDeductMap[key]) stockDeductMap[key] = {};
      d.items.forEach(item => {
        stockDeductMap[key][item.name] = (stockDeductMap[key][item.name] || 0) + item.quantity;
      });
    });
    for (const [shopId, itemTotals] of Object.entries(stockDeductMap)) {
      const stock = await Stock.findOne({ shop: shopId, month, year });
      if (!stock) continue;
      stock.items.forEach(si => {
        const dist = itemTotals[si.name] || 0;
        si.distributed = dist;
        si.remaining = Math.max(0, si.allocated - dist);
      });
      await stock.save({ validateBeforeSave: false });
    }
    console.log(`✅ Stock deducted for ${Object.keys(stockDeductMap).length} shops`);

    // ── Sample complaints ──
    if (sampleBeneficiaries.length >= 2) {
      await Complaint.create([
        {
          submittedBy: sampleBeneficiaries[0].bene._id,
          shop: sampleBeneficiaries[0].shop._id,
          category: 'stock_shortage', title: 'அரிசி கிடைக்கவில்லை',
          description: 'This month rice was not available at the shop.',
          status: 'pending', priority: 'high'
        },
        {
          submittedBy: sampleBeneficiaries[1].bene._id,
          shop: sampleBeneficiaries[1].shop._id,
          category: 'overcharging', title: 'கூடுதல் விலை வசூல்',
          description: 'Shopkeeper charged extra for wheat.',
          status: 'pending', priority: 'medium'
        }
      ]);
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📍 Districts : ${TN_DISTRICTS.length}`);
    console.log(`🏪 Shops     : ${shopDocs.length}`);
    console.log(`👥 Beneficiaries: ${insertedBenes.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin        : admin@ration.gov.in  / admin123');
    console.log('🏪 Shopkeeper 1 : sk1@ration.tn.gov.in / shop123');
    console.log('🏪 Shopkeeper 2 : sk2@ration.tn.gov.in / shop123');
    console.log('👥 Beneficiary 1: bene1@example.com    / user123');
    console.log('👥 Beneficiary 2: bene2@example.com    / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    console.error(err);
    process.exit(1);
  }
};

seed();
