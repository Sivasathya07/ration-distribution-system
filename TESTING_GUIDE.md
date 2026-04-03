# Testing Guide

## Manual Testing Checklist

### 1. Authentication Testing

#### Registration
- [ ] Register as beneficiary with valid data
- [ ] Try registering with existing email (should fail)
- [ ] Try registering with invalid email format (should fail)
- [ ] Try registering with password < 6 characters (should fail)
- [ ] Verify token is returned
- [ ] Verify user is logged in after registration

#### Login
- [ ] Login with valid credentials
- [ ] Try login with wrong password (should fail)
- [ ] Try login with non-existent email (should fail)
- [ ] Verify token is returned
- [ ] Verify redirect to appropriate dashboard

#### Authorization
- [ ] Access admin routes as beneficiary (should fail)
- [ ] Access shopkeeper routes as beneficiary (should fail)
- [ ] Access protected routes without token (should fail)
- [ ] Verify role-based dashboard access

---

### 2. Admin Functionality Testing

#### User Management
- [ ] View all users
- [ ] Search users by name/email
- [ ] Filter users by role
- [ ] Update user details
- [ ] Deactivate user account
- [ ] View user profile

#### Shop Management
- [ ] Create new shop with valid data
- [ ] Try creating shop with duplicate shop number (should fail)
- [ ] Assign shopkeeper to shop
- [ ] Try assigning shopkeeper who already has shop (should fail)
- [ ] Update shop details
- [ ] View all shops
- [ ] Search shops
- [ ] Filter shops by district/state

#### Beneficiary Management
- [ ] View all beneficiaries
- [ ] Assign beneficiary to shop
- [ ] Update beneficiary details
- [ ] View beneficiary distribution history

#### Stock Allocation
- [ ] Allocate stock to shop for current month
- [ ] Try allocating stock with invalid quantities (should fail)
- [ ] Update existing stock allocation
- [ ] View all stock allocations
- [ ] Filter stock by month/year
- [ ] Verify stock appears in shopkeeper dashboard

#### Analytics
- [ ] View dashboard statistics
- [ ] Verify total counts (shops, beneficiaries, shopkeepers)
- [ ] View distribution trends chart
- [ ] View shop performance chart
- [ ] Check fraud detection alerts
- [ ] Check low stock alerts

---

### 3. Shopkeeper Functionality Testing

#### Dashboard
- [ ] View assigned beneficiaries count
- [ ] View monthly distributions count
- [ ] View current stock levels
- [ ] Verify low stock warnings appear

#### Distribution Recording
- [ ] Select beneficiary
- [ ] Enter item quantities
- [ ] Verify price calculation
- [ ] Submit distribution
- [ ] Verify stock is deducted
- [ ] Try distributing to same beneficiary twice in same month (should fail)
- [ ] Try distributing more than available stock (should fail)
- [ ] Verify receipt is generated
- [ ] Verify QR code is created
- [ ] Check if email notification is sent

#### Stock Management
- [ ] View current stock
- [ ] Verify stock updates after distribution
- [ ] Check low stock alerts
- [ ] View stock history

#### Beneficiary List
- [ ] View all assigned beneficiaries
- [ ] Search beneficiaries
- [ ] View beneficiary details
- [ ] Check distribution status

---

### 4. Beneficiary Functionality Testing

#### Dashboard
- [ ] View total distributions count
- [ ] Check current month status
- [ ] View distribution history
- [ ] Verify statistics are accurate

#### Distribution History
- [ ] View all past distributions
- [ ] Verify item details
- [ ] Check total amounts
- [ ] View QR codes

#### Receipt Download
- [ ] Download receipt as PDF
- [ ] Verify PDF contains all details
- [ ] Verify QR code in PDF
- [ ] Check PDF formatting
- [ ] Verify government branding

---

### 5. Fraud Detection Testing

#### Duplicate Distribution
- [ ] Record distribution for beneficiary
- [ ] Try recording another distribution same month (should fail)
- [ ] Verify fraud alert appears in admin dashboard
- [ ] Check duplicate detection API

#### Validation
- [ ] Verify beneficiary validation
- [ ] Check stock availability validation
- [ ] Test month/year validation

---

### 6. Email Notification Testing

#### Distribution Receipt Email
- [ ] Record distribution
- [ ] Check if email is sent to beneficiary
- [ ] Verify email content
- [ ] Check HTML formatting
- [ ] Verify all details are included

#### Low Stock Alert Email
- [ ] Reduce stock below threshold (50)
- [ ] Check if email is sent to shopkeeper
- [ ] Verify low stock items listed
- [ ] Check email formatting

---

### 7. UI/UX Testing

#### Theme Toggle
- [ ] Switch to dark mode
- [ ] Verify all components are themed
- [ ] Switch back to light mode
- [ ] Verify theme persists on refresh

#### Responsive Design
- [ ] Test on mobile (320px - 480px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (1280px+)
- [ ] Verify all features work on mobile
- [ ] Check touch interactions

#### Navigation
- [ ] Test all navigation links
- [ ] Verify logout functionality
- [ ] Check redirect after login
- [ ] Test browser back button

#### Forms
- [ ] Test all form validations
- [ ] Check error messages
- [ ] Verify success messages
- [ ] Test form reset
- [ ] Check loading states

---

### 8. API Testing with Postman/Thunder Client

#### Setup
```
Base URL: http://localhost:5000/api
```

#### Test Authentication
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "phone": "9876543210",
  "address": "Test Address",
  "rationCardNumber": "RC-TEST-001",
  "familyMembers": 4
}
```

#### Test Protected Routes
```http
GET /auth/me
Authorization: Bearer <your_token>
```

#### Test Stock Allocation
```http
POST /stock/allocate
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "shopId": "shop_id_here",
  "items": [
    {
      "name": "Rice",
      "quantity": 500,
      "unit": "kg"
    }
  ],
  "month": "January",
  "year": 2024
}
```

#### Test Distribution
```http
POST /distribution
Authorization: Bearer <shopkeeper_token>
Content-Type: application/json

{
  "beneficiaryId": "beneficiary_id",
  "items": [
    {
      "name": "Rice",
      "quantity": 10,
      "unit": "kg",
      "price": 200
    }
  ],
  "month": "January",
  "year": 2024
}
```

---

### 9. Performance Testing

#### Load Testing
- [ ] Test with 100 concurrent users
- [ ] Test with 1000 distributions
- [ ] Test with 100 shops
- [ ] Measure response times
- [ ] Check database performance

#### Stress Testing
- [ ] Test maximum concurrent requests
- [ ] Test with large data sets
- [ ] Monitor memory usage
- [ ] Check for memory leaks

---

### 10. Security Testing

#### Authentication
- [ ] Test JWT expiration
- [ ] Test invalid tokens
- [ ] Test token tampering
- [ ] Test password hashing

#### Authorization
- [ ] Test role-based access
- [ ] Test unauthorized access attempts
- [ ] Test privilege escalation

#### Input Validation
- [ ] Test SQL injection attempts
- [ ] Test XSS attempts
- [ ] Test CSRF protection
- [ ] Test file upload security

#### API Security
- [ ] Test rate limiting
- [ ] Test CORS configuration
- [ ] Test error message exposure
- [ ] Test sensitive data exposure

---

### 11. Database Testing

#### Data Integrity
- [ ] Test unique constraints
- [ ] Test foreign key relationships
- [ ] Test cascade deletes
- [ ] Test data validation

#### Queries
- [ ] Test complex queries
- [ ] Test aggregation pipelines
- [ ] Test index usage
- [ ] Measure query performance

---

### 12. Integration Testing

#### End-to-End Flows

##### Complete Distribution Flow
1. [ ] Admin creates shop
2. [ ] Admin creates shopkeeper
3. [ ] Admin assigns shopkeeper to shop
4. [ ] Admin creates beneficiary
5. [ ] Admin assigns beneficiary to shop
6. [ ] Admin allocates stock
7. [ ] Shopkeeper logs in
8. [ ] Shopkeeper records distribution
9. [ ] Beneficiary logs in
10. [ ] Beneficiary views distribution
11. [ ] Beneficiary downloads receipt

##### Stock Management Flow
1. [ ] Admin allocates stock
2. [ ] Shopkeeper views stock
3. [ ] Shopkeeper records distribution
4. [ ] Stock is automatically deducted
5. [ ] Low stock alert is triggered
6. [ ] Email notification is sent

---

### 13. Browser Compatibility Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

### 14. Accessibility Testing

- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast
- [ ] Focus indicators
- [ ] Alt text for images
- [ ] ARIA labels

---

### 15. Error Handling Testing

#### Frontend
- [ ] Test network errors
- [ ] Test API errors
- [ ] Test validation errors
- [ ] Test 404 pages
- [ ] Test error boundaries

#### Backend
- [ ] Test database connection errors
- [ ] Test validation errors
- [ ] Test authentication errors
- [ ] Test authorization errors
- [ ] Test server errors

---

## Automated Testing (Future Implementation)

### Backend Tests (Jest + Supertest)
```javascript
// Example test structure
describe('Auth API', () => {
  test('POST /api/auth/register - success', async () => {
    // Test implementation
  });
  
  test('POST /api/auth/login - success', async () => {
    // Test implementation
  });
});
```

### Frontend Tests (React Testing Library)
```javascript
// Example test structure
describe('Login Component', () => {
  test('renders login form', () => {
    // Test implementation
  });
  
  test('submits form with valid data', () => {
    // Test implementation
  });
});
```

---

## Bug Reporting Template

```markdown
### Bug Description
[Clear description of the bug]

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Screen Size: [e.g., 1920x1080]

### Screenshots
[If applicable]

### Additional Context
[Any other relevant information]
```

---

## Test Data

### Admin Credentials
```
Email: admin@ration.gov.in
Password: admin123
```

### Shopkeeper Credentials
```
Email: rajesh@shop1.com
Password: shop123
```

### Beneficiary Credentials
```
Email: amit@example.com
Password: user123
```

---

## Testing Tools

- **API Testing**: Postman, Thunder Client, Insomnia
- **Browser Testing**: Chrome DevTools, Firefox DevTools
- **Performance**: Lighthouse, WebPageTest
- **Accessibility**: WAVE, axe DevTools
- **Load Testing**: Apache JMeter, Artillery
- **Security**: OWASP ZAP, Burp Suite

---

## Continuous Testing

- Run tests before each commit
- Test after each feature implementation
- Perform regression testing
- Test in staging environment before production
- Monitor production for errors

---

Remember: Testing is an ongoing process. Always test thoroughly before deploying to production!
