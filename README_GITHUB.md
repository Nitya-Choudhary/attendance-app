# Smart Classroom Manager - Attendance App

A full-stack web application for classroom management with attendance monitoring, assignment management, and feedback collection. Built with React, Node.js, and MySQL.

**Live Demo:** https://attendance-app.vercel.app  
**GitHub Repository:** https://github.com/Nitya-Choudhary/attendance-app

---

## 🎯 Features

### Core Features
- ✅ **Role-Based Authentication** - Teachers (admin) and Students (user) with Manus OAuth
- ✅ **Attendance System** - Mark attendance, track percentage, export CSV reports
- ✅ **Assignment Management** - Create assignments, students submit with file upload
- ✅ **Feedback Module** - Students submit feedback, teachers reply
- ✅ **Dashboard** - Real-time summary cards and metrics
- ✅ **Search & Filter** - Find assignments, attendance records, and feedback
- ✅ **File Upload** - Secure S3-backed file storage for submissions

### Advanced Features
- 🎬 **Dramatic Cinematic UI** - Deep teal and burnt orange color scheme
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- ⏱️ **Attendance Marking Window** - 5-minute global window for marking attendance
- 📊 **CSV Export** - Download attendance reports
- 🔔 **Notifications** - Real-time alerts for submissions and feedback
- 🎨 **Modern Design** - Tailwind CSS with custom cinematic theme

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- MySQL/TiDB database
- Manus OAuth credentials

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Nitya-Choudhary/attendance-app.git
cd attendance-app
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**
```bash
# Copy example file
cp .env.example .env

# Edit .env with your credentials
# See ENV_SETUP.md for detailed instructions
```

4. **Start development server**
```bash
pnpm dev
```

5. **Open in browser**
```
http://localhost:3000
```

---

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (Already done ✅)
```bash
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import this GitHub repository
   - Add environment variables (see [ENV_SETUP.md](./ENV_SETUP.md))
   - Click "Deploy"

3. **Your app is live!**
```
https://attendance-app.vercel.app
```

### Detailed Deployment Guides
- [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md) - GitHub to Vercel setup
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Complete Vercel guide
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables configuration

---

## 📋 Project Structure

```
attendance-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities (tRPC client)
│   │   ├── contexts/      # React contexts
│   │   └── index.css      # Global styles
│   └── public/            # Static files
├── server/                # Express backend
│   ├── routers.ts         # tRPC API endpoints
│   ├── db.ts              # Database queries
│   └── _core/             # Framework setup
├── drizzle/               # Database schema & migrations
│   ├── schema.ts          # Table definitions
│   └── migrations/        # SQL migrations
├── storage/               # S3 file storage helpers
├── shared/                # Shared types & constants
├── package.json           # Dependencies
├── vercel.json            # Vercel configuration
└── README.md              # This file
```

---

## 🗄️ Database Schema

### Tables
- **users** - User accounts with roles (teacher/student)
- **attendance** - Attendance records per student, subject, date
- **assignments** - Assignments created by teachers
- **submissions** - Student submissions with file uploads
- **feedback** - Student feedback and teacher replies
- **attendanceWindow** - 5-minute attendance marking windows

---

## 🔌 API Endpoints

### Authentication
- `POST /api/trpc/auth.me` - Get current user
- `POST /api/trpc/auth.logout` - Logout user

### Attendance
- `POST /api/trpc/attendance.markAttendance` - Mark attendance
- `GET /api/trpc/attendance.getStudentAttendance` - Get student records
- `GET /api/trpc/attendance.getAttendanceRecords` - Get all records (teacher)
- `GET /api/trpc/attendance.calculatePercentage` - Calculate percentage
- `GET /api/trpc/attendance.exportCSV` - Export CSV report
- `POST /api/trpc/attendance.enableWindow` - Enable 5-min window
- `POST /api/trpc/attendance.disableWindow` - Disable window
- `GET /api/trpc/attendance.getWindowStatus` - Get window status

### Assignments
- `POST /api/trpc/assignments.create` - Create assignment
- `GET /api/trpc/assignments.list` - List assignments
- `GET /api/trpc/assignments.getById` - Get assignment details
- `PUT /api/trpc/assignments.update` - Update assignment
- `DELETE /api/trpc/assignments.delete` - Delete assignment

### Submissions
- `POST /api/trpc/submissions.submit` - Submit assignment
- `GET /api/trpc/submissions.list` - List submissions
- `GET /api/trpc/submissions.getById` - Get submission details
- `PUT /api/trpc/submissions.updateStatus` - Update status

### Feedback
- `POST /api/trpc/feedback.submit` - Submit feedback
- `GET /api/trpc/feedback.list` - List feedback
- `GET /api/trpc/feedback.getById` - Get feedback details
- `POST /api/trpc/feedback.reply` - Reply to feedback

---

## 🎨 Design System

### Color Scheme
- **Primary (Deep Teal):** `#0d3b3d`
- **Secondary (Burnt Orange):** `#d97e3a`
- **Accent (Cyan):** `#00d9ff`
- **Background:** Dark with gradient overlay
- **Text:** White with gray accents

### Typography
- **Font:** Inter (sans-serif)
- **Headings:** Bold, centered, white
- **Body:** Regular, gray-300
- **Accents:** Geometric elements in cyan/orange

---

## 🔐 Security Features

- **Manus OAuth** - Secure authentication
- **Role-Based Access Control** - Teacher/student permissions
- **S3 File Storage** - Secure file uploads
- **JWT Sessions** - Signed session cookies
- **Database Encryption** - Sensitive data protection
- **HTTPS Only** - Secure connections

---

## 📊 Tech Stack

### Frontend
- **React 19** - UI framework
- **Tailwind CSS 4** - Styling
- **tRPC** - Type-safe API client
- **Vite** - Build tool
- **Wouter** - Routing

### Backend
- **Express 4** - Web server
- **tRPC 11** - RPC framework
- **Drizzle ORM** - Database ORM
- **MySQL 2** - Database driver

### Infrastructure
- **Vercel** - Hosting
- **MySQL/TiDB** - Database
- **S3** - File storage
- **Manus OAuth** - Authentication

---

## 🧪 Testing

### Run Tests
```bash
pnpm test
```

### Test Coverage
- Attendance window feature (15 tests)
- Authentication and logout (1 test)
- Core features (17 tests)
- **Total:** 33 tests passing

---

## 📚 Documentation

- [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md) - GitHub to Vercel deployment
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Vercel setup and configuration
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Local deployment instructions
- [QUICKSTART.md](./QUICKSTART.md) - 5-minute getting started guide

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Database Connection Error
- Check `DATABASE_URL` in environment
- Verify database is running
- Check firewall settings

### OAuth Not Working
- Verify `VITE_APP_ID` is correct
- Update redirect URI in Manus Dashboard
- Clear browser cookies

### File Upload Fails
- Check S3 credentials
- Verify `BUILT_IN_FORGE_API_KEY`
- Check file size limits

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Support

- **Issues:** [GitHub Issues](https://github.com/Nitya-Choudhary/attendance-app/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Nitya-Choudhary/attendance-app/discussions)
- **Manus Help:** [help.manus.im](https://help.manus.im)

---

## 🎉 Getting Started

Ready to deploy? Follow these steps:

1. **Read** [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md)
2. **Configure** environment variables from [ENV_SETUP.md](./ENV_SETUP.md)
3. **Deploy** to Vercel in 5 minutes
4. **Test** all features
5. **Share** with your classroom! 🎓

---

**Built with ❤️ using React, Node.js, and Manus**

**Last Updated:** April 23, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
