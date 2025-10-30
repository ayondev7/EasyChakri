# 🚀 Launch Checklist

Use this checklist to get your microservices running:

## Before First Run

- [ ] **Install dependencies**
  ```powershell
  npm install
  ```

- [ ] **Create CloudAMQP account**
  - Go to https://www.cloudamqp.com/
  - Sign up (free)

- [ ] **Create CloudAMQP instance**
  - Click "Create New Instance"
  - Name: EasyChakri (or anything)
  - Plan: Little Lemur (FREE)
  - Region: Choose closest to you
  - Click "Create Instance"

- [ ] **Copy CloudAMQP URL**
  - Click on your instance
  - Copy the AMQP URL (looks like: amqp://user:pass@hostname/vhost)

- [ ] **Update .env file**
  ```env
  RABBITMQ_URL="amqp://[paste-your-url-here]"
  ```

- [ ] **Generate Prisma client**
  ```powershell
  npm run prisma:generate
  ```

- [ ] **Run database migrations**
  ```powershell
  npm run prisma:migrate
  ```

## First Launch

- [ ] **Start all services**
  ```powershell
  .\start-services.ps1
  ```
  
  You should see 4 PowerShell windows open:
  1. API Gateway (port 5000)
  2. Job Service
  3. Application Service
  4. Interview Service

- [ ] **Verify Gateway is running**
  - Open browser: http://localhost:5000
  - Should not show connection errors

- [ ] **Check CloudAMQP Dashboard**
  - Log in to CloudAMQP
  - Click your instance
  - Click "RabbitMQ Manager"
  - Go to "Queues" tab
  - You should see 3 queues:
    - job_queue (1 consumer)
    - application_queue (1 consumer)
    - interview_queue (1 consumer)

- [ ] **Check service logs**
  Each window should show:
  - ✅ "🚀 [Service Name] is running"
  - No connection errors

## Testing

- [ ] **Test from frontend**
  - Start your frontend (port 3000)
  - Try logging in
  - Try viewing jobs
  - Try creating a job (if recruiter)

- [ ] **Check RabbitMQ messages**
  - Go to CloudAMQP RabbitMQ Manager
  - Click on a queue
  - You should see message rates when using the app

## Daily Development

- [ ] **Start services**
  ```powershell
  .\start-services.ps1
  ```

- [ ] **When done, stop services**
  ```powershell
  .\stop-services.ps1
  ```
  OR just close all PowerShell windows

## Troubleshooting

### Services won't start?
- [ ] Check RABBITMQ_URL in .env
- [ ] Check CloudAMQP instance is running
- [ ] Run `npm install` again
- [ ] Check port 5000 is not in use

### No queues in CloudAMQP?
- [ ] Services must be running to create queues
- [ ] Check service logs for errors
- [ ] Verify RABBITMQ_URL is correct

### Frontend can't connect?
- [ ] Gateway must be running (port 5000)
- [ ] Check CORS_ORIGIN in .env matches frontend URL
- [ ] Check browser console for errors

### Database errors?
- [ ] Run `npm run prisma:generate`
- [ ] Run `npm run prisma:migrate`
- [ ] Check DATABASE_URL in .env

## Quick Commands

```powershell
# Start everything
.\start-services.ps1

# Stop everything
.\stop-services.ps1

# Or use NPM commands
npm run start:all              # All services in one terminal
npm run start:gateway          # Just gateway
npm run start:job-service      # Just job service
npm run start:application-service  # Just application service
npm run start:interview-service    # Just interview service

# Database
npm run prisma:studio          # Open Prisma Studio
npm run prisma:migrate         # Run migrations
npm run prisma:generate        # Generate client

# Build
npm run build:all              # Build all services
```

## Success Indicators

✅ **Everything is working when:**
1. All 4 service windows are open and running
2. No error messages in logs
3. Gateway responds at http://localhost:5000
4. CloudAMQP shows 3 queues with 1 consumer each
5. Frontend can communicate with backend
6. Messages appear in CloudAMQP when using the app

---

**First time setup takes ~5 minutes.**
**Daily startup takes ~10 seconds.**

Need help? Check:
- QUICKSTART.md (fastest path)
- README.md (complete guide)
- SETUP.md (detailed CloudAMQP setup)
- MICROSERVICES.md (architecture details)
