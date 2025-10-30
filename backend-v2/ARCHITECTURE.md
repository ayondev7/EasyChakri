# System Architecture Diagram

## Complete Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                             │
│                    (Frontend - Port 3000)                          │
└───────────────────────────────┬────────────────────────────────────┘
                                │
                                │ HTTP Requests
                                │ (GET, POST, PUT, DELETE)
                                │
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Port 5000)                       │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    HTTP Modules                              │ │
│  │                                                              │ │
│  │  • Auth Module      → Login, Register, Guest Login         │ │
│  │  • User Module      → Profile, Update User                 │ │
│  │  • Company Module   → Create/Update Company                │ │
│  │  • Notification     → Get/Mark Notifications               │ │
│  │  • Socket Module    → WebSocket Real-time Updates          │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              Gateway Controllers (RabbitMQ)                  │ │
│  │                                                              │ │
│  │  • Job Gateway         → Forwards to Job Service           │ │
│  │  • Application Gateway → Forwards to Application Service   │ │
│  │  • Interview Gateway   → Forwards to Interview Service     │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬────────────────────────────────────┘
                                │
                                │ RabbitMQ Messages
                                │ (CloudAMQP)
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│                        RABBITMQ QUEUES                             │
│                      (CloudAMQP Service)                           │
│                                                                    │
│  ┌──────────────┐   ┌────────────────┐   ┌─────────────────┐    │
│  │  job_queue   │   │ application_   │   │  interview_     │    │
│  │              │   │    queue       │   │     queue       │    │
│  │  Consumer: 1 │   │  Consumer: 1   │   │   Consumer: 1   │    │
│  └──────┬───────┘   └────────┬───────┘   └────────┬────────┘    │
└─────────┼────────────────────┼────────────────────┼──────────────┘
          │                    │                    │
          │                    │                    │
          ↓                    ↓                    ↓
┌─────────────────┐  ┌──────────────────┐  ┌────────────────────┐
│  JOB SERVICE    │  │  APPLICATION     │  │  INTERVIEW         │
│                 │  │  SERVICE         │  │  SERVICE           │
│  • Create Job   │  │  • Get Apps      │  │  • Schedule        │
│  • Search Jobs  │  │  • Update Status │  │  • Update          │
│  • Apply Job    │  │  • Stats         │  │  • Cancel          │
│  • Save Job     │  │  • Delete App    │  │  • Get Details     │
│  • Analytics    │  │                  │  │  • Stats           │
│  • Stats        │  │                  │  │                    │
└────────┬────────┘  └─────────┬────────┘  └──────────┬─────────┘
         │                     │                       │
         │                     │                       │
         └─────────────────────┴───────────────────────┘
                               │
                               │ Shared Database Access
                               ↓
                    ┌──────────────────────┐
                    │   PostgreSQL (Neon)  │
                    │                      │
                    │   • Users            │
                    │   • Jobs             │
                    │   • Applications     │
                    │   • Interviews       │
                    │   • Companies        │
                    │   • Notifications    │
                    └──────────────────────┘
```

## Message Flow Example

### Example 1: User Creates a Job

```
1. Frontend                  →  POST /jobs
                                 { title, description, ... }

2. API Gateway               →  Validates JWT token
                                 Extracts user ID
                                 
3. Job Gateway Controller    →  Sends message to RabbitMQ
                                 Pattern: "create_job"
                                 Data: { recruiterId, dto }

4. RabbitMQ (CloudAMQP)      →  Routes message to job_queue

5. Job Service               →  Receives message
                                 Validates data
                                 Creates job in database
                                 Returns response

6. RabbitMQ                  →  Returns response to Gateway

7. Gateway                   →  Sends HTTP response to Frontend

8. Frontend                  →  Displays new job
```

### Example 2: Recruiter Updates Application Status

```
1. Frontend                  →  PUT /applications/:id/status
                                 { status: "SHORTLISTED" }

2. API Gateway               →  Validates JWT token
                                 Checks user is recruiter

3. Application Gateway       →  Sends message to RabbitMQ
                                 Pattern: "update_application_status"

4. RabbitMQ                  →  Routes to application_queue

5. Application Service       →  Receives message
                                 Validates permissions
                                 Updates status in database
                                 Creates notification
                                 Returns response

6. Notification Module       →  Sends real-time notification
                                 via WebSocket

7. Gateway                   →  Returns HTTP response

8. Frontend                  →  Updates UI + shows notification
```

## Service Communication Patterns

### Synchronous (Request-Response)
```
Gateway → RabbitMQ → Microservice → RabbitMQ → Gateway → Frontend
         (message)              (response)
```

### All communications between Gateway and Microservices use this pattern.

## Key Points

1. **Frontend only talks to Gateway** (port 5000)
2. **Gateway routes to services** via RabbitMQ
3. **Services never expose HTTP endpoints** (only RabbitMQ)
4. **All services share same database** (Prisma)
5. **RabbitMQ ensures messages aren't lost** (durable queues)
6. **Each service is independent** (can restart without affecting others)

## Port Usage

| Component | Type | Port/Connection |
|-----------|------|-----------------|
| Frontend | HTTP Server | 3000 |
| API Gateway | HTTP Server | 5000 |
| Job Service | RabbitMQ Consumer | N/A |
| Application Service | RabbitMQ Consumer | N/A |
| Interview Service | RabbitMQ Consumer | N/A |
| PostgreSQL | Database | (Cloud/Remote) |
| RabbitMQ | Message Queue | (CloudAMQP) |

## Why This Architecture?

### Traditional Monolith
```
Frontend → Single Server (port 5000) → Database
```
Problems:
- Can't scale individual features
- One bug can crash everything
- Hard to maintain as it grows

### Microservices (Your New Architecture)
```
Frontend → Gateway → RabbitMQ → [Multiple Services] → Database
```
Benefits:
- ✅ Scale services independently
- ✅ One service crash doesn't affect others
- ✅ Easy to add new services
- ✅ Better code organization
- ✅ Modern, industry-standard approach

## Monitoring & Debugging

### Check Gateway
```
http://localhost:5000
```
Should respond (not connection error)

### Check RabbitMQ
```
CloudAMQP Dashboard → RabbitMQ Manager → Queues Tab
```
Should show:
- 3 queues created
- 1 consumer per queue
- Message rates when using app

### Check Services
```
PowerShell windows should show:
🚀 [Service Name] Microservice is running
```

### Check Database
```powershell
npm run prisma:studio
```
Opens Prisma Studio to view/edit data

## Common Patterns

### GET Request (Read Data)
```
Frontend → Gateway → RabbitMQ → Service (reads DB) → Response
```

### POST Request (Create Data)
```
Frontend → Gateway → RabbitMQ → Service (writes DB) → Notification → Response
```

### PUT Request (Update Data)
```
Frontend → Gateway → RabbitMQ → Service (updates DB) → Notification → Response
```

### DELETE Request (Delete Data)
```
Frontend → Gateway → RabbitMQ → Service (deletes DB) → Response
```

---

This is a production-ready, scalable architecture that follows modern best practices! 🚀
