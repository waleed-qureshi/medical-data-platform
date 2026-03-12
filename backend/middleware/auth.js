const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace(/^(Bearer\s+)/i, "") : req.query?.token;

  if (!token) return res.status(401).json({ message: "Missing Authorization token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
