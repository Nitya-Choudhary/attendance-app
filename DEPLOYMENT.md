# Smart Classroom Manager - Deployment & Setup Guide

## Overview

Smart Classroom Manager is a full-stack web application for managing classroom attendance, assignments, and feedback. It features a dramatic cinematic UI with deep teal and burnt orange aesthetics, built with React, Express, tRPC, and MySQL.

## Technology Stack

- **Frontend:** React 19, Tailwind CSS 4, tRPC Client
- **Backend:** Express 4, tRPC 11, Drizzle ORM
- **Database:** MySQL with 5 core tables
- **Authentication:** Manus OAuth
- **File Storage:** S3-backed storage for submissions
- **Testing:** Vitest

## Features

✅ **Authentication**
- Manus OAuth login/signup
- Role-based access (Teacher/Student)
- Secure session management

✅ **Attendance System**
- Teachers mark attendance (Present/Absent)
- Students view their attendance records
- Attendance percentage calculation
- CSV export for attendance reports

✅ **Assignment Management**
- Teachers create assignments with deadlines
- Students submit assignments (text or file upload)
- S3-backed file storage for submissions
- Submission status tracking

✅ **Feedback Module**
- Students submit feedback/suggestions
- Teachers view and reply to feedback
- Feedback threading support

✅ **Search & Filter**
- Search assignments by title/description
- Filter by subject, status, deadline
- Filter attendance by date, subject, student
- Filter feedback by status, date

✅ **UI/UX**
- Dramatic cinematic theme (deep teal #0d3b3d, burnt orange #d97e3a)
- Responsive design with DashboardLayout
- Mobile-first approach
- Dark mode with blurred gradients

## Local Development Setup

### Prerequisites

- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL database
- Manus OAuth credentials

### Installation Steps

1. **Clone the repository**
```bash
cd /home/ubuntu/smart-classroom-manager
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file with:
```env
DATABASE_URL=mysql://user:password@localhost:3306/smart_classroom
JWT_SECRET=your-secret-key
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

4. **Initialize the database**
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

5. **Start the development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
smart-classroom-manager/
├── client/
│   ├── src/
│   │   ├── pages/          # Page components (Home, Dashboard, Attendance, etc.)
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/            # tRPC client setup
│   │   ├── App.tsx         # Main app with routing
│   │   └── index.css       # Global styles with cinematic theme
│   └── public/             # Static assets
├── server/
│   ├── routers.ts          # tRPC procedure definitions
│   ├── db.ts               # Database query helpers
│   └── _core/              # Framework plumbing
├── drizzle/
│   ├── schema.ts           # Database schema
│   └── migrations/         # SQL migrations
├── storage/                # S3 storage helpers
├── shared/                 # Shared types and constants
└── package.json            # Dependencies and scripts
```

## Database Schema

### Users
- id (Primary Key)
- openId (Manus OAuth identifier)
- name, email
- role (admin/user)
- createdAt, updatedAt, lastSignedIn

### Attendance
- id, studentId, subject
- status (present/absent)
- date, createdAt

### Assignments
- id, title, description, subject
- deadline, createdAt, updatedAt

### Submissions
- id, assignmentId, studentId
- submissionText, fileUrl, status
- createdAt, updatedAt

### Feedback
- id, studentId, subject, message
- reply, status (pending/replied)
- createdAt, updatedAt

## API Endpoints

All endpoints are tRPC procedures under `/api/trpc`:

### Attendance
- `attendance.markAttendance` - Mark student attendance
- `attendance.getAttendanceRecords` - Get attendance records
- `attendance.getStudentAttendance` - Get student's attendance
- `attendance.calculatePercentage` - Calculate attendance %
- `attendance.exportCSV` - Export attendance as CSV

### Assignments
- `assignments.create` - Create new assignment
- `assignments.list` - List all assignments
- `assignments.get` - Get assignment details

### Submissions
- `submissions.submit` - Submit assignment
- `submissions.list` - List submissions
- `submissions.get` - Get submission details

### Feedback
- `feedback.submit` - Submit feedback
- `feedback.list` - List feedback
- `feedback.reply` - Reply to feedback

### Dashboard
- `dashboard.getTeacherSummary` - Teacher dashboard data
- `dashboard.getStudentSummary` - Student dashboard data

## Deployment to Manus

1. **Create a checkpoint**
```bash
# Already created: manus-webdev://01e9dc13
```

2. **Click Publish in Management UI**
   - Open the project in Manus
   - Click the "Publish" button in the top-right
   - Follow the deployment wizard

3. **Access your deployed app**
   - Your app will be available at: `https://your-project.manus.space`
   - Custom domain support available in Settings

## Testing

Run the test suite:
```bash
pnpm test
```

Tests include:
- Role-based access control
- Attendance calculation logic
- Search and filter functionality
- Data validation
- User context management

## Performance Optimization

- Lazy load pages with React Router
- Optimize images and assets
- Use S3 for file storage (not local)
- Implement query caching with tRPC
- Database query optimization with indexes

## Security Considerations

✅ **Implemented:**
- Manus OAuth for secure authentication
- Role-based access control (RBAC)
- Protected tRPC procedures
- Secure session cookies
- S3-backed file storage (no local files)

⚠️ **Best Practices:**
- Never commit `.env` files
- Rotate JWT secrets regularly
- Use HTTPS in production
- Validate all user inputs
- Keep dependencies updated

## Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
mysql -u root -p

# Verify DATABASE_URL in .env
# Format: mysql://user:password@host:port/database
```

### OAuth Login Not Working
- Verify VITE_APP_ID is correct
- Check OAUTH_SERVER_URL is accessible
- Ensure redirect URL matches Manus OAuth settings

### File Upload Issues
- Verify S3 credentials are set
- Check file size limits
- Ensure CORS is configured for S3

## Support & Documentation

- **Manus Documentation:** https://help.manus.im
- **tRPC Documentation:** https://trpc.io
- **Tailwind CSS:** https://tailwindcss.com
- **React Documentation:** https://react.dev

## License

MIT

## Version

**Smart Classroom Manager v1.0**
- Checkpoint: 01e9dc13
- Last Updated: April 23, 2026
