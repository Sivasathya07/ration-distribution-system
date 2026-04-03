# Deployment Guide

## Production Deployment Options

### Option 1: Heroku (Backend) + Vercel (Frontend)

#### Backend Deployment (Heroku)

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
heroku create ration-distribution-api
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_strong_secret
heroku config:set JWT_EXPIRE=30d
heroku config:set CLIENT_URL=https://your-frontend-url.vercel.app
```

5. **Deploy**
```bash
git push heroku main
```

#### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build and Deploy**
```bash
cd client
vercel --prod
```

3. **Environment Variables**
Add in Vercel dashboard:
- `REACT_APP_API_URL=https://your-heroku-app.herokuapp.com`

---

### Option 2: AWS EC2 (Full Stack)

#### 1. Launch EC2 Instance
- Ubuntu Server 20.04 LTS
- t2.medium or higher
- Configure security groups (ports 80, 443, 22, 5000, 3000)

#### 2. Connect and Setup
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

#### 3. Clone and Setup Project
```bash
cd /var/www
sudo git clone your-repo-url ration-system
cd ration-system
sudo npm install
cd client
sudo npm install
sudo npm run build
```

#### 4. Configure Environment
```bash
sudo nano .env
# Add production environment variables
```

#### 5. Start Backend with PM2
```bash
pm2 start server/server.js --name ration-api
pm2 startup
pm2 save
```

#### 6. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/ration-system
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/ration-system/client/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/ration-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. Setup SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

### Option 3: DigitalOcean App Platform

#### 1. Create Account
Sign up at https://www.digitalocean.com

#### 2. Create App
- Connect GitHub repository
- Select branch
- Configure build settings

#### 3. Backend Configuration
```yaml
name: ration-api
services:
  - name: api
    github:
      repo: your-username/ration-system
      branch: main
      deploy_on_push: true
    build_command: npm install
    run_command: npm start
    envs:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        value: ${db.DATABASE_URL}
      - key: JWT_SECRET
        value: ${JWT_SECRET}
    http_port: 5000
```

#### 4. Frontend Configuration
```yaml
  - name: web
    github:
      repo: your-username/ration-system
      branch: main
    build_command: cd client && npm install && npm run build
    output_dir: client/build
```

---

### Option 4: Docker Deployment

#### 1. Create Dockerfile (Backend)
```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

#### 2. Create Dockerfile (Frontend)
```dockerfile
# client/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Create docker-compose.yml
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: ration-mongodb
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123

  backend:
    build: ./server
    container_name: ration-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://admin:password123@mongodb:27017/ration_system?authSource=admin
      - JWT_SECRET=your_secret_key
      - JWT_EXPIRE=30d
    depends_on:
      - mongodb

  frontend:
    build: ./client
    container_name: ration-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

#### 4. Deploy
```bash
docker-compose up -d
```

---

## MongoDB Atlas Setup

### 1. Create Account
Sign up at https://www.mongodb.com/cloud/atlas

### 2. Create Cluster
- Choose free tier (M0)
- Select region closest to your users
- Create cluster

### 3. Configure Access
- Database Access: Create user with password
- Network Access: Add IP (0.0.0.0/0 for all, or specific IPs)

### 4. Get Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/ration_system?retryWrites=true&w=majority
```

### 5. Update Environment Variable
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ration_system?retryWrites=true&w=majority
```

---

## Environment Variables Checklist

### Required for Production
- [ ] NODE_ENV=production
- [ ] MONGO_URI (MongoDB Atlas connection string)
- [ ] JWT_SECRET (strong random string)
- [ ] JWT_EXPIRE=30d
- [ ] CLIENT_URL (frontend URL)

### Optional (Email)
- [ ] EMAIL_HOST
- [ ] EMAIL_PORT
- [ ] EMAIL_USER
- [ ] EMAIL_PASS

---

## Pre-Deployment Checklist

### Security
- [ ] Change default JWT_SECRET
- [ ] Enable MongoDB authentication
- [ ] Configure CORS for specific domains
- [ ] Add rate limiting
- [ ] Enable HTTPS/SSL
- [ ] Sanitize user inputs
- [ ] Add helmet.js for security headers

### Performance
- [ ] Enable gzip compression
- [ ] Add Redis caching (optional)
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Minify frontend assets
- [ ] Enable CDN (optional)

### Monitoring
- [ ] Setup error logging (Sentry)
- [ ] Add performance monitoring
- [ ] Configure uptime monitoring
- [ ] Setup backup strategy
- [ ] Add health check endpoints

### Testing
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test role-based access
- [ ] Test distribution flow
- [ ] Test PDF generation
- [ ] Test email notifications
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing

---

## Post-Deployment

### 1. Seed Initial Data
```bash
node server/seed.js
```

### 2. Test Application
- Login as admin
- Create shops and users
- Test distribution flow
- Verify email notifications
- Test PDF downloads

### 3. Monitor Logs
```bash
# PM2
pm2 logs

# Docker
docker-compose logs -f

# Heroku
heroku logs --tail
```

### 4. Setup Backups
- MongoDB Atlas: Automatic backups enabled
- Manual: Use mongodump/mongorestore
- Schedule regular backups

### 5. Performance Monitoring
- Setup New Relic or DataDog
- Monitor response times
- Track error rates
- Monitor database performance

---

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string
# Ensure IP whitelist in Atlas
# Verify credentials
```

### Port Already in Use
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Build Failures
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules
npm install
```

### CORS Errors
- Verify CLIENT_URL in backend .env
- Check CORS configuration in server.js
- Ensure frontend is making requests to correct API URL

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, AWS ELB)
- Multiple backend instances
- Session management with Redis
- Stateless authentication (JWT)

### Database Scaling
- MongoDB sharding
- Read replicas
- Connection pooling
- Query optimization

### Caching
- Redis for session storage
- Cache frequently accessed data
- CDN for static assets

---

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Security audit
npm audit
npm audit fix
```

### Database Maintenance
- Regular backups
- Index optimization
- Query performance analysis
- Data cleanup

### Monitoring
- Check error logs daily
- Monitor server resources
- Track user activity
- Review security logs

---

## Support & Resources

- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Heroku: https://devcenter.heroku.com/
- Vercel: https://vercel.com/docs
- AWS: https://docs.aws.amazon.com/
- DigitalOcean: https://docs.digitalocean.com/

For issues, check logs and error messages first, then consult documentation.
