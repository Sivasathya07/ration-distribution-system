# Troubleshooting Guide - Login Issues

## ✅ What We've Fixed:

1. ✅ Created `.env` file with MongoDB connection
2. ✅ Verified MongoDB is running
3. ✅ Seeded database with test users
4. ✅ Configured proxy in client

## 🚀 How to Start the Application:

### Option 1: Easy Way (Recommended)
Double-click `start-app.bat` file

### Option 2: Manual Way

**Terminal 1 (Backend):**
```powershell
cd "C:\Users\SIVASATHYA S\OneDrive\Desktop\fullstack"
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd "C:\Users\SIVASATHYA S\OneDrive\Desktop\fullstack\client"
npm start
```

### Option 3: Single Command
```powershell
cd "C:\Users\SIVASATHYA S\OneDrive\Desktop\fullstack"
npm run dev:full
```

---

## 🔍 Verify Backend is Running:

1. Open browser
2. Go to: http://localhost:5000/api/health
3. You should see: `{"status":"OK","message":"Server is running"}`

If you see this, backend is working! ✅

---

## 🔑 Login Credentials:

### Admin (Full Access)
```
Email: admin@ration.gov.in
Password: admin123
```

### Shopkeeper
```
Email: rajesh@shop1.com
Password: shop123
```

### Beneficiary
```
Email: amit@example.com
Password: user123
```

---

## ❌ If Login Still Fails:

### 1. Check Backend Console
Look for errors in the terminal running backend. Common issues:
- MongoDB connection error
- Port already in use
- Missing dependencies

### 2. Check Frontend Console
Press F12 in browser, go to Console tab. Look for:
- Network errors (red text)
- CORS errors
- 404 errors

### 3. Check Network Tab
Press F12 → Network tab → Try login → Look for:
- POST request to `/api/auth/login`
- Status code (should be 200 for success)
- Response data

### 4. Clear Everything and Restart

```powershell
# Stop all node processes
Get-Process -Name node | Stop-Process -Force

# Clear browser cache
# Press Ctrl+Shift+Delete in browser

# Restart backend
cd "C:\Users\SIVASATHYA S\OneDrive\Desktop\fullstack"
npm run dev

# In another terminal, restart frontend
cd "C:\Users\SIVASATHYA S\OneDrive\Desktop\fullstack\client"
npm start
```

---

## 🐛 Common Issues & Solutions:

### Issue 1: "Login failed" toast message
**Cause:** Backend not running or wrong credentials
**Solution:** 
1. Check backend is running at http://localhost:5000/api/health
2. Use exact credentials from above (copy-paste)
3. Check backend terminal for errors

### Issue 2: Network error / Cannot connect
**Cause:** Backend not started
**Solution:** Start backend first, then frontend

### Issue 3: CORS error
**Cause:** Backend CORS not configured
**Solution:** Already fixed in server.js, just restart backend

### Issue 4: "Invalid credentials"
**Cause:** Database not seeded or wrong password
**Solution:** 
```powershell
cd "C:\Users\SIVASATHYA S\OneDrive\Desktop\fullstack"
node server/seed.js
```

### Issue 5: MongoDB connection error
**Cause:** MongoDB service not running
**Solution:**
```powershell
# Check status
Get-Service -Name MongoDB

# Start if stopped
Start-Service -Name MongoDB
```

---

## 🔧 Debug Steps:

### Step 1: Test Backend Directly
```powershell
cd "C:\Users\SIVASATHYA S\OneDrive\Desktop\fullstack"
node test-login.js
```

This will test if backend login works. You should see:
```
✅ Backend is running
✅ Login successful!
```

### Step 2: Check MongoDB
```powershell
# Check if MongoDB is running
Get-Service -Name MongoDB

# Should show: Status = Running
```

### Step 3: Check .env File
```powershell
cat .env
```

Should contain:
```
MONGO_URI=mongodb://localhost:27017/ration_system
JWT_SECRET=ration_distribution_secret_key_2024_change_in_production
```

### Step 4: Verify Database Has Users
```powershell
# Connect to MongoDB
mongo

# Use database
use ration_system

# Check users
db.users.find().pretty()

# Should show admin, shopkeepers, and beneficiaries
```

---

## 📞 Still Not Working?

### Check These:

1. **Backend Terminal Output:**
   - Should say "Server running in development mode on port 5000"
   - Should say "MongoDB Connected: ..."
   - No error messages

2. **Frontend Terminal Output:**
   - Should say "Compiled successfully!"
   - Should say "webpack compiled with 0 errors"
   - Browser should open automatically

3. **Browser Console (F12):**
   - No red error messages
   - Network tab shows successful requests

4. **MongoDB:**
   - Service is running
   - Database "ration_system" exists
   - Users collection has data

---

## 🎯 Quick Test Checklist:

- [ ] MongoDB service is running
- [ ] .env file exists and has MONGO_URI
- [ ] Database is seeded (run seed.js)
- [ ] Backend is running (check http://localhost:5000/api/health)
- [ ] Frontend is running (check http://localhost:3000)
- [ ] Using correct credentials (admin@ration.gov.in / admin123)
- [ ] Browser cache is cleared
- [ ] No firewall blocking ports 3000 or 5000

---

## 💡 Pro Tips:

1. **Always start backend BEFORE frontend**
2. **Keep both terminals open and visible**
3. **Watch for error messages in terminals**
4. **Use browser DevTools (F12) to debug**
5. **Copy-paste credentials to avoid typos**

---

## 🆘 Emergency Reset:

If nothing works, do a complete reset:

```powershell
# 1. Stop all node processes
Get-Process -Name node | Stop-Process -Force

# 2. Clear database and reseed
cd "C:\Users\SIVASATHYA S\OneDrive\Desktop\fullstack"
node server/seed.js

# 3. Clear browser data
# Press Ctrl+Shift+Delete, clear everything

# 4. Restart everything
npm run dev:full
```

---

## ✅ Success Indicators:

When everything is working, you should see:

**Backend Terminal:**
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

**Frontend Terminal:**
```
Compiled successfully!
webpack compiled with 0 errors
```

**Browser:**
- Login page loads at http://localhost:3000/login
- No errors in console (F12)
- Login button works
- Redirects to dashboard after login

---

**Current Status:**
- ✅ .env configured
- ✅ MongoDB running
- ✅ Database seeded
- ⏳ Need to start servers

**Next Step:** Run `start-app.bat` or `npm run dev:full`
