# JobPortal - Cổng thông tin tìm việc làm

Một ứng dụng web tìm việc làm hiện đại được xây dựng với MERN stack, tích hợp Auth0 authentication và Next.js framework.

## 🌟 Tính năng chính

### Dành cho Người tìm việc
- 🔍 Tìm kiếm công việc theo từ khóa, vị trí, lương
- 📝 Ứng tuyển công việc trực tuyến
- ❤️ Lưu công việc yêu thích
- 📊 Theo dõi trạng thái ứng tuyển

### Dành cho Nhà tuyển dụng
- ✍️ Đăng tin tuyển dụng
- 📋 Xem và quản lý công việc đã đăng
- 🔒 Xác thực bảo mật với Auth0

## 🛠 Công nghệ sử dụng

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Context API
- **Authentication**: Auth0 Next.js SDK
- **HTTP Client**: Axios
- **Form Editor**: React Quill
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.x (ES Modules)
- **Database**: MongoDB (Mongoose 9.x)
- **Authentication**: Auth0 (express-openid-connect)
- **API Style**: RESTful API

## 📁 Cấu trúc dự án

```
JobPortal/
├── client/                 # Frontend (Next.js)
│   ├── app/               # App router pages
│   │   ├── findwork/      # Trang tìm việc
│   │   ├── job/[id]/      # Chi tiết công việc
│   │   ├── myjobs/        # Quản lý công việc
│   │   └── post/          # Đăng tin tuyển dụng
│   ├── Components/        # React components
│   │   ├── JobItem/       # Job cards & items
│   │   ├── JobPost/       # Job posting forms
│   │   └── ui/            # Shadcn/ui components
│   ├── context/           # Global state management
│   ├── providers/         # Context providers
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
│
└── server/                # Backend (Express)
    ├── controllers/       # Request handlers
    ├── models/           # Mongoose schemas
    ├── routes/           # API routes
    ├── middleware/       # Custom middleware
    └── db/              # Database connection

```

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- Node.js 18.x trở lên
- MongoDB Atlas account
- Auth0 account

### 1. Clone repository

```bash
git clone https://github.com/huutrong-le/JobPortal.git
cd JobPortal
```

### 2. Cài đặt Backend

```bash
cd server
npm install
```

Tạo file `.env` trong thư mục `server/`:

```env
# Auth0 Configuration
SECRET=your_auth0_secret_key
BASE_URL=http://localhost:8000
CLIENT_ID=your_auth0_client_id
ISSUER_BASE_URL=https://your-domain.auth0.com

# MongoDB
MONGO_URI=your_mongodb_atlas_connection_string

# Client URL (for CORS)
CLIENT_URL=http://localhost:3001

# Server Port (optional)
PORT=8000
```

### 3. Cài đặt Frontend

```bash
cd ../client
npm install
```

Tạo file `.env.local` trong thư mục `client/`:

```env
# Auth0 Configuration
AUTH0_SECRET=your_auth0_secret
AUTH0_BASE_URL=http://localhost:3001
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret

# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 4. Khởi chạy ứng dụng

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
Server sẽ chạy tại: `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Client sẽ chạy tại: `http://localhost:3001`

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints
- `GET /check-auth` - Kiểm tra trạng thái đăng nhập
- Auth0 callback: Auto-syncs user to MongoDB

### Job Endpoints
- `GET /jobs` - Lấy danh sách công việc (public)
- `GET /jobs/search` - Tìm kiếm công việc (public)
- `POST /jobs` - Tạo công việc mới (protected)
- `GET /jobs/user/:id` - Lấy công việc theo user ID
- `PUT /jobs/apply/:id` - Ứng tuyển công việc
- `PUT /jobs/like/:id` - Like/unlike công việc
- `DELETE /jobs/:id` - Xóa công việc

### User Endpoints
- `GET /user/:id` - Lấy thông tin user (id là Auth0 ID)

**Note**: Tất cả protected routes yêu cầu Auth0 authentication

## 🔐 Luồng xác thực (Auth Flow)

1. User click "Login" → Redirect đến Auth0
2. Auth0 xác thực → Callback về `/`
3. Backend sync user vào MongoDB via `ensureUserInDB()`
4. Redirect về `CLIENT_URL`
5. Frontend fetch user data qua `/check-auth`

## 🗄 Data Models

### User Model
```javascript
{
  auth0Id: String (unique),
  name: String,
  email: String,
  role: ["jobseeker", "recruiter"],
  appliedJobs: [JobId],
  savedJobs: [JobId],
  resume: String,
  bio: String,
  profession: String,
  profilePicture: String
}
```

### Job Model
```javascript
{
  title: String,
  description: String,
  salary: Number,
  salaryType: String,
  jobType: [String],
  skills: [String],
  tags: [String],
  negotiable: Boolean,
  createdBy: UserId,
  applicants: [UserId],
  likes: [UserId]
}
```

## 🎨 UI Components

Dự án sử dụng **Shadcn/ui** components với Radix UI:
- Badge, Button, Card
- Checkbox, Dropdown Menu
- Input, Label, Select
- Separator, Slider

## 🔧 Scripts

### Client
```bash
npm run dev    # Chạy dev server (port 3001)
npm run build  # Build production
npm start      # Chạy production server
```

### Server
```bash
npm start      # Chạy với nodemon (auto-reload)
```

## 📝 Quy tắc Code

### ES Modules
- Tất cả files sử dụng `import/export` syntax
- File extensions bắt buộc: `import User from "./models/UserModel.js"`

### Route Auto-Discovery
- Routes tự động import từ `server/routes/`
- Tất cả route files phải `export default router`
- Auto-prefix: `/api/v1/`

### Error Handling
- Controllers dùng `express-async-handler`
- Return structured errors: `res.status(400).json({ message: "..." })`

## 🌐 Deployment

### Backend (Vercel/Railway)
1. Set environment variables
2. Deploy từ `server/` directory
3. Cập nhật `BASE_URL` và `CLIENT_URL`

### Frontend (Vercel)
1. Deploy từ `client/` directory
2. Cập nhật `NEXT_PUBLIC_API_URL`
3. Cấu hình Auth0 callback URLs

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng:
1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phân phối theo giấy phép ISC.

## 👨‍💻 Tác giả

**Huu Trong Le**
- GitHub: [@huutrong-le](https://github.com/huutrong-le)

## 📞 Liên hệ

Nếu bạn có bất kỳ câu hỏi nào, vui lòng tạo issue trong repository.

---

⭐ Nếu bạn thấy dự án hữu ích, hãy cho một star nhé!
