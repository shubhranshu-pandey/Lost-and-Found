# 🔍 Lost & Found Portal

A comprehensive web application for managing lost and found items with an approval workflow system. This project demonstrates a full-stack web application built with modern technologies including Node.js, Express, React, and SQLite.

## 🎯 **What is this Project?**

This is a **Lost & Found Portal** - a web-based system that allows users to:
- **Report lost items** - Submit detailed descriptions of lost belongings
- **Report found items** - Help return found items to their rightful owners
- **Browse listings** - Search through all submitted items
- **Claim items** - Securely claim items that belong to you
- **Moderate content** - Admin panel for approving/rejecting submissions

### **Key Features:**
- 🔐 **Approval Workflow** - All submissions must be approved by moderators
- 🛡️ **Secure Access** - Protected moderator dashboard with authentication
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔄 **Real-time Updates** - Instant status changes and notifications
- 📊 **Status Tracking** - Items progress through: Pending → Approved → Claimed

## ✨ Features

### 🔐 Approval Workflow
- **Moderated Submissions**: All items must be approved by moderators before going public
- **Status Management**: Items progress through states: Pending → Approved → Claimed
- **Quality Control**: Ensures safe and appropriate content
- **Secure Login**: Moderator authentication system with credentials

### 📱 User Features
- **Submit Items**: Report lost or found items with detailed information
- **Browse Listings**: View approved items with search and filtering
- **Claim Items**: Secure claiming system with verification
- **Real-time Updates**: Instant status changes and notifications

### 🛡️ Moderator Dashboard
- **Secure Access**: Login required with admin credentials
- **Review Queue**: See all pending submissions
- **Quick Actions**: Approve/reject items with one click
- **Statistics**: Overview of system activity
- **Detailed View**: Full item information for informed decisions

### 🎨 Modern UI/UX
- **Responsive Design**: Works on all devices
- **Intuitive Interface**: Easy navigation and clear actions
- **Visual Feedback**: Status badges, icons, and notifications
- **Accessibility**: Screen reader friendly and keyboard navigable

## 🚀 **How to Start This Project**

### **Prerequisites**
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

### **Step-by-Step Setup**

#### **1. Clone the Repository**
```bash
git clone https://github.com/shubhranshu-pandey/Lost-and-Found.git
cd Lost-and-Found
```

#### **2. Install All Dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

#### **3. Start the Backend Server**
```bash
# In the root directory
npm start
# OR
node server.js
```
**Backend will run on:** http://localhost:5001

#### **4. Start the Frontend (New Terminal)**
```bash
# In a new terminal window, navigate to client directory
cd client
npm start
```
**Frontend will run on:** http://localhost:3000

#### **5. Access Your Application**
- **Main App**: http://localhost:3000
- **Backend API**: http://localhost:5001

### **Login Credentials (for Moderator Access)**
- **Username**: `admin`
- **Password**: `group13`

### **Alternative: Use the Combined Script**
```bash
# Install all dependencies at once
npm run install-all

# Start both backend and frontend
npm run dev
```

## 🏗️ Architecture

### Backend (Node.js + Express)
- **RESTful API**: Full CRUD operations for items
- **SQLite Database**: Lightweight, file-based database
- **Middleware**: CORS, body parsing, validation
- **Workflow Engine**: Status management and transitions

### Frontend (React)
- **Component-based**: Modular, reusable components
- **State Management**: React hooks for local state
- **Routing**: React Router for navigation
- **Styling**: CSS modules with modern design system

### Database Schema
```sql
-- Items table
CREATE TABLE items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,           -- 'lost' or 'found'
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  date TEXT,
  contact TEXT,
  status TEXT DEFAULT 'pending_approval',
  claimant_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users table (simplified)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user'      -- 'user' or 'moderator'
);
```

## 📋 API Endpoints

### Items
- `GET /api/items` - List items with filtering
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PATCH /api/items/:id/status` - Update item status
- `POST /api/items/:id/claim` - Claim an item

### Moderator
- `GET /api/moderator/pending` - Get pending items
- `GET /api/moderator/stats` - Get system statistics

## 🔄 Workflow States

1. **Pending Approval** (`pending_approval`)
   - Newly submitted items
   - Awaiting moderator review
   - Not visible to public

2. **Approved** (`approved`)
   - Moderator approved
   - Visible in public listings
   - Available for claiming

3. **Claimed** (`claimed`)
   - Item has been claimed
   - Owner notified
   - No longer available

4. **Rejected** (`rejected`)
   - Moderator rejected
   - Not visible to public
   - Submitter notified

## 🎯 **Use Cases**

### **For Users**
- **Lost Item**: Submit detailed description, wait for approval, monitor for claims
- **Found Item**: Report found item, provide contact info, help reunite with owner
- **Browse Items**: Search through all listings, claim if found

### **For Moderators**
- **Review Submissions**: Check new items for appropriateness and completeness
- **Approve/Reject**: Make decisions based on content quality and safety
- **Monitor System**: Track statistics and system health

## 🎓 **What This Project Demonstrates**

### **Full-Stack Development Skills**
- **Backend Development**: Node.js, Express.js, RESTful APIs
- **Frontend Development**: React.js, modern UI/UX, responsive design
- **Database Design**: SQLite schema design and management
- **Authentication**: Role-based access control and security

### **Software Engineering Concepts**
- **Workflow Management**: Approval processes and status transitions
- **State Management**: React hooks and component state
- **API Design**: RESTful endpoints with proper HTTP methods
- **Error Handling**: Comprehensive error management and user feedback

### **Modern Web Technologies**
- **Component Architecture**: Modular, reusable React components
- **CSS Grid & Flexbox**: Modern layout techniques
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Dynamic content updates and notifications

### **Project Management**
- **Version Control**: Git workflow and collaboration
- **Documentation**: Comprehensive README and code comments
- **Testing**: API testing and component validation
- **Deployment**: Production-ready configuration

## 🛠️ Development

### Project Structure
```
lost-found-portal/
├── server.js                 # Express server entry point
├── package.json             # Backend dependencies
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # React entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

### Key Components
- **HomePage**: Landing page with features and quick actions
- **SubmitItem**: Form for submitting lost/found items
- **ItemList**: Browse and filter approved items
- **ModeratorDashboard**: Admin interface for item management

### Styling
- **CSS Variables**: Consistent color scheme and spacing
- **Responsive Grid**: Mobile-first design approach
- **Component CSS**: Scoped styles for each component
- **Modern UI**: Cards, shadows, and smooth transitions

## 🔧 **Configuration**

### **Environment Variables**
```bash
PORT=5001                    # Backend port (updated from 5000)
NODE_ENV=development         # Environment mode
```

## 🚨 **Troubleshooting Common Issues**

### **Port Already in Use**
If you get "address already in use" errors:
```bash
# Check what's using the port
lsof -i :5001
lsof -i :3000

# Kill processes using the ports
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### **Dependencies Not Found**
If you get module not found errors:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# For frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

### **Database Issues**
If the database isn't working:
```bash
# Remove and recreate database
rm lostfound.db
node server.js  # This will recreate the database
```

### **React App Won't Start**
If the frontend has compilation errors:
```bash
cd client
npm start
# Check the error messages in the terminal
```

### Database
- **SQLite**: Automatically created on first run
- **Location**: `./lostfound.db` in project root
- **Backup**: Consider backing up this file in production

---

**This is a project/Assignment for Infinite Locus by Group 13**
**Thank You for the opportunity**
