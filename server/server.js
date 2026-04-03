const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config({ path: path.join(__dirname, '../.env') });
connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/shops', require('./routes/shopRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));
app.use('/api/distribution', require('./routes/distributionRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date(), env: process.env.NODE_ENV }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT} [${process.env.NODE_ENV}]`));
