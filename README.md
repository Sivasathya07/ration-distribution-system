# Digital Ration Distribution Monitoring System

A comprehensive full-stack MERN application for managing and monitoring ration distribution with role-based access control, real-time analytics, and fraud detection.

## 🚀 Features

### Core Features
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Three User Roles**: Admin, Shopkeeper, and Beneficiary with distinct dashboards
- **Stock Management**: Allocate and track stock across multiple ration shops
- **Distribution Tracking**: Record and monitor ration distributions with auto stock deduction
- **Digital Receipts**: Generate PDF receipts with QR codes for verification
- **Analytics Dashboard**: Real-time charts and graphs for distribution trends
- **Fraud Detection**: Automatic detection of duplicate distributions
- **Low Stock Alerts**: Email notifications for low inventory
- **Dark/Light Mode**: Modern UI with theme switching
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### Admin Features
- Add and manage ration shops
- Create and manage beneficiaries
- Allocate monthly stock to shops
- View distribution trends and analytics
- Monitor shop performance
- Detect fraudulent activities
- Manage shopkeepers

### Shopkeeper Features
- View assigned beneficiaries
- Record ration distributions
- Check current stock levels
- View distribution history
- Receive low stock alerts

### Beneficiary Features
- View distribution history
- Check monthly ration status
- Download digital receipts with QR codes
- Track total distributions

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js**: Server framework
- **MongoDB**: Database with Mongoose ODM
- **JWT**: Authentication and authorization
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **nodemailer**: Email notifications
- **qrcode**: QR code generation

### Frontend
- **React.js**: UI library
- **Tailwind CSS**: Styling framework
- **React Router**: Navigation
- **Axios**: HTTP client
- **Chart.js**: Data visualization
- **jsPDF**: PDF generation
- **react-hot-toast**: Notifications
- **lucide-react**: Icons

## 📁 Project Structure

```
ration-distribution-system/
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── shopController.js
│   │   ├── stockController.js
│   │   ├── distributionController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Shop.js
│   │   ├── Stock.js
│   │   └── Distribution.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── shopRoutes.js
│   │   ├── stockRoutes.js
│   │   ├── distributionRoutes.js
│   │   └── analyticsRoutes.js
│   ├── utils/
│   │   ├── emailService.js
│   │   ├── qrGenerator.js
│   │   └── receiptGenerator.js
│   └── server.js
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── DistributionModal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── admin/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── shopkeeper/
│   │   │   │   └── Dashboard.jsx
│   │   │   └── beneficiary/
│   │   │       └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd ration-distribution-system
```

### 2. Install dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ration_system
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 4. Run the application

#### Development Mode (Both servers)
```bash
npm run dev:full
```

#### Separate servers
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### 5. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 👥 Default User Roles

### Admin
- Email: admin@example.com
- Password: admin123
- Can manage shops, beneficiaries, and view analytics

### Shopkeeper
- Register through admin or create account
- Manages distributions for assigned shop

### Beneficiary
- Register at /register
- Can view distributions and download receipts

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/beneficiaries` - Get beneficiaries
- `PUT /api/users/:id/assign-shop` - Assign shop to beneficiary

### Shops
- `POST /api/shops` - Create shop (Admin)
- `GET /api/shops` - Get all shops
- `GET /api/shops/my-shop` - Get shopkeeper's shop
- `PUT /api/shops/:id` - Update shop (Admin)

### Stock
- `POST /api/stock/allocate` - Allocate stock (Admin)
- `GET /api/stock/shop/:shopId` - Get shop stock
- `GET /api/stock/low-stock` - Check low stock

### Distribution
- `POST /api/distribution` - Record distribution (Shopkeeper)
- `GET /api/distribution` - Get distributions
- `GET /api/distribution/my-distributions` - Get beneficiary distributions
- `GET /api/distribution/:id/receipt` - Download receipt

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/trends` - Get distribution trends
- `GET /api/analytics/fraud-detection` - Detect fraud

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- MongoDB injection prevention
- CORS configuration
- Error handling middleware

## 🎨 UI Features

- Government-themed professional design
- Dark/Light mode toggle
- Responsive layout for all devices
- Interactive charts and graphs
- Toast notifications
- Loading states
- Form validation

## 📱 Screenshots

(Add screenshots of your application here)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Final Year Project - Digital Ration Distribution Monitoring System

## 🙏 Acknowledgments

- Government of India for inspiration
- MERN Stack community
- Open source contributors
