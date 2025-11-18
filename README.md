# Chat App Backend - Microservices Architecture

## 1. Backend cho ứng dụng chat real-time sử dụng kiến trúc microservices.

## Kiến trúc

```
backend/
├── user/     # User Service - Authentication & User Management (Port 5000)
├── mail/     # Mail Service - Email OTP Sender (Port 5001)
└── chat/     # Chat Service - Messaging & File Upload (Port 5002)
```

## Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Storage**: Cloudinary (for images)
- **Authentication**: JWT (JSON Web Token)
- **Email**: Nodemailer

---

## Services Overview

### 1. User Service (Port 5000)

**Chức năng:**
- Đăng nhập bằng OTP (không cần password)
- Xác thực OTP và cấp JWT token
- Quản lý thông tin người dùng
- Lấy danh sách users

**API Endpoints:**
```
POST   /api/v1/login          - Gửi OTP qua email
POST   /api/v1/verify         - Xác thực OTP, trả về JWT token
GET    /api/v1/me             - Lấy thông tin profile (cần auth)
POST   /api/v1/update/user    - Cập nhật tên user (cần auth)
GET    /api/v1/user/all       - Lấy danh sách tất cả users (cần auth)
GET    /api/v1/user/:id       - Lấy thông tin 1 user
```

**Dependencies chính:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `redis` - Cache & rate limiting
- `amqplib` - RabbitMQ client
- `dotenv` - Environment variables

---

### 2. Mail Service (Port 5001)

**Chức năng:**
- Consumer RabbitMQ queue "send-otp"
- Gửi email OTP qua SMTP (Gmail)

**Message Queue Flow:**
```
User Service → RabbitMQ (queue: send-otp) → Mail Service → Gmail SMTP
```

**Dependencies chính:**
- `nodemailer` - Email sender
- `amqplib` - RabbitMQ consumer

---

### 3. Chat Service (Port 5002)

**Chức năng:**
- Tạo chat 1-1 giữa 2 users
- Lấy danh sách chats với số tin nhắn chưa đọc
- Gửi tin nhắn (text hoặc image)
- Upload ảnh lên Cloudinary

**API Endpoints:**
```
POST   /api/v1/chat/new       - Tạo chat mới (cần auth)
GET    /api/v1/chat/all       - Lấy tất cả chats (cần auth)
POST   /api/v1/message        - Gửi tin nhắn (cần auth, hỗ trợ image)
```

**Dependencies chính:**
- `cloudinary` - Image storage
- `multer` - File upload middleware
- `multer-storage-cloudinary` - Cloudinary storage engine
- `axios` - HTTP client (call User Service)

---

## Installation & Setup

### Prerequisites

Đảm bảo đã cài đặt:
- **Node.js** v18 trở lên
- **MongoDB** (local hoặc MongoDB Atlas)
- **Redis** (local hoặc cloud)
- **RabbitMQ** (local hoặc CloudAMQP)

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd chat_app/backend
```

### Bước 2: Cài đặt dependencies cho từng service

```bash
# User Service
cd user
npm install

# Mail Service
cd ../mail
npm install

# Chat Service
cd ../chat
npm install
```

### Bước 3: Cấu hình biến môi trường

Tạo file `.env` trong mỗi thư mục service:

#### **backend/user/.env**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chat_app
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key_here
Rabbitmq_Host=localhost
Rabbitmq_Username=guest
Rabbitmq_Password=guest
```

#### **backend/mail/.env**
```env
PORT=5001
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
Rabbitmq_Host=localhost
Rabbitmq_Username=guest
Rabbitmq_Password=guest
```

**Lưu ý:** Để dùng Gmail, cần tạo [App Password](https://support.google.com/accounts/answer/185833)

#### **backend/chat/.env**
```env
PORT=5002
MONGO_URI=mongodb://localhost:27017/chat_app
Cloud_Name=your_cloudinary_name
Api_Key=your_cloudinary_api_key
Api_Secret=your_cloudinary_api_secret
USER_SERVICE_URL=http://localhost:5000
```

### Bước 4: Build TypeScript

```bash
# Build từng service
cd user && npx tsc
cd ../mail && npx tsc
cd ../chat && npx tsc
```

### Bước 5: Chạy services

Mở 3 terminal riêng biệt:

**Terminal 1 - User Service:**
```bash
cd backend/user
npm run dev
```

**Terminal 2 - Mail Service:**
```bash
cd backend/mail
npm run dev
```

**Terminal 3 - Chat Service:**
```bash
cd backend/chat
npm run dev
```

---

## Testing với Postman

### 1. Đăng nhập (Login)

**Request:**
```
POST http://localhost:5000/api/v1/login
Content-Type: application/json

{
  "email": "test@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent to your email"
}
```

### 2. Xác thực OTP

**Request:**
```
POST http://localhost:5000/api/v1/verify
Content-Type: application/json

{
  "email": "test@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Lấy profile (cần token)

**Request:**
```
GET http://localhost:5000/api/v1/me
Authorization: Bearer <your_token>
```

### 4. Tạo chat

**Request:**
```
POST http://localhost:5002/api/v1/chat/new
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "otherUserId": "user_id_here"
}
```

### 5. Gửi tin nhắn (text)

**Request:**
```
POST http://localhost:5002/api/v1/message
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

text: "Hello!"
chatId: "chat_id_here"
```

### 6. Gửi tin nhắn (với ảnh)

**Request:**
```
POST http://localhost:5002/api/v1/message
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

text: "Check this out!"
chatId: "chat_id_here"
image: [file]
```

---

## Project Structure

### User Service
```
user/
├── src/
│   ├── config/
│   │   ├── db.ts              # MongoDB connection
│   │   ├── redis.ts           # Redis client
│   │   └── rabbitmq.ts        # RabbitMQ connection
│   ├── controller/
│   │   └── user.ts            # User controllers
│   ├── middleware/
│   │   └── isAuth.ts          # JWT authentication middleware
│   ├── model/
│   │   └── User.ts            # User schema
│   ├── routes/
│   │   └── user.ts            # User routes
│   └── index.ts               # Entry point
├── .env
├── package.json
└── tsconfig.json
```

### Mail Service
```
mail/
├── src/
│   ├── consumer.ts            # RabbitMQ consumer
│   └── index.ts               # Entry point
├── .env
├── package.json
└── tsconfig.json
```

### Chat Service
```
chat/
├── src/
│   ├── config/
│   │   ├── db.ts              # MongoDB connection
│   │   └── cloudinary.ts      # Cloudinary config
│   ├── controller/
│   │   └── chat.ts            # Chat controllers
│   ├── middleware/
│   │   ├── isAuth.ts          # JWT authentication
│   │   └── multer.ts          # File upload config
│   ├── model/
│   │   ├── Chat.ts            # Chat schema
│   │   └── Message.ts         # Message schema
│   ├── routes/
│   │   └── chat.ts            # Chat routes
│   └── index.ts               # Entry point
├── .env
├── package.json
└── tsconfig.json
```

---

## Environment Variables Reference

### Required for User Service
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/chat_app` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key for JWT | `your_secret_key` |
| `Rabbitmq_Host` | RabbitMQ hostname | `localhost` |
| `Rabbitmq_Username` | RabbitMQ username | `guest` |
| `Rabbitmq_Password` | RabbitMQ password | `guest` |

### Required for Mail Service
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5001` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email address | `your_email@gmail.com` |
| `EMAIL_PASSWORD` | Email app password | `your_app_password` |
| `Rabbitmq_Host` | RabbitMQ hostname | `localhost` |
| `Rabbitmq_Username` | RabbitMQ username | `guest` |
| `Rabbitmq_Password` | RabbitMQ password | `guest` |

### Required for Chat Service
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5002` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/chat_app` |
| `Cloud_Name` | Cloudinary cloud name | `your_cloud_name` |
| `Api_Key` | Cloudinary API key | `123456789012345` |
| `Api_Secret` | Cloudinary API secret | `your_api_secret` |
| `USER_SERVICE_URL` | User service URL | `http://localhost:5000` |

---

## Troubleshooting

### Lỗi kết nối MongoDB
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Giải pháp:** Đảm bảo MongoDB đang chạy hoặc dùng MongoDB Atlas.

### Lỗi kết nối Redis
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Giải pháp:** Đảm bảo Redis đang chạy hoặc dùng Redis cloud (Upstash).

### Lỗi kết nối RabbitMQ
```
Error: ECONNRESET
```
**Giải pháp:** Kiểm tra RabbitMQ đang chạy hoặc dùng CloudAMQP.

### Lỗi upload ảnh (Cloudinary)
```
TypeError: Cannot read properties of undefined (reading 'uploader')
```
**Giải pháp:** Kiểm tra API credentials trong `.env` của Chat Service.

### Lỗi gửi email
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Giải pháp:** Dùng App Password của Gmail thay vì mật khẩu thường.

---

## Development Tips

### Hot Reload
Dùng `concurrently` để tự động build và restart khi code thay đổi:

```json
// package.json
"scripts": {
  "dev": "concurrently \"tsc -w\" \"nodemon dist/index.js\""
}
```

<!-- ### Debug với VS Code
Tạo file `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "User Service",
      "program": "${workspaceFolder}/backend/user/dist/index.js",
      "preLaunchTask": "tsc: build - backend/user/tsconfig.json",
      "outFiles": ["${workspaceFolder}/backend/user/dist/**/*.js"]
    }
  ]
}
``` -->

---

## Production Deployment

### Build for production

```bash
# Build tất cả services
cd user && npm run build
cd ../mail && npm run build
cd ../chat && npm run build
```

### Run in production

```bash
# Dùng PM2
npm install -g pm2

pm2 start backend/user/dist/index.js --name user-service
pm2 start backend/mail/dist/index.js --name mail-service
pm2 start backend/chat/dist/index.js --name chat-service

pm2 save
pm2 startup
```

---

## License

MIT

---

## Contributors

-Mỹ Uyên (@myuyen0304)

---

## Support

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub.