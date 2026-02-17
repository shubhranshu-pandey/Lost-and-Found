const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const bcrypt = require("bcryptjs");
const {
  authenticateToken,
  authenticateModerator,
  generateToken,
} = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database("./lostfound.db");

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
    user_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Users table with password
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Claims table for claim requests
  db.run(`CREATE TABLE IF NOT EXISTS claims (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL,
    claimant_name TEXT NOT NULL,
    claimant_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items (id)
  )`);

  // Insert default moderator with hashed password
  // Default password: "admin123"
  const defaultModeratorPassword = bcrypt.hashSync("admin123", 10);
  db.run(
    `INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
    [
      "mod-001",
      "Admin Moderator",
      "admin@lostfound.com",
      defaultModeratorPassword,
      "moderator",
    ],
  );

  console.log("Database tables initialized");
  console.log("Default moderator: admin@lostfound.com / admin123");
});

// Helper function to send notifications
const sendNotification = (message, type = "info") => {
  console.log(`NOTIFICATION [${type.toUpperCase()}]: ${message}`);
};

// ==================== AUTHENTICATION ROUTES ====================

// User Signup
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  // Check if user already exists
  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      // Create user
      db.run(
        "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
        [userId, name, email, hashedPassword, "user"],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Generate token
          const token = generateToken({
            id: userId,
            email,
            role: "user",
            name,
          });

          res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
              id: userId,
              name,
              email,
              role: "user",
            },
          });
        },
      );
    },
  );
});

// User Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Find user
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
});

// Moderator Login (supports both username and email)
app.post("/api/auth/moderator/login", (req, res) => {
  const { username, email, password } = req.body;

  // Validation - accept either username or email
  const loginIdentifier = username || email;

  if (!loginIdentifier || !password) {
    return res
      .status(400)
      .json({ error: "Username/Email and password are required" });
  }

  // Find moderator by username or email
  const query = username
    ? "SELECT * FROM users WHERE username = ? AND role = ?"
    : "SELECT * FROM users WHERE email = ? AND role = ?";

  db.get(query, [loginIdentifier, "moderator"], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid credentials or not a moderator" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: "Moderator login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  });
});

// Get current user info (protected route)
app.get("/api/auth/me", authenticateToken, (req, res) => {
  db.get(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    },
  );
});

// ==================== ITEMS ROUTES ====================

// Get all items (public - no auth required)
app.get("/api/items", (req, res) => {
  const { status, type } = req.query;
  let query = "SELECT * FROM items";
  let params = [];

  if (status || type) {
    query += " WHERE";
    if (status) {
      query += " status = ?";
      params.push(status);
    }
    if (type) {
      if (status) query += " AND";
      query += " type = ?";
      params.push(type);
    }
  }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single item (public)
app.get("/api/items/:id", (req, res) => {
  db.get("SELECT * FROM items WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json(row);
  });
});

// Create new item (protected - requires authentication)
app.post("/api/items", authenticateToken, (req, res) => {
  const { type, title, description, location, date, contact } = req.body;

  if (!type || !title || !description) {
    return res
      .status(400)
      .json({ error: "Type, title, and description are required" });
  }

  const id = uuidv4();
  const item = {
    id,
    type,
    title,
    description,
    location: location || "",
    date: date || new Date().toISOString().split("T")[0],
    contact: contact || "",
    status: "pending_approval",
    user_id: req.user.id,
  };

  db.run(
    `INSERT INTO items (id, type, title, description, location, date, contact, status, user_id) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.id,
      item.type,
      item.title,
      item.description,
      item.location,
      item.date,
      item.contact,
      item.status,
      item.user_id,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      sendNotification(
        `New ${type} item submitted by ${req.user.name}: "${title}"`,
        "submission",
      );
      res.status(201).json(item);
    },
  );
});

// Update item status (moderator only)
app.patch("/api/items/:id/status", authenticateModerator, (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!["pending_approval", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  db.run(
    "UPDATE items SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [status, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Item not found" });
      }

      // Get item details for notification
      db.get("SELECT * FROM items WHERE id = ?", [id], (err, item) => {
        if (item) {
          const action = status === "approved" ? "approved" : "rejected";
          sendNotification(
            `Item "${item.title}" has been ${action} by ${req.user.name}`,
            "moderation",
          );
        }
      });

      res.json({ message: `Item status updated to ${status}` });
    },
  );
});

// Submit claim request (protected)
app.post("/api/items/:id/claim", authenticateToken, (req, res) => {
  const { id } = req.params;
  const claimantId = req.user.email;
  const claimantName = req.user.name;

  // First check if item exists and is approved
  db.get(
    "SELECT * FROM items WHERE id = ? AND status = ?",
    [id, "approved"],
    (err, item) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!item) {
        return res
          .status(400)
          .json({ error: "Item not found or not available for claiming" });
      }

      // Check if there's already a pending claim for this item
      db.get(
        "SELECT * FROM claims WHERE item_id = ? AND status = ?",
        [id, "pending"],
        (err, existingClaim) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          if (existingClaim) {
            return res.status(400).json({
              error: "There is already a pending claim for this item",
            });
          }

          // Create new claim request
          const claimId = uuidv4();
          db.run(
            `INSERT INTO claims (id, item_id, claimant_name, claimant_id, status) 
               VALUES (?, ?, ?, ?, ?)`,
            [claimId, id, claimantName, claimantId, "pending"],
            function (err) {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              sendNotification(
                `New claim request for "${item.title}" by ${claimantName}`,
                "claim_request",
              );
              res.json({
                message:
                  "Claim request submitted successfully! A moderator will review your request.",
                claimId: claimId,
              });
            },
          );
        },
      );
    },
  );
});

// ==================== MODERATOR ROUTES ====================

// Get pending items for moderator (moderator only)
app.get("/api/moderator/pending", authenticateModerator, (req, res) => {
  db.all(
    "SELECT * FROM items WHERE status = ? ORDER BY created_at ASC",
    ["pending_approval"],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    },
  );
});

// Get pending claims for moderator (moderator only)
app.get("/api/moderator/claims", authenticateModerator, (req, res) => {
  db.all(
    `SELECT c.*, i.title, i.description, i.type, i.location, i.date 
          FROM claims c 
          JOIN items i ON c.item_id = i.id 
          WHERE c.status = 'pending' 
          ORDER BY c.created_at ASC`,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    },
  );
});

// Approve or reject claim (moderator only)
app.patch(
  "/api/moderator/claims/:claimId",
  authenticateModerator,
  (req, res) => {
    const { claimId } = req.params;
    const { action } = req.body; // action: 'approve' or 'reject'

    if (!["approve", "reject"].includes(action)) {
      return res
        .status(400)
        .json({ error: "Invalid action. Must be approve or reject" });
    }

    // Get claim details
    db.get(
      `SELECT c.*, i.title FROM claims c JOIN items i ON c.item_id = i.id WHERE c.id = ?`,
      [claimId],
      (err, claim) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (!claim) {
          return res.status(404).json({ error: "Claim not found" });
        }

        if (claim.status !== "pending") {
          return res
            .status(400)
            .json({ error: "Claim has already been processed" });
        }

        const newClaimStatus = action === "approve" ? "approved" : "rejected";

        // Update claim status
        db.run(
          "UPDATE claims SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          [newClaimStatus, claimId],
          function (err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            if (action === "approve") {
              // If approved, update item status to claimed and set claimant
              db.run(
                "UPDATE items SET status = ?, claimant_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                ["claimed", claim.claimant_id, claim.item_id],
                function (err) {
                  if (err) {
                    return res.status(500).json({ error: err.message });
                  }

                  sendNotification(
                    `Claim approved by ${req.user.name}: "${claim.title}" claimed by ${claim.claimant_name}`,
                    "claim_approved",
                  );
                  res.json({ message: "Claim approved successfully" });
                },
              );
            } else {
              // If rejected, just send notification
              sendNotification(
                `Claim rejected by ${req.user.name}: "${claim.title}" claim by ${claim.claimant_name}`,
                "claim_rejected",
              );
              res.json({ message: "Claim rejected successfully" });
            }
          },
        );
      },
    );
  },
);

// Get moderator dashboard stats (moderator only)
app.get("/api/moderator/stats", authenticateModerator, (req, res) => {
  db.all(
    `SELECT 
    status, 
    COUNT(*) as count 
    FROM items 
    GROUP BY status`,
    (err, itemRows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Get claim stats
      db.all(
        `SELECT 
        status, 
        COUNT(*) as count 
        FROM claims 
        GROUP BY status`,
        (err, claimRows) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          const stats = {
            pending_approval: 0,
            approved: 0,
            claimed: 0,
            rejected: 0,
            pending_claims: 0,
            approved_claims: 0,
            rejected_claims: 0,
          };

          itemRows.forEach((row) => {
            stats[row.status] = row.count;
          });

          claimRows.forEach((row) => {
            stats[`${row.status}_claims`] = row.count;
          });

          res.json(stats);
        },
      );
    },
  );
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Lost & Found Portal API with JWT Authentication ready`);
  console.log(`🔗 http://localhost:${PORT}`);
});
