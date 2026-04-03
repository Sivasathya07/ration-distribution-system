# Project Structure

```
ration-distribution-system/
│
├── server/                                 # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js                          # MongoDB connection configuration
│   │
│   ├── controllers/                       # Business logic controllers
│   │   ├── authController.js              # Authentication (login, register)
│   │   ├── userController.js              # User management
│   │   ├── shopController.js              # Shop management
│   │   ├── stockController.js             # Stock allocation & management
│   │   ├── distributionController.js      # Distribution recording
│   │   └── analyticsController.js         # Dashboard analytics & reports
│   │
│   ├── middleware/                        # Express middleware
│   │   ├── auth.js                        # JWT authentication & authorization
│   │   ├── errorHandler.js                # Centralized error handling
│   │   └── validation.js                  # Input validation rules
│   │
│   ├── models/                            # Mongoose schemas
│   │   ├── User.js                        # User model (Admin, Shopkeeper, Beneficiary)
│   │   ├── Shop.js                        # Ration shop model
│   │   ├── Stock.js                       # Stock allocation model
│   │   └── Distribution.js                # Distribution records model
│   │
│   ├── routes/                            # API route definitions
│   │   ├── authRoutes.js                  # /api/auth/* routes
│   │   ├── userRoutes.js                  # /api/users/* routes
│   │   ├── shopRoutes.js                  # /api/shops/* routes
│   │   ├── stockRoutes.js                 # /api/stock/* routes
│   │   ├── distributionRoutes.js          # /api/distribution/* routes
│   │   └── analyticsRoutes.js             # /api/analytics/* routes
│   │
│   ├── utils/                             # Utility functions
│   │   ├── emailService.js                # Email notification service
│   │   ├── qrGenerator.js                 # QR code generation
│   │   └── receiptGenerator.js            # Receipt number & data generation
│   │
│   ├── server.js                          # Express app entry point
│   └── seed.js                            # Database seeding script
│
├── client/                                # Frontend (React.js)
│   ├── public/
│   │   └── index.html                     # HTML template
│   │
│   ├── src/
│   │   ├── components/                    # Reusable React components
│   │   │   ├── Layout.jsx                 # Main layout wrapper
│   │   │   └── DistributionModal.jsx      # Distribution recording modal
│   │   │
│   │   ├── context/                       # React Context providers
│   │   │   ├── AuthContext.jsx            # Authentication state management
│   │   │   └── ThemeContext.jsx           # Dark/Light theme management
│   │   │
│   │   ├── pages/                         # Page components
│   │   │   ├── Login.jsx                  # Login page
│   │   │   ├── Register.jsx               # Registration page
│   │   │   │
│   │   │   ├── admin/                     # Admin pages
│   │   │   │   └── Dashboard.jsx          # Admin dashboard with analytics
│   │   │   │
│   │   │   ├── shopkeeper/                # Shopkeeper pages
│   │   │   │   └── Dashboard.jsx          # Shopkeeper dashboard
│   │   │   │
│   │   │   └── beneficiary/               # Beneficiary pages
│   │   │       └── Dashboard.jsx          # Beneficiary dashboard
│   │   │
│   │   ├── App.jsx                        # Main App component with routing
│   │   ├── index.js                       # React entry point
│   │   └── index.css                      # Global styles with Tailwind
│   │
│   ├── package.json                       # Frontend dependencies
│   ├── tailwind.config.js                 # Tailwind CSS configuration
│   └── postcss.config.js                  # PostCSS configuration
│
├── .env.example                           # Environment variables template
├── .gitignore                             # Git ignore rules
├── package.json                           # Root package.json with scripts
│
├── README.md                              # Project overview & quick start
├── SETUP_GUIDE.md                         # Detailed setup instructions
├── API_DOCUMENTATION.md                   # Complete API reference
├── PROJECT_FEATURES.md                    # Feature documentation
├── TESTING_GUIDE.md                       # Testing procedures
├── DEPLOYMENT_GUIDE.md                    # Production deployment guide
└── PROJECT_STRUCTURE.md                   # This file
```

## File Descriptions

### Backend Files

#### Configuration
- **db.js**: MongoDB connection setup with error handling

#### Controllers (Business Logic)
- **authController.js**: User registration, login, JWT token generation
- **userController.js**: CRUD operations for users, beneficiary management
- **shopController.js**: Shop creation, management, assignment
- **stockController.js**: Stock allocation, updates, low stock detection
- **distributionController.js**: Record distributions, generate receipts, QR codes
- **analyticsController.js**: Dashboard statistics, trends, fraud detection

#### Middleware
- **auth.js**: JWT verification, role-based access control
- **errorHandler.js**: Centralized error handling and formatting
- **validation.js**: Input validation using express-validator

#### Models (Database Schemas)
- **User.js**: User schema with roles (admin, shopkeeper, beneficiary)
- **Shop.js**: Ration shop details and owner reference
- **Stock.js**: Monthly stock allocation per shop
- **Distribution.js**: Distribution records with fraud prevention

#### Routes (API Endpoints)
- **authRoutes.js**: Authentication endpoints
- **userRoutes.js**: User management endpoints
- **shopRoutes.js**: Shop management endpoints
- **stockRoutes.js**: Stock management endpoints
- **distributionRoutes.js**: Distribution recording endpoints
- **analyticsRoutes.js**: Analytics and reporting endpoints

#### Utilities
- **emailService.js**: Email notifications (distribution receipts, alerts)
- **qrGenerator.js**: QR code generation for receipts
- **receiptGenerator.js**: Receipt number and data formatting

#### Entry Points
- **server.js**: Express server setup, middleware, routes
- **seed.js**: Database seeding with sample data

### Frontend Files

#### Components
- **Layout.jsx**: Header, footer, navigation wrapper
- **DistributionModal.jsx**: Modal for recording distributions

#### Context (State Management)
- **AuthContext.jsx**: Global authentication state
- **ThemeContext.jsx**: Dark/light theme state

#### Pages
- **Login.jsx**: User login interface
- **Register.jsx**: Beneficiary registration
- **admin/Dashboard.jsx**: Admin analytics dashboard
- **shopkeeper/Dashboard.jsx**: Shopkeeper operations dashboard
- **beneficiary/Dashboard.jsx**: Beneficiary distribution history

#### Configuration
- **App.jsx**: React Router setup, protected routes
- **index.js**: React DOM rendering
- **index.css**: Tailwind CSS imports and custom styles
- **tailwind.config.js**: Tailwind theme customization
- **postcss.config.js**: PostCSS plugins configuration

### Documentation Files

- **README.md**: Project overview, features, quick start
- **SETUP_GUIDE.md**: Step-by-step installation guide
- **API_DOCUMENTATION.md**: Complete API endpoint reference
- **PROJECT_FEATURES.md**: Detailed feature descriptions
- **TESTING_GUIDE.md**: Testing procedures and checklists
- **DEPLOYMENT_GUIDE.md**: Production deployment instructions
- **PROJECT_STRUCTURE.md**: This file - project organization

### Configuration Files

- **.env.example**: Environment variables template
- **.gitignore**: Files to exclude from version control
- **package.json**: Project metadata and scripts

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Email**: nodemailer
- **QR Codes**: qrcode
- **Security**: bcryptjs, cors

### Frontend
- **Library**: React.js 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Charts**: Chart.js with react-chartjs-2
- **PDF**: jsPDF with html2canvas
- **Notifications**: react-hot-toast
- **Icons**: lucide-react

### Development Tools
- **Process Manager**: nodemon, concurrently
- **Version Control**: Git
- **Package Manager**: npm

## Key Features by Module

### Authentication Module
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Token expiration handling

### User Management Module
- Three user roles (Admin, Shopkeeper, Beneficiary)
- User CRUD operations
- Shop assignment
- Profile management

### Shop Management Module
- Shop registration
- Owner assignment
- Location tracking
- License management

### Stock Management Module
- Monthly stock allocation
- Auto stock deduction
- Low stock alerts
- Stock history tracking

### Distribution Module
- Distribution recording
- Duplicate prevention
- Receipt generation
- QR code creation
- Email notifications

### Analytics Module
- Dashboard statistics
- Distribution trends
- Shop performance
- Fraud detection
- Low stock monitoring

### UI/UX Module
- Dark/light theme
- Responsive design
- Government theme
- Interactive charts
- Toast notifications

## Data Flow

### Distribution Flow
```
1. Admin allocates stock to shop
2. Shopkeeper views available stock
3. Shopkeeper selects beneficiary
4. Shopkeeper enters distribution items
5. System validates stock availability
6. System checks for duplicate distribution
7. Distribution is recorded
8. Stock is automatically deducted
9. Receipt is generated with QR code
10. Email notification is sent
11. Beneficiary can view and download receipt
```

### Authentication Flow
```
1. User submits credentials
2. Server validates credentials
3. Server generates JWT token
4. Token is sent to client
5. Client stores token
6. Client includes token in subsequent requests
7. Server validates token on protected routes
8. Server checks user role for authorization
```

### Stock Management Flow
```
1. Admin allocates monthly stock
2. Stock is stored in database
3. Shopkeeper views current stock
4. Distribution reduces stock
5. System checks stock levels
6. Low stock alert is triggered if needed
7. Email notification is sent
8. Admin can view stock reports
```

## Security Measures

1. **Password Security**: bcrypt hashing with salt rounds
2. **Authentication**: JWT tokens with expiration
3. **Authorization**: Role-based middleware
4. **Input Validation**: express-validator on all inputs
5. **Error Handling**: No sensitive data in error messages
6. **CORS**: Configured for specific origins
7. **MongoDB**: Injection prevention through Mongoose
8. **Rate Limiting**: Ready for implementation

## Scalability Considerations

1. **Stateless Authentication**: JWT allows horizontal scaling
2. **Database Indexing**: Optimized queries
3. **Modular Architecture**: Easy to add features
4. **API Design**: RESTful principles
5. **Caching Ready**: Redis integration possible
6. **Load Balancing Ready**: Stateless design
7. **Microservices Ready**: Modular structure

## Future Enhancements

1. Real-time notifications (Socket.io)
2. Mobile app (React Native)
3. Biometric authentication
4. Blockchain for transparency
5. Advanced analytics (ML)
6. Multi-language support
7. SMS notifications
8. Offline mode
9. Advanced reporting
10. Integration with government databases

This structure provides a solid foundation for a production-ready application suitable for a final year project.
