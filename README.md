# Task Management System

A complete backend system developed using Node.js, Express.js, and MongoDB, fulfilling the requirements for the "Node.js Backend System" assignment.

## 🚀 Overview

This project is a RESTful API backend for a Task Management System. It includes User Management (Auth/Roles), Task Management (CRUD), and Admin features. It is designed to be consumed by any frontend (React frontend included in the `frontend/` folder).

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT & Bcrypt based
- **Security**: Rate Limiting, CORS, Password Hashing

## ✨ Features

### 3.1 User Management
- **Registration**: Users can sign up. First user registered as 'Admin' is restricted (or handled logically).
- **Login**: JWT-based authentication.
- **Roles**: Admin and Standard User roles supported.
- **Security Question**: For password reset functionality.

### 3.2 CRUD Operations
- **Tasks**: Create, Read (My Tasks/All Tasks), Update (Complete/Excuse), Delete (Admin).
- **Users**: Admin can View, Create, and Delete users.

### 3.3 API Design
- **RESTful Architecture**: Clean resource-based URLs.
- **HTTP Methods**: GET, POST, PUT, DELETE used appropriately.
- **Status Codes**: Returns 200, 201, 400, 401, 403, 404, 500.

### 3.4 Error Handling
- **Centralized**: Global error handling middleware.
- **Validation**: Input validation in controllers.

## 📂 Folder Structure

```
Project/
├── config/         # Database configuration
├── controller/     # Business logic
├── middleware/     # Auth, Error Handling, Rate Limiting
├── model/          # Mongoose Schemas
├── routes/         # API Routes definition
├── server.js       # App entry point
└── .env            # Environment variables
```

## 🚀 Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd Project
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    - Create a `.env` file in the root directory.
    - Copy the contents from `.env.example`.
    - Fill in your MongoDB URI and JWT Secret.

4.  **Run the Server**
    ```bash
    npm start
    # or for dev
    npm run dev
    ```

5.  **API Endpoints**
    - `POST /api/auth/register` - Register a new user
    - `POST /api/auth/login` - Login
    - `GET /api/tasks` - Get user tasks
    - `POST /api/tasks` - Create a task
    - `PUT /api/tasks/:id/complete` - Complete a task

## 👤 Author
---
## Group Info
*GROUP G
*Class CA222
*Abdisalam Ahmed Ali
*Abdirisak Hassan Elmi
*MohamedAmin Abdirisak
*AbdiAziiz Ali jim'ale
*Abdibasid Mohamed Ali
