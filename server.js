const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database('./lostfound.db');

// Create tables
db.serialize(() => {
  // Items table
  db.run(`CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    date TEXT,
    contact TEXT,
    status TEXT DEFAULT 'pending_approval',
    claimant_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Users table (simplified for demo)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user'
  )`);

  // Insert default moderator
  db.run(`INSERT OR IGNORE INTO users (id, name, email, role) VALUES (?, ?, ?, ?)`, 
    ['mod-001', 'Moderator', 'moderator@example.com', 'moderator']);
});

// Helper function to send notifications
const sendNotification = (message, type = 'info') => {
  console.log(`🔔 NOTIFICATION [${type.toUpperCase()}]: ${message}`);
  // In a real app, this would send emails, push notifications, etc.
};

// Routes

// Get all items (filtered by status)
app.get('/api/items', (req, res) => {
  const { status, type } = req.query;
  let query = 'SELECT * FROM items';
  let params = [];

  if (status || type) {
    query += ' WHERE';
    if (status) {
      query += ' status = ?';
      params.push(status);
    }
    if (type) {
      if (status) query += ' AND';
      query += ' type = ?';
      params.push(type);
    }
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single item
app.get('/api/items/:id', (req, res) => {
  db.get('SELECT * FROM items WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json(row);
  });
});

// Create new item
app.post('/api/items', (req, res) => {
  const { type, title, description, location, date, contact } = req.body;
  
  if (!type || !title || !description) {
    return res.status(400).json({ error: 'Type, title, and description are required' });
  }

  const id = uuidv4();
  const item = {
    id,
    type,
    title,
    description,
    location: location || '',
    date: date || new Date().toISOString().split('T')[0],
    contact: contact || '',
    status: 'pending_approval'
  };

  db.run(`INSERT INTO items (id, type, title, description, location, date, contact, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [item.id, item.type, item.title, item.description, item.location, item.date, item.contact, item.status],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      sendNotification(`New ${type} item submitted: "${title}"`, 'submission');
      res.status(201).json(item);
    });
});

// Update item status (moderator approval/rejection)
app.patch('/api/items/:id/status', (req, res) => {
  const { status, moderatorId } = req.body;
  const { id } = req.params;

  if (!['pending_approval', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run('UPDATE items SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
    [status, id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      // Get item details for notification
      db.get('SELECT * FROM items WHERE id = ?', [id], (err, item) => {
        if (item) {
          const action = status === 'approved' ? 'approved' : 'rejected';
          sendNotification(`Item "${item.title}" has been ${action}`, 'moderation');
        }
      });

      res.json({ message: `Item status updated to ${status}` });
    });
});

// Claim item
app.post('/api/items/:id/claim', (req, res) => {
  const { claimantId, claimantName } = req.body;
  const { id } = req.params;

  if (!claimantId || !claimantName) {
    return res.status(400).json({ error: 'Claimant ID and name are required' });
  }

  db.run('UPDATE items SET status = ?, claimant_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = ?', 
    ['claimed', claimantId, id, 'approved'], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (this.changes === 0) {
        return res.status(400).json({ error: 'Item not found or not available for claiming' });
      }

      // Get item details for notification
      db.get('SELECT * FROM items WHERE id = ?', [id], (err, item) => {
        if (item) {
          sendNotification(`Item "${item.title}" has been claimed by ${claimantName}`, 'claim');
        }
      });

      res.json({ message: 'Item claimed successfully' });
    });
});

// Get pending items for moderator
app.get('/api/moderator/pending', (req, res) => {
  db.all('SELECT * FROM items WHERE status = ? ORDER BY created_at ASC', 
    ['pending_approval'], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
});

// Get moderator dashboard stats
app.get('/api/moderator/stats', (req, res) => {
  db.all(`SELECT 
    status, 
    COUNT(*) as count 
    FROM items 
    GROUP BY status`, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      const stats = {
        pending_approval: 0,
        approved: 0,
        claimed: 0,
        rejected: 0
      };
      
      rows.forEach(row => {
        stats[row.status] = row.count;
      });
      
      res.json(stats);
    });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Lost & Found Portal API ready`);
  console.log(`🔗 http://localhost:${PORT}`);
});
