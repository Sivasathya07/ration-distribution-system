# Quick Start Guide

Get the Digital Ration Distribution System up and running in 10 minutes!

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js (v14 or higher) - [Download](https://nodejs.org/)
- [ ] MongoDB (local or Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- [ ] Git - [Download](https://git-scm.com/)
- [ ] Code editor (VS Code recommended)

## 5-Step Setup

### Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd ration-distribution-system

# Install all dependencies (backend + frontend)
npm run install:all
```

### Step 2: Configure Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file with your settings:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ration_system
JWT_SECRET=your_secret_key_change_this
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

**Quick MongoDB Setup:**
- **Local**: Just start MongoDB service
- **Atlas**: Get connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Step 3: Start MongoDB (30 seconds)

**Windows:**
```bash
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongodb
# or
brew services start mongodb-community
```

**MongoDB Atlas:**
- Already running in cloud, skip this step!

### Step 4: Seed Database (30 seconds)

```bash
npm run seed
```

This creates sample data:
- 1 Admin user
- 2 Shopkeepers with shops
- 3 Beneficiaries
- Stock allocations

### Step 5: Start Application (1 minute)

```bash
# Start both backend and frontend
npm run dev:full
```

**Or run separately:**

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

## Access the Application

🎉 **You're ready!**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## Test Credentials

### Admin Account
```
Email: admin@ration.gov.in
Password: admin123
```

### Shopkeeper Account
```
Email: rajesh@shop1.com
Password: shop123
```

### Beneficiary Account
```
Email: amit@example.com
Password: user123
```

## Quick Test Flow

### 1. Login as Admin
1. Go to http://localhost:3000/login
2. Use admin credentials
3. View dashboard with analytics

### 2. Test as Shopkeeper
1. Logout and login as shopkeeper
2. View assigned beneficiaries
3. Click "Distribute" on a beneficiary
4. Enter quantities and submit
5. Check email simulation in console

### 3. Test as Beneficiary
1. Logout and login as beneficiary
2. View distribution history
3. Download receipt as PDF
4. Check QR code

## Common Issues & Quick Fixes

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Fix**: Start MongoDB service
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
**Fix**: Change PORT in .env or kill the process
```bash
# Find process
lsof -i :5000

# Kill it
kill -9 <PID>
```

### Module Not Found
```
Error: Cannot find module 'express'
```
**Fix**: Reinstall dependencies
```bash
rm -rf node_modules
npm install
cd client
rm -rf node_modules
npm install
```

### Frontend Not Loading
**Fix**: Check if backend is running
```bash
curl http://localhost:5000/api/health
```

### Can't Login
**Fix**: Reseed database
```bash
npm run seed
```

## Project Structure Overview

```
ration-distribution-system/
├── server/              # Backend (Node.js + Express)
│   ├── controllers/     # Business logic
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   └── server.js        # Entry point
│
├── client/              # Frontend (React)
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   └── context/     # State management
│   └── package.json
│
├── .env                 # Environment variables
└── package.json         # Root scripts
```

## Available Scripts

```bash
# Development
npm run dev              # Start backend only
npm run client           # Start frontend only
npm run dev:full         # Start both (recommended)

# Database
npm run seed             # Seed sample data

# Production
npm start                # Start backend in production
npm run build            # Build frontend for production

# Installation
npm run install:all      # Install all dependencies
```

## Next Steps

1. **Explore Features**
   - Try all three user roles
   - Record distributions
   - Download receipts
   - Check analytics

2. **Customize**
   - Update branding
   - Modify ration items
   - Adjust stock thresholds
   - Configure email settings

3. **Read Documentation**
   - [API Documentation](API_DOCUMENTATION.md)
   - [Feature Guide](PROJECT_FEATURES.md)
   - [Testing Guide](TESTING_GUIDE.md)
   - [Deployment Guide](DEPLOYMENT_GUIDE.md)

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Backend: nodemon watches for changes
- Frontend: React dev server auto-refreshes

### Debug Mode
Enable detailed logs:
```env
NODE_ENV=development
```

### API Testing
Use tools like:
- Postman
- Thunder Client (VS Code extension)
- Insomnia

### Database GUI
View MongoDB data:
- MongoDB Compass (recommended)
- Studio 3T
- Robo 3T

## Features to Try

### Admin Features
- [ ] Create new shop
- [ ] Add shopkeeper
- [ ] Create beneficiary
- [ ] Allocate stock
- [ ] View analytics
- [ ] Check fraud alerts

### Shopkeeper Features
- [ ] View beneficiaries
- [ ] Record distribution
- [ ] Check stock levels
- [ ] View distribution history

### Beneficiary Features
- [ ] View distributions
- [ ] Download receipts
- [ ] Check monthly status

## Performance Tips

### Speed Up Development
1. Use `npm run dev:full` for both servers
2. Keep MongoDB running
3. Use browser dev tools
4. Enable React DevTools extension

### Optimize Database
```javascript
// Already configured in models:
- Indexes on frequently queried fields
- Compound indexes for complex queries
- Unique constraints for data integrity
```

## Getting Help

### Check Logs
```bash
# Backend logs
npm run dev

# Frontend logs
cd client && npm start

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Debug Steps
1. Check if MongoDB is running
2. Verify .env configuration
3. Check console for errors
4. Review API responses in Network tab
5. Check backend terminal for errors

### Resources
- [Setup Guide](SETUP_GUIDE.md) - Detailed installation
- [API Docs](API_DOCUMENTATION.md) - API reference
- [Testing Guide](TESTING_GUIDE.md) - Testing procedures
- [GitHub Issues](your-repo-url/issues) - Report bugs

## Production Deployment

Ready to deploy? Check out:
- [Deployment Guide](DEPLOYMENT_GUIDE.md)

Quick deploy options:
- **Heroku** (Backend) + **Vercel** (Frontend) - Easiest
- **AWS EC2** - Full control
- **DigitalOcean** - Balanced
- **Docker** - Containerized

## Support

Need help?
1. Check documentation files
2. Review error messages
3. Search GitHub issues
4. Create new issue with details

## Congratulations! 🎉

You now have a fully functional Digital Ration Distribution System running locally!

**What's Next?**
- Explore all features
- Customize for your needs
- Add new features
- Deploy to production
- Present your project

Happy coding! 🚀
