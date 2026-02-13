# How to Run Lost & Found Portal

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Quick Start

### Option 1: Standard Setup (Recommended)

1. **Install Backend Dependencies**

   ```bash
   cd Lost-and-Found
   npm install
   ```

2. **Install Frontend Dependencies**

   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Start Backend Server**

   ```bash
   node server-jwt.js
   ```

   Backend will run on: http://localhost:5001

4. **Start Frontend (Open New Terminal)**

   ```bash
   cd Lost-and-Found/client
   npm start
   ```

   Frontend will run on: http://localhost:3000

5. **Access the Application**
   - Open browser: http://localhost:3000
   - Moderator Login: username: `admin`, password: `admin123`

---

### Option 2: Docker Setup (Port 5002)

1. **Build and Run with Docker Compose**

   ```bash
   cd Lost-and-Found
   docker-compose up --build -d
   ```

2. **Access the Application**
   - Application: http://localhost:5002
   - Moderator Login: username: `admin`, password: `admin123`

3. **View Logs**

   ```bash
   docker-compose logs -f
   ```

4. **Stop Docker Containers**
   ```bash
   docker-compose down
   ```

**📘 For production deployment on a server, see [DEPLOYMENT.md](DEPLOYMENT.md)**

---

## Project Structure

```
Lost-and-Found/
├── server-jwt.js           # Backend server with JWT authentication
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # API utilities
│   │   └── App.js         # Main app
│   └── package.json
├── lostfound.db           # SQLite database
├── package.json           # Backend dependencies
└── Dockerfile             # Docker configuration
```

---

## Default Credentials

**Moderator Login:**

- Username: `admin`
- Password: `admin123`

**User Accounts:**

- Users can sign up through the application

---

## Features

- ✅ User registration and login
- ✅ Submit lost/found items
- ✅ Browse approved items
- ✅ Claim items
- ✅ Moderator dashboard
- ✅ Approve/reject items and claims
- ✅ JWT authentication
- ✅ Modern black & white UI

---

## Troubleshooting

**Port Already in Use:**

```bash
# Kill process on port 5001 (Backend)
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000 (Frontend)
lsof -ti:3000 | xargs kill -9
```

**Database Issues:**

- Delete `lostfound.db` and restart the server
- A new database will be created automatically

**Module Not Found:**

```bash
# Reinstall dependencies
npm install
cd client && npm install
```

---

## Tech Stack

- **Backend:** Node.js, Express.js, SQLite, JWT, bcrypt
- **Frontend:** React 18, React Router, Axios, React Icons
- **Styling:** Custom CSS with modern design system

---

## Made with ❤️ by Shubhranshu Pandey
