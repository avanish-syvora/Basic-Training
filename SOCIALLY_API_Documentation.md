#  SOCIALLY API Documentation

**RESTful API for a Social Media Platform**

---

##  Base URL

```
https://api.socialsphere.com/v1
```

---

##  Authentication

- **Method**: JWT token + OTP verification
- **Headers**:
  ```
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json
  ```

###  OTP Flow

1. **Request OTP**  
   `POST /auth/login/request-otp`

2. **Verify OTP**  
   `POST /auth/login/verify-otp` → returns JWT token

---

## Role-Based Access Control (RBAC)

| Role       | Permissions |
|------------|-------------|
| `user`     | Create posts, manage friend requests, like content, view public feeds |
| `moderator`| Delete posts, suspend users |
| `admin`    | Full system access (user, config, moderation) |

---

##  Endpoints

### 1.  User Sign-Up

```http
POST /auth/signup
```
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response (201)**:
```json
{
  "message": "User registered successfully",
  "userId": "u987"
}
```

### 2. Login – Step 1: Request OTP

```http
POST /auth/login/request-otp
```
```json
{
  "email": "john@example.com"
}
```

**Response (200)**:
```json
{
  "message": "OTP sent to your email",
  "otpSessionId": "s12345"
}
```

### 3.  Login – Step 2: Verify OTP

```http
POST /auth/login/verify-otp
```
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "otpSessionId": "s12345"
}
```

**Response (200)**:
```json
{
  "token": "eyJhbGci...",
  "expiresIn": 3600,
  "roles": ["user"]
}
```

---

### 4. Send Friend Request

```http
POST /friends/request
```
```json
{
  "toUserId": "u123"
}
```

**Response (200)**:
```json
{
  "message": "Friend request sent"
}
```

---

### 5.  Accept/Reject Friend Request

```http
POST /friends/respond
```
```json
{
  "requestId": "r456",
  "action": "accept"
}
```

**Response (200)**:
```json
{
  "message": "Friend request accepted"
}
```

---

### 6.  Create Post

```http
POST /posts
```
```json
{
  "content": "Hello world! #social"
}
```

**Response (201)**:
```json
{
  "postId": "p789",
  "authorId": "u987",
  "content": "Hello world! #social",
  "createdAt": "2025-07-08T12:34:56Z"
}
```

---

### 7. Like/Unlike Post

```http
POST /posts/p789/like
```

**Response (200)**:
```json
{
  "message": "Post liked",
  "postId": "p789",
  "likesCount": 6
}
```

---

### 8.  List Posts (Paginated)

```http
GET /posts?userId=u987&limit=10&offset=0
```

**Response (200)**:
```json
[
  {
    "postId": "p789",
    "authorId": "u987",
    "content": "Hello world!",
    "likes": 5,
    "isLikedByMe": true,
    "createdAt": "2025-07-08T12:34:56Z"
  }
]
```

---

##  Validation Rules

| Field       | Rule                                                                 |
|-------------|----------------------------------------------------------------------|
| `username`  | Alphanumeric, 3–30 chars, no special chars or spaces                |
| `email`     | Must be valid format & unique                                        |
| `password`  | 8+ chars, 1 uppercase, 1 number, 1 special character                 |
| `otp`       | 6-digit numeric, valid 5 minutes, single-use                        |
| `content`   | 1–256 non-whitespace chars                                           |
| `action`    | `"accept"` or `"reject"` only (case-sensitive)                      |
| `IDs`       | UUID format, must reference existing resources                      |
| `limit`     | Max 50, non-negative integers                                        |
| `offset`    | Non-negative integers                                                |

---

##  Security Practices

- **HTTPS-only**: Encrypted traffic
- **Password hashing**: bcrypt + salting
- **JWT tokens**:
  - Signed with RSA256
  - Short-lived (`expiresIn = 3600s`)
  - Blacklist on logout
- **OTP**: Time-limited (5 mins), one-time
- **Rate Limiting**: On login & OTP routes
- **Input Sanitization**: Prevents XSS & SQL injection
- **CORS**: Only whitelisted domains allowed
- **Error Handling**: Generic messages to prevent info leakage

---

##  Database Schema

### Tables & Columns

| Table            | Columns |
|------------------|---------|
| **Users**        | id, username, email, passwordHash, role, createdAt, updatedAt |
| **OTPSessions**  | id, userId, otpCode, expiresAt, isUsed, createdAt |
| **FriendRequests**| id, fromUserId, toUserId, status, requestedAt, respondedAt |
| **Posts**        | id, userId, content, createdAt, updatedAt |
| **Likes**        | id, userId, postId, likedAt (unique: userId + postId) |

### Key Design Notes

- **Indexes** on foreign keys (userId, postId)
- Friendships derived from accepted requests
- UUIDs used for scalability & distributed systems
- Optimized for **horizontal scaling** with minimal joins
