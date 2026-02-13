const jwt = require("jsonwebtoken");

// Secret key for JWT - In production, use environment variable
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user info to request
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

// Middleware to check if user is moderator
const authenticateModerator = (req, res, next) => {
  // First authenticate the token
  authenticateToken(req, res, () => {
    if (req.user.role !== "moderator") {
      return res
        .status(403)
        .json({ error: "Access denied. Moderator role required." });
    }
    next();
  });
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "24h" }, // Token expires in 24 hours
  );
};

module.exports = {
  authenticateToken,
  authenticateModerator,
  generateToken,
  JWT_SECRET,
};
