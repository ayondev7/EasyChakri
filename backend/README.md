# EasyChakri Backend - NestJS

A scalable, production-ready backend for the EasyChakri Job Portal built with **NestJS** and **TypeScript**.

## 🚀 EXPRESS vs NESTJS - Key Differences

### Architecture

| Concept | Express | NestJS |
|---------|---------|--------|
| **Server Setup** | `server.js` with `app.listen()` | `main.ts` bootstraps application |
| **Routing** | `router.get('/path', handler)` | `@Get('path')` decorator on methods |
| **Middleware** | `app.use(middleware)` | Guards, Interceptors, Pipes |
| **Organization** | Manual file structure | Module-based (feature modules) |
| **Dependency Injection** | Manual/external library | Built-in with decorators |
| **Validation** | express-validator, joi | class-validator with DTOs |
| **Database** | Import Prisma client | PrismaService with DI |

### Code Comparison

#### Express Route Handler
```javascript
// Express
router.post('/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: {...} });
  res.json({ success: true, data: user });
});
```

#### NestJS Controller Method
```typescript
// NestJS
@Post('signup')
async signup(@Body() dto: CredentialSignupDto) {
  return await this.authService.credentialSignup(dto);
  // Automatic validation, automatic response formatting
}
```

### Middleware vs Guards

#### Express Middleware
```javascript
// Express
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const user = await findUser(decoded.userId);
  req.user = user;
  next();
};

router.get('/protected', authMiddleware, handler);
```

#### NestJS Guard
```typescript
// NestJS
@Get('protected')
@UseGuards(JwtAuthGuard)  // Just add decorator
async protectedRoute(@CurrentUser() user: User) {
  // user automatically injected
}
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── main.ts                    # Bootstrap (like server.js)
│   ├── app.module.ts              # Root module
│   ├── common/                    # Shared utilities
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── interceptors/
│   │       └── response.interceptor.ts
│   ├── modules/                   # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── dto/
│   │   │       └── auth.dto.ts
│   │   ├── user/
│   │   ├── job/
│   │   ├── company/
│   │   └── prisma/                # Database module
│   │       ├── prisma.service.ts
│   │       └── prisma.module.ts
│   └── utils/                     # Helper functions
│       ├── token.util.ts
│       └── image.util.ts
├── prisma/
│   └── schema.prisma
├── .env
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

### 4. Start Development Server

```bash
npm run start:dev
```

The server will start on `http://localhost:5000`

### 5. Available Scripts

- `npm run start:dev` - Start in watch mode (development)
- `npm run start` - Start in normal mode
- `npm run start:prod` - Start in production mode
- `npm run build` - Build for production
- `npx prisma studio` - Open Prisma Studio (database GUI)

## 📡 API Endpoints

### Authentication Routes (Public)

```
POST   /api/auth/signup          - Register with email/password
POST   /api/auth/signin          - Login with email/password
POST   /api/auth/google          - Login/Register with Google
POST   /api/auth/refresh         - Refresh access token
```

### User Routes

```
GET    /api/users/me             - Get current user (Protected)
GET    /api/users/:id            - Get user by ID (Protected)
PUT    /api/users/me             - Update profile (Protected)
PUT    /api/users/me/upload-image - Upload profile image (Protected)
DELETE /api/users/me             - Delete account (Protected)
```

### Job Routes

```
GET    /api/jobs                 - Get all jobs (Public, with filters)
GET    /api/jobs/:id             - Get job by ID (Public)
POST   /api/jobs                 - Create job (Protected - Recruiter)
PUT    /api/jobs/:id             - Update job (Protected - Recruiter)
DELETE /api/jobs/:id             - Delete job (Protected - Recruiter)
GET    /api/jobs/recruiter/my-jobs - Get my jobs (Protected - Recruiter)
```

### Company Routes

```
GET    /api/companies            - Get all companies (Public)
GET    /api/companies/:id        - Get company by ID (Public)
POST   /api/companies            - Create company (Protected - Recruiter)
PUT    /api/companies/:id        - Update company (Protected - Recruiter)
PUT    /api/companies/:id/upload-logo - Upload logo (Protected - Recruiter)
DELETE /api/companies/:id        - Delete company (Protected - Recruiter)
GET    /api/companies/recruiter/my-company - Get my company (Protected)
```

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  },
  "meta": {
    "timestamp": "2025-10-07T12:00:00.000Z",
    "path": "/api/path"
  }
}
```

## 🎯 Key NestJS Concepts for Express Developers

### 1. Decorators
- `@Controller()` - Define route prefix
- `@Get()`, `@Post()`, `@Put()`, `@Delete()` - HTTP methods
- `@Body()` - Request body (like req.body)
- `@Param()` - URL parameters (like req.params)
- `@Query()` - Query string (like req.query)
- `@UseGuards()` - Apply middleware/guards
- `@Injectable()` - Make class available for DI

### 2. Dependency Injection
```typescript
// Express: Manual import
const prisma = require('./db');

// NestJS: Automatic injection
constructor(private prisma: PrismaService) {}
```

### 3. DTOs (Data Transfer Objects)
- Replace manual validation
- Type-safe request data
- Automatic validation with class-validator

### 4. Modules
- Organize code by feature
- Each module has controllers, services, DTOs
- Modules can import other modules

### 5. Providers (Services)
- Business logic separated from controllers
- Controllers handle HTTP, Services handle logic
- Reusable across application

## 🔥 Advanced Features

### Image Upload
- Automatic size validation (max 3MB)
- Format validation (png, jpg, jpeg, webp)
- Auto-conversion to WebP with Sharp
- Upload to ImageKit.io

### JWT Authentication
- Access tokens (short-lived, 3h)
- Refresh tokens (long-lived, 7d)
- Automatic user attachment to request

### Global Response/Error Handling
- Consistent response format
- Standardized error codes
- Automatic error catching

### Database
- Prisma ORM
- PostgreSQL (Neon)
- Connection pooling
- Type-safe queries

## 🚀 Production Deployment

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm run start:prod
```

## 📚 Learning Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS vs Express Comparison](https://docs.nestjs.com/first-steps)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🎓 Pro Tips for Express Developers

1. **Think in Modules** - Group related features together
2. **Use Dependency Injection** - Let NestJS handle dependencies
3. **DTOs are Your Friend** - Type safety + automatic validation
4. **Guards > Middleware** - More powerful and reusable
5. **Services for Logic** - Keep controllers thin
6. **Embrace Decorators** - They make code cleaner

## 📝 Environment Variables

Make sure your `.env` file has:

```env
PORT=5000
DATABASE_URL="your_postgresql_url"
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN="3h"
CORS_ORIGIN="http://localhost:3000"
IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
IMAGEKIT_URL_ENDPOINT="your_imagekit_url_endpoint"
```

## 🐛 Debugging

NestJS provides better error messages than Express. Look for:
- Module import errors
- Provider injection errors
- Validation errors (from DTOs)

## 🎉 You're Ready!

Start building with NestJS. The learning curve is worth it for the scalability, maintainability, and developer experience!
