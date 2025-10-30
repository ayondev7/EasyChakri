# EasyChakri Backend - Microservices Architecture

A modern NestJS-based job portal backend transformed into a microservices architecture using RabbitMQ for inter-service communication.

## 🏗️ Architecture Overview

This project has been converted from a monolithic structure to a microservices architecture with the following components:

### Services

1. **API Gateway** (Port 5000)
   - Entry point for all HTTP requests
   - Handles authentication and authorization
   - Routes requests to appropriate microservices via RabbitMQ
   - Manages: Auth, User, Company, Notification, and Socket modules

2. **Job Microservice**
   - Manages job postings and searches
   - Handles job applications and saved jobs
   - Provides analytics (jobs by category, location, skills, etc.)
   - Dashboard statistics for recruiters and seekers

3. **Application Microservice**
   - Manages job applications
   - Tracks application status changes
   - Provides application statistics
   - Handles recruiter application reviews

4. **Interview Microservice**
   - Schedules and manages interviews
   - Handles interview confirmations and cancellations
   - Provides interview statistics
   - Tracks upcoming interviews

### Communication Flow

```
Frontend (Port 3000)
       │
       ↓ HTTP
       │
API Gateway (Port 5000)
       │
       ↓ RabbitMQ Messages
       │
   ┌───┴────┬──────────────┐
   ↓        ↓              ↓
Job      Application    Interview
Service  Service        Service
   │        │              │
   └────────┴──────────────┘
            ↓
      Shared Database
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (we use Neon)
- CloudAMQP account (free tier available)

### 1. Clone and Install

```bash
cd backend-v2
npm install
```

### 2. Set Up CloudAMQP

1. Sign up at [CloudAMQP](https://www.cloudamqp.com/)
2. Create a new instance (Free "Little Lemur" plan)
3. Copy your AMQP URL from the instance details

### 3. Configure Environment

Update `.env` file with your CloudAMQP URL:

```env
RABBITMQ_URL="amqp://your-username:your-password@hostname/vhost"
```

### 4. Set Up Database

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Run the Services

**Option 1 - All services in one terminal:**
```bash
npm run start:all
```

**Option 2 - Separate windows (PowerShell):**
```powershell
.\start-services.ps1
```

**Option 3 - Manual (in separate terminals):**
```bash
npm run start:gateway
npm run start:job-service
npm run start:application-service
npm run start:interview-service
```

### 6. Verify Services

- API Gateway: http://localhost:5000
- Check RabbitMQ queues in CloudAMQP dashboard:
  - `job_queue`
  - `application_queue`
  - `interview_queue`

## 📁 Project Structure

```
backend-v2/
├── apps/                           # Microservices
│   ├── gateway/                    # API Gateway
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       ├── job/                # Job Gateway Controllers
│   │       ├── application/        # Application Gateway Controllers
│   │       └── interview/          # Interview Gateway Controllers
│   ├── job-service/                # Job Microservice
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       └── job/
│   │           ├── job.controller.ts
│   │           ├── job.service.ts
│   │           └── job.module.ts
│   ├── application-service/        # Application Microservice
│   │   └── src/
│   │       └── application/
│   └── interview-service/          # Interview Microservice
│       └── src/
│           └── interview/
├── src/                            # Shared modules
│   ├── common/
│   │   ├── constants/
│   │   │   ├── services.ts        # Service names
│   │   │   └── message-patterns.ts # RabbitMQ patterns
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── modules/
│   │   ├── auth/                  # Authentication (Gateway)
│   │   ├── user/                  # User management (Gateway)
│   │   ├── company/               # Company management (Gateway)
│   │   ├── notification/          # Notifications (Shared)
│   │   ├── prisma/                # Database (Shared)
│   │   └── socket/                # WebSockets (Gateway)
│   └── utils/
├── prisma/
│   └── schema.prisma              # Database schema
├── start-services.ps1             # Start all services
├── stop-services.ps1              # Stop all services
├── SETUP.md                       # Detailed setup guide
└── MICROSERVICES.md               # Architecture details
```

## 🔧 Development

### Available Scripts

```bash
# Build all services
npm run build:all

# Run individual services
npm run start:gateway
npm run start:job-service
npm run start:application-service
npm run start:interview-service

# Run all services concurrently
npm run start:all

# Database commands
npm run prisma:generate      # Generate Prisma client
npm run prisma:migrate       # Run migrations
npm run prisma:studio        # Open Prisma Studio
npm run db:seed              # Seed database
```

### Message Patterns

Each microservice listens for specific message patterns:

**Job Service:**
- `create_job`, `get_jobs`, `get_job_by_id`, `update_job`, `delete_job`
- `apply_for_job`, `save_job`, `unsave_job`, `get_saved_jobs`
- `get_jobs_by_experience`, `get_jobs_by_category`, `get_jobs_by_location`
- And more...

**Application Service:**
- `get_application_by_id`, `get_job_applications`
- `update_application_status`, `delete_application`
- `get_recruiter_application_stats`, `get_seeker_application_stats`

**Interview Service:**
- `create_interview`, `update_interview`, `cancel_interview`
- `get_interview_by_id`, `get_recruiter_interviews`, `get_seeker_interviews`
- `get_interview_stats`, `get_upcoming_interviews`

## 🔍 Monitoring

### CloudAMQP Dashboard

1. Log in to CloudAMQP
2. Select your instance
3. Click "RabbitMQ Manager"
4. View the Queues tab to monitor:
   - Message rates
   - Queue depths
   - Consumer connections

### Service Health

Check if services are running:
- Gateway responds at http://localhost:5000
- Each microservice logs "🚀 [Service Name] Microservice is running"
- CloudAMQP shows 3 active connections (one per microservice)

## 🐛 Troubleshooting

### Services won't start

1. **Check RabbitMQ URL:** Ensure it's correctly set in `.env`
2. **Check CloudAMQP instance:** Verify it's running in the dashboard
3. **Port conflicts:** Make sure port 5000 is available
4. **Dependencies:** Run `npm install` again

### Messages not flowing

1. **Check queue connections:** View CloudAMQP dashboard
2. **Check service logs:** Look for connection errors
3. **Restart services:** Use `.\stop-services.ps1` then `.\start-services.ps1`

### Database errors

```bash
# Reset and regenerate
npm run prisma:generate
npm run prisma:migrate
```

## 📚 Additional Resources

- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [MICROSERVICES.md](./MICROSERVICES.md) - Architecture documentation
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [RabbitMQ Tutorial](https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html)

## 🎯 Key Features

- **Scalable:** Each service can be scaled independently
- **Resilient:** Service failures don't affect the entire system
- **Modern:** Uses industry-standard patterns and tools
- **Type-safe:** Full TypeScript support across all services
- **Real-time:** WebSocket support for live updates
- **Cloud-ready:** Uses CloudAMQP for message queuing

## 🤝 Contributing

This is a learning project demonstrating microservices architecture with NestJS and RabbitMQ.

## 📄 License

MIT
