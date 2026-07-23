# Task Management System

**Assessment Title:** Software Engineer Intern Assessment  
**Company:** Vampior Designs  
**Developer:** Bhagya Kumarasinghe  

A full-stack web application designed to help users efficiently manage projects and associated tasks with dynamic progress tracking and statistics.

---

## 🚀 Key Modules & Features

### 1. Authentication Module
* **User Registration:** New users can sign up with validated required fields.
* **User Login:** Secure JWT/session-based authentication.
* **Route Protection:** Restricted access to application modules for unauthenticated users.

### 2. Project Management Module
* **Full CRUD Operations:** Create, view, update, and delete projects.
* **Project Status Tracking:** Categorize projects into `Active`, `Completed`, or `On Hold`.

### 3. Task Management Module
* **Task Assignment:** Create and assign tasks under specific projects to team members.
* **Priority & Status Management:**
  * **Priority:** `Low`, `Medium`, `High`
  * **Status:** `Pending`, `In Progress`, `Completed`
* **Due Dates:** Set clear deadlines for tracking overdue tasks.

### 4. Dashboard Module
* **Real-time Overview:** Instant visual stats showing:
  * Total Tasks
  * Pending Tasks
  * Completed Tasks
  * Overdue Tasks

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Axios, Vite
* **Backend:** PHP / Laravel
* **Database:** MySQL

---

## 📁 Repository Structure

```text
task-management-system-a/
├── database/                    # MySQL Database Schema (.sql)
│   └── schema.sql
├── screenshots/                 # System Screenshots (.png)
├── task-management-backend/     # Laravel API Backend
├── task-management-frontend/    # React Frontend Application
└── README.md                    # Documentation
```

---

## ⚙️ Local Setup Instructions

### Prerequisites

- PHP >= 8.x & Composer
- Node.js & npm
- MySQL Server (e.g., via MySQL Workbench or XAMPP)

### 1. Database Setup

Open MySQL Workbench and create a new database:

```sql
CREATE DATABASE task_management_db;
```

Import the database schema from `database/schema.sql`.

### 2. Backend Setup (Laravel)

```bash
cd task-management-backend
composer install
cp .env.example .env
```

Configure `.env` with your database credentials:

```env
DB_DATABASE=task_management_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

Then run:

```bash
php artisan key:generate
php artisan migrate
php artisan serve
```

Backend API will run on:

```text
http://127.0.0.1:8000
```

### 3. Frontend Setup (React)

```bash
cd task-management-frontend
npm install
npm run dev
```

Frontend app will run on:

```text
http://localhost:5173
```
---

## 📸 Screenshots & Video Demonstration

### 📸 Screenshots
System screenshots are available in the `screenshots/` directory:
- **Authentication:** Login and Registration screens
- **Dashboard:** Dynamic task statistics overview
- **Projects:** Project creation and management view
- **Tasks:** Task assignment, priority, and status update options
- **Database:** MySQL Workbench exported schemas and tables

### 📹 Video Demo
* **Video Demonstration Link:** [https://drive.google.com/drive/folders/1KXUREHFpK_36iWnyYC8LIpGKPAxxCLop?usp=sharing]