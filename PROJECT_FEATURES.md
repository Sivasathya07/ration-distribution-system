# Project Features Documentation

## 1. Authentication & Authorization

### JWT-Based Authentication
- Secure token-based authentication
- Token expiration: 30 days (configurable)
- Password hashing using bcryptjs (10 salt rounds)
- Automatic token validation on protected routes

### Role-Based Access Control (RBAC)
Three distinct user roles with specific permissions:

#### Admin Role
- Full system access
- User management (create, read, update, delete)
- Shop management
- Stock allocation
- View all analytics
- Fraud detection monitoring
- System-wide reports

#### Shopkeeper Role
- Manage assigned shop
- View assigned beneficiaries
- Record distributions
- Update stock levels
- View shop-specific analytics
- Receive low stock alerts

#### Beneficiary Role
- View personal distribution history
- Check monthly ration status
- Download digital receipts
- View assigned shop details

## 2. Stock Management System

### Stock Allocation
- Admin allocates monthly stock to shops
- Five standard items:
  - Rice (kg)
  - Wheat (kg)
  - Sugar (kg)
  - Kerosene (litre)
  - Cooking Oil (litre)
- Month and year tracking
- Automatic stock updates

### Auto Stock Deduction
- Real-time stock reduction on distribution
- Validation before distribution
- Prevents over-distribution
- Transaction-like consistency

### Low Stock Alert System
- Threshold: 50 kg/litre
- Automatic email notifications
- Dashboard warnings
- Color-coded indicators (red for low, green for sufficient)

## 3. Distribution Management

### Distribution Recording
- Shopkeeper records distributions
- Item-wise quantity tracking
- Automatic price calculation
- Receipt generation
- QR code creation

### Duplicate Prevention
- One distribution per beneficiary per month
- Pre-distribution validation
- Database-level unique constraints
- Fraud prevention mechanism

### Digital Receipt System
- Unique receipt number generation
- PDF download capability
- QR code for verification
- Contains:
  - Receipt number
  - Beneficiary details
  - Shop information
  - Item-wise breakdown
  - Total amount
  - Date and time
  - Government branding

## 4. Fraud Detection

### Duplicate Distribution Detection
- Identifies multiple distributions to same beneficiary
- Monthly monitoring
- Admin dashboard alerts
- Detailed fraud reports with:
  - Beneficiary information
  - Number of duplicate distributions
  - Distribution details
  - Timestamps

### Prevention Mechanisms
- Database constraints
- Pre-distribution checks
- Real-time validation
- Audit trail

## 5. Analytics & Reporting

### Dashboard Statistics

#### Admin Dashboard
- Total shops count
- Total beneficiaries count
- Total shopkeepers count
- Monthly distributions count
- Distribution trends (line chart)
- Shop performance (bar chart)
- Fraud alerts
- Low stock alerts

#### Shopkeeper Dashboard
- Assigned beneficiaries count
- Monthly distributions count
- Current stock levels
- Item-wise stock display
- Low stock warnings
- Distribution history

#### Beneficiary Dashboard
- Total distributions received
- Current month status
- Distribution history
- Receipt access
- QR codes

### Charts & Visualizations
Using Chart.js:
- Line charts for distribution trends
- Bar charts for shop performance
- Doughnut charts for stock distribution
- Color-coded indicators
- Interactive tooltips
- Responsive design

## 6. Email Notification System

### Distribution Receipt Email
Sent automatically when distribution is recorded:
- Beneficiary name
- Receipt number
- Items distributed
- Total amount
- Professional HTML template
- Government branding

### Low Stock Alert Email
Sent when stock falls below threshold:
- Shop name
- Low stock items
- Current quantities
- Alert priority
- Action required message

### Email Configuration
- SMTP support (Gmail, custom)
- Development mode simulation
- Production email delivery
- Error handling
- Retry mechanism

## 7. QR Code System

### QR Code Generation
- Unique QR code per distribution
- Contains:
  - Receipt number
  - Beneficiary name
  - Ration card number
  - Shop name
  - Distribution date
- Base64 encoded
- Embedded in receipts
- Verification ready

### Use Cases
- Receipt verification
- Fraud prevention
- Mobile scanning
- Quick lookup
- Audit trail

## 8. User Interface Features

### Dark/Light Mode
- System-wide theme toggle
- Persistent preference (localStorage)
- Smooth transitions
- All components themed
- Accessibility compliant

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop layouts
- Flexible grids
- Touch-friendly controls

### Government Theme
- Indian flag colors:
  - Orange (#FF9933)
  - White (#FFFFFF)
  - Green (#138808)
  - Navy Blue (#000080)
- Professional design
- Official appearance
- Trust-building elements

### UI Components
- Toast notifications (react-hot-toast)
- Loading states
- Error boundaries
- Form validation
- Modal dialogs
- Data tables
- Interactive charts
- Icon system (lucide-react)

## 9. Security Features

### Password Security
- Bcrypt hashing
- Salt rounds: 10
- No plain text storage
- Secure comparison

### Input Validation
- express-validator middleware
- Client-side validation
- Server-side validation
- Sanitization
- XSS prevention

### API Security
- JWT token verification
- Role-based middleware
- CORS configuration
- Rate limiting ready
- Error handling
- MongoDB injection prevention

### Data Protection
- Sensitive data exclusion
- Selective field returns
- Secure password fields
- Token expiration
- Session management

## 10. Database Architecture

### Models & Relationships

#### User Model
- Authentication fields
- Role field
- Profile information
- Shop reference (for shopkeeper/beneficiary)
- Timestamps

#### Shop Model
- Shop details
- Owner reference (User)
- Location information
- License details
- Beneficiary count
- Status tracking

#### Stock Model
- Shop reference
- Items array
- Month/year tracking
- Allocated by reference
- Compound indexes

#### Distribution Model
- Beneficiary reference
- Shop reference
- Items array
- Receipt details
- QR code
- Timestamps
- Unique constraints

### Indexes
- Compound indexes for performance
- Unique constraints for data integrity
- Text indexes for search
- Optimized queries

## 11. PDF Generation

### Receipt PDF Features
- Professional layout
- Government header
- Color-coded sections
- Item-wise breakdown
- Total calculation
- QR code embedding
- Footer with disclaimer
- Download functionality

### Technologies
- jsPDF library
- html2canvas for rendering
- Custom styling
- Print-ready format

## 12. Search & Filter

### User Search
- Name search
- Email search
- Ration card search
- Role filtering
- Status filtering

### Shop Search
- Name search
- Shop number search
- District filtering
- State filtering

### Distribution Filters
- Month filtering
- Year filtering
- Shop filtering
- Status filtering

## 13. Error Handling

### Backend Error Handling
- Centralized error middleware
- Custom error classes
- Mongoose error handling
- Validation error formatting
- Duplicate key handling
- Cast error handling

### Frontend Error Handling
- Try-catch blocks
- Error boundaries
- User-friendly messages
- Toast notifications
- Fallback UI
- Loading states

## 14. Performance Optimizations

### Backend
- Database indexing
- Query optimization
- Pagination ready
- Caching ready
- Connection pooling

### Frontend
- Code splitting ready
- Lazy loading ready
- Optimized re-renders
- Memoization ready
- Asset optimization

## 15. Scalability Features

### Architecture
- Modular structure
- Separation of concerns
- RESTful API design
- Stateless authentication
- Horizontal scaling ready

### Future Enhancements Ready
- Redis caching
- Message queues
- Microservices migration
- Load balancing
- CDN integration
- Real-time updates (Socket.io)
- Mobile app API
- Advanced analytics
- Biometric authentication
- Blockchain integration

## 16. Testing Ready

### Backend Testing
- Unit tests ready
- Integration tests ready
- API endpoint testing
- Authentication testing
- Authorization testing

### Frontend Testing
- Component testing ready
- Integration testing ready
- E2E testing ready
- Accessibility testing ready

## 17. Documentation

### Code Documentation
- Inline comments
- Function descriptions
- API documentation
- Setup guide
- README
- Feature documentation

### API Documentation
- Endpoint descriptions
- Request/response examples
- Authentication details
- Error codes
- Rate limiting info

## 18. Deployment Ready

### Environment Configuration
- Environment variables
- Development/production modes
- Configuration management
- Secrets management

### Production Considerations
- MongoDB Atlas ready
- Cloud deployment ready
- SSL/HTTPS ready
- Domain configuration ready
- Monitoring ready
- Logging ready
- Backup strategy ready

This is a comprehensive, production-ready system suitable for a final year project with real-world applicability.
