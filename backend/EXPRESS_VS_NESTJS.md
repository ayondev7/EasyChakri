# 📚 Express to NestJS Cheat Sheet

## Basic Concepts

### Starting the Server

**Express:**
```javascript
const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**NestJS:**
```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

---

## Routes & Controllers

### Simple GET Route

**Express:**
```javascript
app.get('/users', (req, res) => {
  const users = getUsers();
  res.json(users);
});
```

**NestJS:**
```typescript
@Controller('users')
export class UserController {
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
}
```

### POST with Body

**Express:**
```javascript
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const user = createUser(name, email);
  res.json(user);
});
```

**NestJS:**
```typescript
@Controller('users')
export class UserController {
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
```

### Route Parameters

**Express:**
```javascript
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = getUserById(id);
  res.json(user);
});
```

**NestJS:**
```typescript
@Get(':id')
getUser(@Param('id') id: string) {
  return this.userService.getUserById(id);
}
```

### Query Parameters

**Express:**
```javascript
app.get('/users', (req, res) => {
  const { page, limit } = req.query;
  const users = getUsers(page, limit);
  res.json(users);
});
```

**NestJS:**
```typescript
@Get()
getUsers(
  @Query('page') page: number,
  @Query('limit') limit: number
) {
  return this.userService.getUsers(page, limit);
}
```

---

## Middleware & Guards

### Authentication Middleware

**Express:**
```javascript
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Usage
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
```

**NestJS:**
```typescript
// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    const decoded = jwt.verify(token, SECRET);
    request.user = await this.userService.findById(decoded.userId);
    return true;
  }
}

// Usage
@Get('protected')
@UseGuards(JwtAuthGuard)
getProtected(@CurrentUser() user: User) {
  return { user };
}
```

---

## Database Connection

### Prisma Setup

**Express:**
```javascript
// db.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;

// Usage in route
const prisma = require('./db');
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
```

**NestJS:**
```typescript
// prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient {
  async onModuleInit() {
    await this.$connect();
  }
}

// Usage in service (with dependency injection)
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  async getUsers() {
    return this.prisma.user.findMany();
  }
}
```

---

## Validation

### Request Body Validation

**Express:**
```javascript
const { body, validationResult } = require('express-validator');

app.post('/users',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

**NestJS:**
```typescript
// DTO (Data Transfer Object)
export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

// Controller (validation automatic)
@Post()
createUser(@Body() dto: CreateUserDto) {
  return this.userService.create(dto);
}
```

---

## Error Handling

### Global Error Handler

**Express:**
```javascript
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    error: err
  });
});
```

**NestJS:**
```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    
    response.status(status).json({
      success: false,
      message: exception.message,
      error: exception.getResponse()
    });
  }
}

// Apply globally in main.ts
app.useGlobalFilters(new HttpExceptionFilter());
```

---

## Dependency Injection

### Sharing Services

**Express:**
```javascript
// Manually import and use
const userService = require('./services/user.service');
const authService = require('./services/auth.service');

app.post('/login', async (req, res) => {
  const user = await userService.findByEmail(req.body.email);
  const token = authService.generateToken(user);
  res.json({ token });
});
```

**NestJS:**
```typescript
// Automatically injected
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,  // Injected
    private jwtService: JwtService     // Injected
  ) {}
  
  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    const token = this.jwtService.sign({ userId: user.id });
    return { token };
  }
}
```

---

## File Upload

### Image Upload

**Express:**
```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  res.json({ filename: file.filename });
});
```

**NestJS:**
```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { filename: file.filename };
}
```

---

## Response Formatting

### Standard Response

**Express:**
```javascript
// Manual response formatting
app.get('/users', async (req, res) => {
  const users = await getUsers();
  res.json({
    success: true,
    data: users,
    meta: { total: users.length }
  });
});
```

**NestJS:**
```typescript
// With Response Interceptor (automatic)
@Get()
getUsers() {
  return this.userService.getUsers();
  // Automatically formatted by interceptor
}

// Interceptor formats all responses consistently
```

---

## Module Organization

### Feature Module

**Express:**
```javascript
// routes/user.routes.js
const router = express.Router();
router.get('/', getUsers);
router.post('/', createUser);
module.exports = router;

// app.js
const userRoutes = require('./routes/user.routes');
app.use('/users', userRoutes);
```

**NestJS:**
```typescript
// user.module.ts
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}

// app.module.ts
@Module({
  imports: [UserModule]
})
export class AppModule {}
```

---

## Environment Variables

**Express:**
```javascript
require('dotenv').config();
const PORT = process.env.PORT || 3000;
```

**NestJS:**
```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    })
  ]
})
export class AppModule {}

// Usage in service
constructor(private configService: ConfigService) {
  const port = this.configService.get('PORT');
}
```

---

## Key Takeaways

| Feature | Express | NestJS |
|---------|---------|--------|
| **Architecture** | Flexible, manual | Structured, opinionated |
| **TypeScript** | Optional | Built-in |
| **DI** | Manual or 3rd party | Built-in |
| **Validation** | Manual (express-validator) | Automatic (class-validator) |
| **Testing** | DIY setup | Built-in support |
| **Structure** | Choose your own | Module-based |
| **Learning Curve** | Lower | Higher |
| **Scalability** | Manual | Built-in best practices |

---

## 🎯 Quick Tips

1. **Controllers** = Route handlers (Express routes)
2. **Services** = Business logic (like your service files)
3. **Modules** = Feature organization (no direct equivalent)
4. **Guards** = Middleware (but more powerful)
5. **DTOs** = Request validation schemas
6. **Decorators** = Meta-programming (like annotations)

---

## 🚀 When to Use What

**Use Express when:**
- Building simple APIs
- Need maximum flexibility
- Quick prototypes
- Small team/projects

**Use NestJS when:**
- Building large applications
- Need structure and standards
- Team collaboration
- Long-term maintenance
- Enterprise projects

---

Happy coding! 🎉
