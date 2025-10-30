# Quick Start Guide

## ⚡ Fast Setup (5 minutes)

### Step 1: Get CloudAMQP URL (2 minutes)

1. Go to https://www.cloudamqp.com/
2. Sign up (free account)
3. Create instance → Select "Little Lemur" (Free)
4. Click your instance → Copy the **AMQP URL**

Example URL format:
```
amqp://username:password@hostname.rmq.cloudamqp.com/username
```

### Step 2: Configure (1 minute)

Open `.env` file and replace this line:
```env
RABBITMQ_URL="amqp://your-cloudamqp-url-here"
```

With your actual URL:
```env
RABBITMQ_URL="amqp://xyzabc:AbC123@chimpanzee.rmq.cloudamqp.com/xyzabc"
```

### Step 3: Database Setup (1 minute)

```powershell
npm run prisma:generate
npm run prisma:migrate
```

### Step 4: Start Services (1 minute)

**Easiest way - PowerShell Script:**
```powershell
.\start-services.ps1
```

This opens 4 windows (Gateway + 3 Microservices).

**OR use one terminal:**
```powershell
npm run start:all
```

### Step 5: Test (30 seconds)

Open browser: http://localhost:5000

You should see the API running! 🎉

## 🛑 Stop Services

**If using PowerShell script:**
```powershell
.\stop-services.ps1
```

**OR close all terminal windows manually**

## ✅ Verify Everything Works

### Check Gateway
```
http://localhost:5000
```

### Check CloudAMQP Dashboard
1. Go to CloudAMQP dashboard
2. Click "RabbitMQ Manager"
3. You should see 3 queues:
   - `job_queue`
   - `application_queue`
   - `interview_queue`

### Check Connections
Each queue should show 1 consumer connected.

## 🎯 What's Running?

| Service | Type | Port/Connection |
|---------|------|-----------------|
| API Gateway | HTTP Server | Port 5000 |
| Job Service | Microservice | RabbitMQ |
| Application Service | Microservice | RabbitMQ |
| Interview Service | Microservice | RabbitMQ |

## 📝 Common Issues

### "Cannot connect to RabbitMQ"
→ Check your `RABBITMQ_URL` in `.env`

### "Port 5000 is already in use"
→ Stop other services using port 5000

### "Module not found"
→ Run `npm install` again

## 🚀 Next Steps

1. Test your API endpoints
2. Connect your frontend (port 3000)
3. Monitor messages in CloudAMQP dashboard
4. Check service logs in terminal windows

## 💡 Tips

- Keep all 4 terminal windows open while developing
- Check CloudAMQP dashboard to monitor message flow
- Each service restarts automatically on file changes (watch mode)
- Gateway is the only service exposed via HTTP (port 5000)

---

Need help? Check [README.md](./README.md) or [SETUP.md](./SETUP.md) for detailed documentation.
