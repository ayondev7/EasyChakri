## Getting Started with CloudAMQP

Before running the microservices, you need to set up RabbitMQ with CloudAMQP.

### Step 1: Get Your CloudAMQP URL

1. Go to [CloudAMQP](https://www.cloudamqp.com/)
2. Sign up for a free account or log in
3. Create a new instance (Free plan "Little Lemur" is sufficient for development)
4. Once created, click on your instance
5. Copy the **AMQP URL** from the instance details page
   - It will look like: `amqp://username:password@hostname/vhost`

### Step 2: Configure Your Environment

Open the `.env` file in the `backend-v2` directory and replace the placeholder:

```env
RABBITMQ_URL="amqp://your-cloudamqp-url-here"
```

With your actual CloudAMQP URL:

```env
RABBITMQ_URL="amqp://xyzabc:AbC123XyZ@chimpanzee.rmq.cloudamqp.com/xyzabc"
```

### Step 3: Install Dependencies

```bash
cd backend-v2
npm install
```

### Step 4: Set Up Database

```bash
npm run prisma:generate
npm run prisma:migrate
```

### Step 5: Run the Services

#### Option 1: Run all services at once (using concurrently)
```bash
npm run start:all
```

#### Option 2: Run all services in separate windows (using PowerShell script)
```powershell
.\start-services.ps1
```

This will open 4 PowerShell windows:
- API Gateway on port 5000
- Job Microservice (communicates via RabbitMQ)
- Application Microservice (communicates via RabbitMQ)
- Interview Microservice (communicates via RabbitMQ)

#### Option 3: Run services manually in separate terminals

**Terminal 1 - API Gateway:**
```bash
npm run start:gateway
```

**Terminal 2 - Job Service:**
```bash
npm run start:job-service
```

**Terminal 3 - Application Service:**
```bash
npm run start:application-service
```

**Terminal 4 - Interview Service:**
```bash
npm run start:interview-service
```

### Stopping Services

To stop all services when using the PowerShell script:
```powershell
.\stop-services.ps1
```

Or simply close each PowerShell window.

### Troubleshooting

If you encounter connection errors:

1. **Check your CloudAMQP URL** - Make sure it's correctly copied
2. **Check CloudAMQP Dashboard** - Verify your instance is running
3. **Firewall Issues** - Ensure your firewall allows outbound connections to CloudAMQP

### Monitoring

You can monitor your RabbitMQ queues from the CloudAMQP dashboard:
- Go to your instance
- Click on "RabbitMQ Manager"
- View the Queues tab to see message flow

You should see three queues:
- `job_queue`
- `application_queue`
- `interview_queue`
