# Smart Classroom Manager - Project TODO

## Database & Schema
- [x] Design and implement all 5 database tables (Users, Attendance, Assignments, Submissions, Feedback)
- [x] Generate and apply Drizzle migrations
- [x] Create database helper functions in server/db.ts

## Backend API Endpoints
- [x] Attendance: mark attendance, get attendance records, calculate percentage
- [x] Assignments: create, list, get details, update, delete
- [x] Submissions: create, list, get details, update status
- [x] Feedback: create, list, get details, reply to feedback
- [x] Search and filter endpoints for assignments, attendance, feedback
- [x] CSV export endpoint for attendance reports
- [x] File upload endpoint with S3 integration
- [ ] Notification system for new submissions and feedback

## Frontend Theme & Styling
- [x] Implement dramatic cinematic color scheme (deep teal #0d3b3d, burnt orange #d97e3a)
- [x] Create blurred gradient background with teal and orange
- [x] Configure global typography (bold, centered, white sans-serif)
- [x] Add geometric accent elements in cyan and orange
- [x] Update index.css with theme variables and dark mode defaults

## Authentication & Navigation
- [x] Implement Manus OAuth login/signup
- [x] Create role-based access control (teacher/student)
- [x] Build DashboardLayout with sidebar navigation
- [x] Implement logout functionality
- [x] Create role-specific navigation items

## Dashboard
- [x] Teacher dashboard: attendance summary, pending assignments, recent feedback
- [x] Student dashboard: attendance percentage, pending assignments, recent feedback
- [x] Create summary cards for key metrics
- [x] Implement real-time data refresh

## Attendance System
- [x] Teacher: mark attendance (Present/Absent) per student, subject, date
- [x] Teacher: view attendance records with filters
- [x] Student: view own attendance records
- [x] Student: view attendance percentage
- [x] Implement attendance calculation logic

## Assignment Management
- [x] Teacher: create assignments (title, description, deadline)
- [x] Teacher: view all assignments and submissions
- [x] Teacher: download submitted files
- [x] Student: view pending assignments
- [x] Student: submit assignments (text or file upload)
- [x] Implement submission status tracking
- [x] S3 file upload integration for submissions

## Feedback & Comments
- [x] Student: submit feedback/suggestions
- [x] Teacher: view all feedback
- [x] Teacher: reply to feedback
- [x] Implement feedback threading
- [ ] Notifications for new feedback

## Search & Filter
- [x] Search assignments by title, description
- [x] Filter assignments by status, deadline, subject
- [x] Filter attendance records by date, subject, student
- [x] Filter feedback by date, student, status

## CSV Export
- [x] Generate attendance report CSV
- [x] Include student name, attendance dates, percentage
- [x] Implement download functionality

## Notifications
- [ ] Notify teacher when student submits assignment
- [ ] Notify teacher when student submits feedback
- [ ] Display notifications in UI
- [ ] Mark notifications as read

## Testing & Polish
- [x] Write vitest tests for critical backend functions
- [x] Test role-based access control
- [x] Test file upload and download flows
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Final UI polish and refinement

## Deployment
- [x] Create final checkpoint
- [ ] Deploy to Manus platform
- [x] Generate deployment instructions
- [x] Document local development setup


## New Feature: Attendance Marking Window
- [x] Add attendanceWindow table to schema (teacherId, startTime, endTime, isActive)
- [x] Create backend API to enable/disable attendance marking window
- [x] Add 5-minute auto-close logic with timestamp validation
- [x] Update attendance marking to check if window is active
- [x] Prevent non-window-owner teachers from marking attendance
- [x] Add countdown timer UI component
- [x] Update Attendance page with window status display
- [x] Add tests for attendance window validation


## GitHub Export & Deployment
- [ ] Export project to GitHub as public repo (Nitya-Choudhary/attendance-app)
- [ ] Create Vercel deployment configuration
- [ ] Set up backend deployment for full integration
- [ ] Configure environment variables for production
- [ ] Test full deployment pipeline
