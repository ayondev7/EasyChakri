# 🚀 Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set up Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database
npx prisma db seed
```

### 3. Start Development Server
```bash
npm run start:dev
```

Server runs on: **http://localhost:5000**

## 🧪 Test the API

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "SEEKER"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Jobs (Public)
```bash
curl http://localhost:5000/api/jobs
```

### Create Job (Protected - need token)
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Senior Developer",
    "description": "We are looking for...",
    "requirements": ["5+ years experience"],
    "responsibilities": ["Develop features"],
    "benefits": ["Health insurance"],
    "skills": ["JavaScript", "TypeScript"],
    "type": "FULL_TIME",
    "experience": "5+ years",
    "salary": "$80,000 - $120,000",
    "location": "New York",
    "isRemote": false,
    "category": "Technology",
    "companyId": "your-company-id"
  }'
```

## 📝 Useful Commands

```bash
# Development
npm run start:dev          # Start with hot reload

# Production
npm run build              # Build for production
npm run start:prod         # Run production build

# Database
npx prisma studio          # Open Prisma Studio (GUI)
npx prisma migrate dev     # Create migration
npx prisma migrate reset   # Reset database
npx prisma generate        # Regenerate Prisma Client

# Debugging
npm run start:debug        # Start with debugger
```

## 🎯 Next Steps

1. Test all authentication endpoints
2. Create a company profile (Recruiter)
3. Post a job (Recruiter)
4. Browse jobs (Seeker)
5. Update user profile
6. Upload images

## 💡 Tips

- Use **Postman** or **Insomnia** for easier API testing
- Check **Prisma Studio** to view database data visually
- Look at the code comments - they explain Express vs NestJS differences
- Start with auth endpoints, then move to jobs and companies
