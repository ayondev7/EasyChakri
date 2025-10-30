## Microservices Architecture

This project uses a microservices architecture with the following services:

### Services

1. **API Gateway** (Port 5000)
   - Handles HTTP requests
   - Routes to microservices via RabbitMQ
   - Manages Auth, User, Company, Notification, and Socket modules

2. **Job Service** (Microservice)
   - Manages job postings, searches, and job-related operations
   - Handles saved jobs and job applications

3. **Application Service** (Microservice)
   - Manages job applications
   - Tracks application status

4. **Interview Service** (Microservice)
   - Manages interview scheduling
   - Handles interview updates and cancellations

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your CloudAMQP RabbitMQ URL in `.env`:
```env
RABBITMQ_URL="amqp://your-cloudamqp-url-here"
```

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

### Running Services

#### Development Mode

Run all services concurrently:
```powershell
npm run start:all
```

Or run services individually in separate terminal windows:
```powershell
npm run start:gateway
npm run start:job-service
npm run start:application-service
npm run start:interview-service
```

Or use the PowerShell script (opens each service in a new window):
```powershell
.\start-services.ps1
```

#### Production Mode

Build all services:
```bash
npm run build:all
```

### Architecture

```
Frontend (Port 3000)
       ↓
API Gateway (Port 5000) ← HTTP Requests
       ↓
   RabbitMQ (CloudAMQP)
       ↓
   ┌────┴────┬──────────────┐
   ↓         ↓              ↓
Job      Application    Interview
Service  Service        Service
```

### Message Patterns

Services communicate using RabbitMQ message patterns. Each service listens to its own queue and responds to specific patterns defined in `src/common/constants/message-patterns.ts`.

### Database

All services share the same Prisma database connection via the DATABASE_URL environment variable.
