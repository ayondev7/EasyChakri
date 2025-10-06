# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### Register User (Signup)
```http
POST /auth/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "SEEKER" | "RECRUITER",
  "phone": "1234567890" (optional),
  "location": "New York" (optional)
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "SEEKER",
      "image": null
    },
    "accessToken": "jwt_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

---

### Login (Signin)
```http
POST /auth/signin
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as signup

---

### Google Sign In
```http
POST /auth/google
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "image": "https://...",
  "role": "SEEKER" | "RECRUITER"
}
```

**Response:** Same as signup

---

### Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

---

## 👤 User Endpoints

### Get Current User
```http
GET /users/me
```
**Protected:** Yes

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "SEEKER",
  "image": "https://...",
  "phone": "1234567890",
  "location": "New York",
  "bio": "Software Developer",
  "skills": ["JavaScript", "React"],
  "experience": "5 years",
  "education": "BS Computer Science",
  "resume": "https://...",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

### Get User by ID
```http
GET /users/:id
```
**Protected:** Yes

---

### Update Profile
```http
PUT /users/me
```
**Protected:** Yes

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "location": "New York",
  "bio": "Experienced developer",
  "skills": ["JavaScript", "TypeScript", "React"],
  "experience": "5 years in web development",
  "education": "BS in Computer Science",
  "resume": "https://resume-url.com"
}
```

---

### Upload Profile Image
```http
PUT /users/me/upload-image
```
**Protected:** Yes
**Content-Type:** multipart/form-data

**Form Data:**
- `image`: File (PNG, JPG, JPEG, WEBP, max 3MB)

**Response:**
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "image": "https://imagekit-url.com/..."
  }
}
```

---

### Delete Account
```http
DELETE /users/me
```
**Protected:** Yes

---

## 💼 Job Endpoints

### Get All Jobs (with filters)
```http
GET /jobs?search=developer&type=FULL_TIME&location=New York&page=1&limit=10
```
**Protected:** No

**Query Parameters:**
- `search`: Search in title, description, company name
- `type`: FULL_TIME | PART_TIME | CONTRACT | INTERNSHIP | REMOTE
- `location`: Filter by location
- `category`: Filter by category
- `isRemote`: true | false
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
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
      "views": 150,
      "deadline": "2025-12-31T00:00:00.000Z",
      "category": "Technology",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "company": {
        "id": "uuid",
        "name": "Tech Corp",
        "logo": "https://...",
        "location": "New York",
        "industry": "Technology"
      },
      "_count": {
        "applications": 25
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### Get Job by ID
```http
GET /jobs/:id
```
**Protected:** No

---

### Create Job
```http
POST /jobs
```
**Protected:** Yes (Recruiter only)

**Request Body:**
```json
{
  "title": "Senior Developer",
  "description": "We are looking for an experienced developer...",
  "requirements": ["5+ years experience", "Strong JavaScript skills"],
  "responsibilities": ["Develop new features", "Code reviews"],
  "benefits": ["Health insurance", "401k"],
  "skills": ["JavaScript", "TypeScript", "React"],
  "type": "FULL_TIME",
  "experience": "5+ years",
  "salary": "$80,000 - $120,000",
  "location": "New York",
  "isRemote": false,
  "category": "Technology",
  "companyId": "uuid",
  "deadline": "2025-12-31" (optional)
}
```

---

### Update Job
```http
PUT /jobs/:id
```
**Protected:** Yes (Recruiter only, must own the job)

**Request Body:** Same as create (all fields optional)

---

### Delete Job
```http
DELETE /jobs/:id
```
**Protected:** Yes (Recruiter only, must own the job)

---

### Get My Jobs (Recruiter)
```http
GET /jobs/recruiter/my-jobs?page=1&limit=10
```
**Protected:** Yes (Recruiter only)

---

## 🏢 Company Endpoints

### Get All Companies
```http
GET /companies?page=1&limit=10
```
**Protected:** No

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Tech Corp",
      "logo": "https://...",
      "description": "Leading technology company",
      "industry": "Technology",
      "size": "100-500",
      "location": "New York",
      "website": "https://techcorp.com",
      "founded": "2010",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "_count": {
        "jobs": 15
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### Get Company by ID
```http
GET /companies/:id
```
**Protected:** No

**Response includes:**
- Company details
- Recent jobs (last 10)
- Total job count
- Recruiter info

---

### Get My Company
```http
GET /companies/recruiter/my-company
```
**Protected:** Yes (Recruiter only)

---

### Create Company
```http
POST /companies
```
**Protected:** Yes (Recruiter only)

**Request Body:**
```json
{
  "name": "Tech Corp",
  "description": "We are a leading technology company...",
  "industry": "Technology",
  "size": "100-500",
  "location": "New York",
  "website": "https://techcorp.com",
  "founded": "2010",
  "logo": "https://..." (optional)
}
```

---

### Update Company
```http
PUT /companies/:id
```
**Protected:** Yes (Recruiter only, must own the company)

**Request Body:** Same as create (all fields optional)

---

### Upload Company Logo
```http
PUT /companies/:id/upload-logo
```
**Protected:** Yes (Recruiter only)
**Content-Type:** multipart/form-data

**Form Data:**
- `logo`: File (PNG, JPG, JPEG, WEBP, max 3MB)

---

### Delete Company
```http
DELETE /companies/:id
```
**Protected:** Yes (Recruiter only, must own the company)

---

## Error Codes

| Code | Description |
|------|-------------|
| `BAD_REQUEST` | Invalid request data |
| `UNAUTHORIZED` | Missing or invalid token |
| `FORBIDDEN` | No permission to access resource |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource already exists |
| `VALIDATION_ERROR` | Validation failed |
| `INTERNAL_ERROR` | Server error |

---

## Error Response Format

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

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are UUIDs
- File uploads must be < 3MB
- Images are auto-converted to WebP format
- Pagination starts at page 1
- Default limit is 10 items per page
