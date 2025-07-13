# EA User Login System

A full-stack user authentication system with login, registration, and OTP verification features. Built with React (frontend) and Node.js/Express (backend), using Supabase as the database and authentication provider.

Note that the documentation of the design and implementation of this project is available in the [ShijieGan-DesignDocumentation.pdf](./ShijieGan-DesignDocumentation.pdf) file. The pdf document provides a comprehensive overview of the system design with sequence diagrams, database schema, and detailed explanations of the implementation, especially focusing on the security aspects of the user login system.

## Table of Contents
- [EA User Login System](#ea-user-login-system)
  - [Table of Contents](#table-of-contents)
  - [Author](#author)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
    - [1. Extract the Project Files](#1-extract-the-project-files)
    - [2. Backend Setup](#2-backend-setup)
    - [3. Frontend Setup](#3-frontend-setup)
    - [4. Environment Configuration](#4-environment-configuration)
    - [5. Database Setup](#5-database-setup)
  - [Running the Application](#running-the-application)
    - [Development Mode](#development-mode)
  - [Testing](#testing)
    - [Manual Testing](#manual-testing)
    - [Unit Tests](#unit-tests)
  - [Project Structure](#project-structure)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)

## Author

- Shijie Gan
- shijiegan.gs@gmail.com

## Features

- User registration and login
- Email-based OTP verification
- JWT token-based authentication
- Password encryption with bcrypt
- Modern React UI with TypeScript
- RESTful API with Express.js
- Comprehensive test coverage
- Error handling and validation

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for development and building
- **React Router DOM** for navigation
- **React Hook Form** with Yup validation
- **React OTP Input** for verification
- **React Icons** for UI icons

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Supabase** for database and authentication
- **JWT** for token management
- **bcrypt** for password hashing
- **Jest** for testing

## Prerequisites

Before running this project locally, make sure you have the following installed:

- **Node.js** (download latest version of 22.17.0 if you face issues)
- **npm** package manager (I'm using version 11.4.2)
- **File extraction software** (to extract the provided zip file)

**Note:** A Supabase account is only needed if you want to use your own database instead of the pre-configured one.

## Installation & Setup

### 1. Extract the Project Files

Extract the provided zip file to your desired location and navigate to the project directory:

```bash
# After extracting the zip file
cd ea-user-login
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

### 4. Environment Configuration

The project comes pre-configured with all necessary environment variables in the `.env` file located in the `backend` directory. No additional configuration is required - the application is ready to run with the provided settings.

**Important Note:** This `.env` file is included in the provided zip file for convenience. If you were to clone or download this project from GitHub instead, the `.env` file would not be available (as environment files are excluded from version control for security reasons), and you would need to create your own `.env` file with the appropriate configuration.

**Note:** The included configuration uses a pre-configured Supabase project and JWT settings. If you need to use your own Supabase project, you can modify the `.env` file in the `backend` directory with your own credentials:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=4000
CORS_ORIGIN=5173
```

### 5. Database Setup

The application is pre-configured to work with the included Supabase project. The database tables and configuration are already set up and ready to use.

## Running the Application

### Development Mode

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:4000`

2. **Start the Frontend Development Server:**

   While the backend server is running, open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## Testing

### Manual Testing

To do manual testing, you can use the application in your browser:
1. Open your browser and navigate to `http://localhost:5173` for the frontend.
2. Use the provided UI to register, log in, and test the OTP verification flow.

Please refer to [ShijieGan-DesignDocumentation](./ShijieGan-DesignDocumentation.pdf) Section 7: Step-by-Step Guidelines & Snapshots for detailed instructions on how to navigate through the application and test its features.

### Unit Tests

To run the unit tests for the backend, navigate to the backend directory and run:

```bash
cd backend
npm test
```

To run tests with coverage:

```bash
npm test -- --coverage
```

## 📁 Project Structure

```
ea-user-login/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── dao/            # Data Access Objects
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── tests/              # Test files
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Routing configuration
│   │   ├── services/       # API services
│   │   ├── styles/         # CSS files
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   - Change the PORT in your `.env` file
   - Kill the process using the port: `taskkill /f /im node.exe` (Windows)

2. **Supabase connection issues:**
   - Verify your SUPABASE_URL and SUPABASE_KEY are correct
   - Check if your Supabase project is active

3. **CORS errors:**
   - Ensure the CORS_ORIGIN in your backend `.env` matches your frontend port
   - Check that both servers are running

4. **npm install errors:**
   - Ensure you have the recommended Node.js version (22.17.0)
   - Ensure you have the recommended npm version (11.4.2)
   - Delete `node_modules` and `package-lock.json`, then run `npm install` again

---

See the [ShijieGan-DesignDocumentation.pdf](./ShijieGan-DesignDocumentation.pdf) for more detailed information on the design and implementation of this project, including sequence diagrams, database schema, and security considerations.
