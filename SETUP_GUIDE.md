# Setup Guide - Digital Ration Distribution System

## Quick Start Guide

### Step 1: Install MongoDB

#### Windows
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will start automatically as a service

#### Mac
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Step 2: Install Node.js
Download and install Node.js from https://nodejs.org/ (LTS version recommended)

### Step 3: Clone and Setup Project

```bash
# Clone the repository
git clone <your-repo-url>
cd ration-distribution-system

# Install all dependencies
npm run install:all
```

### Step 4: Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ration_system
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=30d

# Email (Optional for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

CLIENT_URL=http://localhost:3000
```

### Step 5: Create Admin User

After starting the server, you can create an admin user by making a POST request to `/api/auth/register` with:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin",
  "phone": "1234567890",
  "address": "Admin Office"
}
```

Or use the provided seed script (create this file):

```javascript
// server/seed.js
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        phone: '9999999999',
        address: 'Government Office'
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedAdmin();
```

Run: `node server/seed.js`

### Step 6: Start the Application

```bash
# Start both frontend and backend
npm run dev:full
```

Or run separately:

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### Step 7: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## Testing the Application

### 1. Register as Beneficiary
- Go to http://localhost:3000/register
- Fill in the registration form
- Login with your credentials

### 2. Create Admin User
- Use the seed script or API to create admin
- Login as admin

### 3. Admin Workflow
1. Create a shopkeeper user
2. Create a shop and assign the shopkeeper
3. Create beneficiaries
4. Assign beneficiaries to shops
5. Allocate monthly stock to shops

### 4. Shopkeeper Workflow
1. Login as shopkeeper
2. View assigned beneficiaries
3. Record distributions
4. Check stock levels

### 5. Beneficiary Workflow
1. Login as beneficiary
2. View distribution history
3. Download receipts

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongodb
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change the PORT in .env file or kill the process using the port

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

### CORS Error
**Solution**: Make sure the backend is running and CLIENT_URL in .env matches your frontend URL

## Production Deployment

### Backend (Node.js)

1. Set environment variables:
```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=strong_random_secret
```

2. Build and start:
```bash
npm start
```

### Frontend (React)

1. Build the production bundle:
```bash
cd client
npm run build
```

2. Serve the build folder using a static server or deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Heroku

### Database (MongoDB)

Use MongoDB Atlas for production:
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGO_URI in .env

## Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password in EMAIL_PASS

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use environment variables for all sensitive data
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Enable CORS only for trusted domains
- [ ] Regular security updates

## Performance Optimization

1. Enable MongoDB indexing
2. Implement caching (Redis)
3. Use CDN for static assets
4. Enable gzip compression
5. Optimize images
6. Lazy load components

## Monitoring & Logging

Consider adding:
- Winston for logging
- PM2 for process management
- New Relic or DataDog for monitoring
- Sentry for error tracking

## Support

For issues and questions:
- Check the README.md
- Review API documentation
- Check MongoDB logs
- Review browser console for frontend errors
