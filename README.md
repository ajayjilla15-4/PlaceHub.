# 🎓 PlaceHub — College Placement & Alumni Portal

PlaceHub is a full-stack web application designed for engineering and degree colleges to streamline **campus placement drives**, **student application tracking**, and **alumni mentorship & referrals**.

Built following the **MERN Stack** (React.js, Node.js, Express.js, and MongoDB).

---

## 🛠️ Technology Stack (As Specified)

| Layer | Technology | Role & Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React.js 19** (Vite) | Responsive Single Page Application (SPA), interactive dashboards, live application status tracker, modern card-based UI. |
| **Backend** | **Node.js + Express.js** | Modular RESTful API, JWT role-based authentication, validation, filtering, and business logic. |
| **Database** | **MongoDB + Mongoose** | Document-oriented NoSQL database for flexible storage of Users, Placement Drives, Applications, and Interview Archives. Supports MongoDB Atlas and local instances. |

---

## 🚀 Key Modules & Capabilities

### 1. 💼 Campus Placement & Internship Drives
- Real-time listings for Full-Time, Summer Internships, and exclusive Alumni Referrals.
- Displays CTC Packages (e.g. `32.5 LPA`, `₹1,25,000 / mo`), minimum CGPA, eligible branches, and deadline countdown.
- **Automated CGPA Eligibility Guard**: Prevents under-criteria submissions before students apply.
- 1-Click application with immediate feedback.

### 2. 📊 Student Application Tracking (Kanban Pipeline)
- Visual 4-stage pipeline for every student:
  `Applied` ➔ `Shortlisted` ➔ `Interview Scheduled` ➔ `Selected / Offer Released`.
- Official updates and notes directly from the Training & Placement Officer (TPO).

### 3. 🤝 Alumni Mentorship & Referral Network
- Searchable alumni directory filterable by Company (Google, Microsoft, Amazon, Atlassian), Batch, and Skills.
- Interactive **Mentorship Request Modal**:
  - Request Resume Review & ATS feedback
  - Internal Job Referrals
  - 1:1 Mock Technical / System Design Interviews
  - Direct LinkedIn profile connections.

### 4. 📚 Interview Experiences & Questions Archive
- Round-by-round breakdown (Online Assessments, Technical Coding, System Design, HR).
- Preparation tips and winning strategies from placed seniors.
- Difficulty tags (`Easy`, `Medium`, `Hard`) and helpfulness upvotes.
- Contribution modal for students/alumni to share new debriefs.

### 5. 🛡️ Training & Placement Officer (TPO) Control Center
- Publish new campus drives and eligibility criteria.
- Complete applicants directory with stage changers (`Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected`).
- Real-time branch-wise placement statistics.

---

## 📂 Project Architecture

```
placehub/
├── backend/
│   ├── config/
│   │   └── db.js                 # Resilient MongoDB Mongoose connection & fallback handler
│   ├── data/
│   │   └── seedData.js           # Realistic seed data (Students, Alumni, FAANG Drives, Stats)
│   ├── middleware/
│   │   └── auth.js               # JWT authentication & role-based route guards
│   ├── models/
│   │   ├── User.js               # User model (Student, Alumni, Admin roles)
│   │   ├── Job.js                # Placement Drive / Job model
│   │   ├── Application.js        # Student Application status model
│   │   ├── Experience.js         # Interview Experience archive model
│   │   └── Mentorship.js         # Mentorship & referral request model
│   ├── .env                      # Environment configuration (PORT, MONGODB_URI, JWT_SECRET)
│   ├── .env.example
│   ├── package.json
│   ├── seed.js                   # Seeder script
│   └── server.js                 # Express server & REST API endpoints
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Header, navigation, and 1-click Role Switcher
│   │   │   ├── StatsBanner.jsx           # Live placement stats & top recruiter marquee
│   │   │   ├── JobBoard.jsx              # Searchable drives, CGPA guard, application modal
│   │   │   ├── ApplicationTracker.jsx    # Visual application stage progression
│   │   │   ├── AlumniDirectory.jsx       # Alumni cards & Mentorship request modal
│   │   │   ├── InterviewExperienceHub.jsx # Debrief archive & submission form
│   │   │   ├── AnalyticsView.jsx         # Branch-wise charts & recruiter breakdown
│   │   │   ├── AdminDashboard.jsx        # TPO management & applicant status updater
│   │   │   └── NewJobModal.jsx           # Post drive modal for TPO and Alumni
│   │   ├── services/
│   │   │   └── api.js                    # Centralized API client
│   │   ├── App.jsx                       # Main application state & routing
│   │   ├── index.css                     # Design tokens & responsive styles
│   │   └── main.jsx
│   ├── vite.config.js                    # Vite setup with `/api` proxy
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local daemon or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI)

### 2. Start the Backend API
```bash
cd backend
npm install
npm start
```
*The backend automatically starts on `http://localhost:5000`.*
*(If local MongoDB is not running, PlaceHub automatically uses its in-memory fallback state with pre-populated demo data so you can test immediately without any database setup!)*

### 3. Connect to MongoDB Atlas (Optional)
In `backend/.env`, set your connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/placehub?retryWrites=true&w=majority
```
Then run the seed script:
```bash
npm run seed
```

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The React application will open on `http://localhost:3000`.*

---

## 👥 Pre-Configured Demo Accounts

Use the **Quick Demo Switcher** in the top right navbar to switch between roles instantly:

| Role | Name | Email | Password | What You Can Do |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | Rahul Sharma | `rahul.student@college.edu` | `password123` | Apply to drives (CGPA 8.9), track applications, request mentorship from alumni, read interview tips. |
| **Alumni** | Arjun Mehta (Google) | `arjun.alumni@google.com` | `password123` | Post alumni referral jobs, receive mentorship requests, share interview experiences. |
| **TPO / Admin** | Dr. Ramesh Kulkarni | `tpo.admin@college.edu` | `password123` | Create placement drives, update applicant status (`Shortlisted` ➔ `Offer`), view placement metrics. |

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck and MongoDB connection status |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `POST` | `/api/auth/register` | Register student / alumni |
| `GET` | `/api/jobs` | Retrieve all placement & referral drives |
| `POST` | `/api/jobs` | Create placement drive (Admin / Alumni) |
| `POST` | `/api/jobs/:id/apply` | Submit job application (checks CGPA eligibility) |
| `GET` | `/api/applications/my` | Get current student's application tracking |
| `GET` | `/api/applications/all` | Get all applications (Admin) |
| `PATCH` | `/api/applications/:id/status`| Update application stage (`Shortlisted`, etc.) |
| `GET` | `/api/alumni` | Search alumni directory |
| `POST` | `/api/mentorship/request` | Submit mentorship / referral request |
| `GET` | `/api/experiences` | Fetch candidate interview archives |
| `POST` | `/api/experiences` | Post new interview experience |
| `POST` | `/api/experiences/:id/like` | Upvote an interview experience |
| `GET` | `/api/stats` | Placement analytics and department statistics |
