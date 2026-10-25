# PlaceHub — College Placement & Alumni Portal

PlaceHub is a web application designed to connect college students, alumni, and administrators through a centralized placement and alumni portal.

## Features

* Job Board for exploring job and placement opportunities.
* Alumni Directory for browsing alumni profiles.
* Application Tracker for tracking job applications.
* Interview Experience Hub for interview preparation.
* Mentorship features for connecting students and alumni.
* Analytics Dashboard for viewing placement-related statistics.
* Admin Dashboard for managing portal activities.

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* JWT authentication

## Project Structure

```text
placehub/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── config/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

* Node.js and npm
* MongoDB, running locally or hosted remotely

### 1. Start the Backend

Open a terminal in the project directory and run:

```bash
cd backend
npm install
```

Configure the environment variables using `backend/.env.example` as a reference. Create a local `.env` file with your configuration and a secure JWT secret.

Start the backend using the appropriate script in `backend/package.json`.

### 2. Start the Frontend

Open a second terminal in the project directory and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local address displayed in the terminal.

## Environment Variables

The backend uses the following environment variables:

* `PORT`
* `MONGODB_URI`
* `JWT_SECRET`
* `NODE_ENV`

Never upload real environment files, database credentials, or private secrets to GitHub.

## Project Objective

PlaceHub aims to simplify the college placement process by providing students with access to job opportunities, alumni connections, application tracking, mentorship, and interview preparation resources.

## Academic Project

Developed as an academic project to demonstrate full-stack web development using React, TypeScript, Node.js, Express.js, and MongoDB.
