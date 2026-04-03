# Quick Start Instructions

## ✅ Setup Complete! Now follow these steps:

### Step 1: Start Backend Server

Open a **NEW PowerShell terminal** and run:

```powershell
cd "C:\Users\SIVASATHYA S\OneDrive\Desktop\fullstack"
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: ...
```

### Step 2: Start Frontend (in a SEPARATE terminal)

Open **ANOTHER PowerShell terminal** and run:

```powershell
cd "C:\Users\SIVASATHYA S\OneDrive\Desktop\fullstack\client"
npm start
```

Browser will open automatically at http://localhost:3000

### Step 3: Login

Use these credentials:

**Admin Account:**
- Email: `admin@ration.gov.in`
- Password: `admin123`

**Shopkeeper Account:**
- Email: `rajesh@shop1.com`
- Password: `shop123`

**Beneficiary Account:**
- Email: `amit@example.com`
- Password: `user123`

---

## ⚠️ Important Notes:

1. **Keep BOTH terminals running** (backend and frontend)
2. Backend must start BEFORE frontend
3. MongoDB service must be running (it is ✅)
4. .env file is now configured ✅
5. Database is seeded with test data ✅

---

## 🔧 If Login Still Fails:

### Check Backend is Running:
Open browser and go to: http://localhost:5000/api/health

You should see: `{"status":"OK","message":"Server is running"}`

### Check Frontend Proxy:
The frontend is configured to proxy API requests to backend automatically.

### Clear Browser Cache:
- Press `Ctrl + Shift + Delete`
- Clear cached images and files
- Reload the page

---

## 📝 Current Status:

✅ MongoDB is running
✅ .env file created
✅ Database seeded with users
✅ Dependencies installed

❌ Backend server needs to be started
❌ Frontend needs to be started

---

## 🚀 Next Steps:

1. Close any existing node processes
2. Start backend in Terminal 1
3. Start frontend in Terminal 2
4. Login with credentials above
5. Explore the application!

---

## 💡 Pro Tip:

Instead of running two terminals, you can use:

```powershell
npm run dev:full
```

This starts both backend and frontend together!
