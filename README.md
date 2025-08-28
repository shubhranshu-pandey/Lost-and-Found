# 🔍 Lost & Found Portal

A comprehensive web application for managing lost and found items with an approval workflow system. Built with Node.js, Express, React, and SQLite.

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

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Login Credentials
- **Username**: `admin`
- **Password**: `group13`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lost-found-portal
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Backend API: http://localhost:5000
   - Frontend: http://localhost:3000

### Production Build

```bash
npm run build
npm start
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

## 🎯 Use Cases

### For Users
- **Lost Item**: Submit detailed description, wait for approval, monitor for claims
- **Found Item**: Report found item, provide contact info, help reunite with owner
- **Browse Items**: Search through approved listings, claim if found

### For Moderators
- **Review Submissions**: Check new items for appropriateness and completeness
- **Approve/Reject**: Make decisions based on content quality and safety
- **Monitor System**: Track statistics and system health

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

## 🔧 Configuration

### Environment Variables
```bash
PORT=5000                    # Backend port
NODE_ENV=development         # Environment mode
```

### Database
- **SQLite**: Automatically created on first run
- **Location**: `./lostfound.db` in project root
- **Backup**: Consider backing up this file in production

## 🚀 Deployment

### Heroku
```bash
heroku create
git push heroku main
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure database (consider PostgreSQL for production)
- Set up proper CORS origins
- Enable HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Future Enhancements

- **User Authentication**: Login system with user profiles
- **Image Uploads**: Photo support for items
- **Email Notifications**: Automated email alerts
- **Mobile App**: React Native companion app
- **Advanced Search**: AI-powered item matching
- **Analytics Dashboard**: Detailed usage statistics
- **API Rate Limiting**: Prevent abuse and spam
- **Multi-language Support**: Internationalization

---

**This is a project/Assignment for Infinite Locus by Group 13**
