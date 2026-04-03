# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "beneficiary",
  "phone": "9876543210",
  "address": "123 Main St",
  "rationCardNumber": "RC-001",
  "familyMembers": 4
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "beneficiary"
  }
}
```

### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
```
**Headers:** Authorization required

---

## User Management Endpoints

### Get All Users (Admin)
```http
GET /users?role=beneficiary&search=john
```
**Headers:** Authorization required (Admin only)

### Get Single User
```http
GET /users/:id
```

### Update User (Admin)
```http
PUT /users/:id
```

**Body:**
```json
{
  "name": "Updated Name",
  "isActive": true
}
```

### Get Beneficiaries
```http
GET /users/beneficiaries
```
**Headers:** Authorization required (Admin/Shopkeeper)

### Assign Shop to Beneficiary (Admin)
```http
PUT /users/:id/assign-shop
```

**Body:**
```json
{
  "shopId": "shop_id_here"
}
```

---

## Shop Management Endpoints

### Create Shop (Admin)
```http
POST /shops
```

**Body:**
```json
{
  "name": "Central Ration Shop",
  "shopNumber": "SH001",
  "ownerId": "shopkeeper_user_id",
  "address": "123 Market St",
  "district": "Central",
  "state": "Delhi",
  "pincode": "110001",
  "phone": "9876543210",
  "licenseNumber": "LIC-001"
}
```

### Get All Shops
```http
GET /shops?search=central&district=Central&state=Delhi
```

### Get Single Shop
```http
GET /shops/:id
```

### Get My Shop (Shopkeeper)
```http
GET /shops/my-shop
```
**Headers:** Authorization required (Shopkeeper)

### Update Shop (Admin)
```http
PUT /shops/:id
```

### Delete Shop (Admin)
```http
DELETE /shops/:id
```

---

## Stock Management Endpoints

### Allocate Stock (Admin)
```http
POST /stock/allocate
```

**Body:**
```json
{
  "shopId": "shop_id_here",
  "items": [
    {
      "name": "Rice",
      "quantity": 500,
      "unit": "kg"
    },
    {
      "name": "Wheat",
      "quantity": 400,
      "unit": "kg"
    }
  ],
  "month": "January",
  "year": 2024
}
```

### Get Shop Stock
```http
GET /stock/shop/:shopId?month=January&year=2024
```

### Update Stock
```http
PUT /stock/:id
```

**Body:**
```json
{
  "items": [
    {
      "name": "Rice",
      "quantity": 450,
      "unit": "kg"
    }
  ]
}
```

### Get All Stocks (Admin)
```http
GET /stock/all?month=January&year=2024
```

### Check Low Stock
```http
GET /stock/low-stock
```

---

## Distribution Endpoints

### Create Distribution (Shopkeeper)
```http
POST /distribution
```

**Body:**
```json
{
  "beneficiaryId": "beneficiary_id_here",
  "items": [
    {
      "name": "Rice",
      "quantity": 10,
      "unit": "kg",
      "price": 200
    },
    {
      "name": "Wheat",
      "quantity": 5,
      "unit": "kg",
      "price": 125
    }
  ],
  "month": "January",
  "year": 2024
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "distribution_id",
    "beneficiary": "beneficiary_id",
    "shop": "shop_id",
    "items": [...],
    "totalAmount": 325,
    "receiptNumber": "RCP1234567890123",
    "qrCode": "data:image/png;base64,...",
    "month": "January",
    "year": 2024
  }
}
```

### Get Distributions
```http
GET /distribution?month=January&year=2024&shopId=shop_id
```
**Headers:** Authorization required (Admin/Shopkeeper)

### Get Single Distribution
```http
GET /distribution/:id
```

### Get My Distributions (Beneficiary)
```http
GET /distribution/my-distributions
```
**Headers:** Authorization required (Beneficiary)

### Download Receipt
```http
GET /distribution/:id/receipt
```

**Response:**
```json
{
  "success": true,
  "data": {
    "receiptNumber": "RCP1234567890123",
    "beneficiaryName": "John Doe",
    "rationCardNumber": "RC-001",
    "shopName": "Central Ration Shop",
    "shopNumber": "SH001",
    "items": [...],
    "totalAmount": 325,
    "date": "2024-01-15T10:30:00.000Z",
    "month": "January",
    "year": 2024
  }
}
```

### Check Duplicate Distribution
```http
GET /distribution/check-duplicate/:beneficiaryId/:month/:year
```

**Response:**
```json
{
  "success": true,
  "isDuplicate": false,
  "distribution": null
}
```

---

## Analytics Endpoints

### Get Dashboard Statistics
```http
GET /analytics/dashboard
```
**Headers:** Authorization required

**Response (Admin):**
```json
{
  "success": true,
  "data": {
    "totalShops": 10,
    "totalBeneficiaries": 500,
    "totalShopkeepers": 10,
    "monthlyDistributions": 450
  }
}
```

**Response (Shopkeeper):**
```json
{
  "success": true,
  "data": {
    "shopBeneficiaries": 50,
    "monthlyDistributions": 45,
    "currentStock": [...]
  }
}
```

**Response (Beneficiary):**
```json
{
  "success": true,
  "data": {
    "totalDistributions": 12,
    "currentMonthReceived": true,
    "lastDistribution": {...}
  }
}
```

### Get Distribution Trends (Admin)
```http
GET /analytics/trends?year=2024
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "January",
      "count": 450,
      "totalAmount": 135000
    },
    {
      "_id": "February",
      "count": 480,
      "totalAmount": 144000
    }
  ]
}
```

### Get Shop Performance (Admin)
```http
GET /analytics/shop-performance
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "shopName": "Central Ration Shop",
      "shopNumber": "SH001",
      "totalDistributions": 450,
      "totalAmount": 135000
    }
  ]
}
```

### Fraud Detection (Admin)
```http
GET /analytics/fraud-detection
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "beneficiary_id",
      "count": 2,
      "distributions": [...],
      "beneficiaryDetails": {
        "name": "John Doe",
        "rationCardNumber": "RC-001"
      }
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role admin is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Rate Limiting
- 100 requests per 15 minutes per IP (recommended for production)

## Notes
- All dates are in ISO 8601 format
- Amounts are in Indian Rupees (₹)
- Stock quantities are in kg or litres
- QR codes are returned as base64 data URLs
- Email notifications are sent automatically for distributions and low stock alerts
