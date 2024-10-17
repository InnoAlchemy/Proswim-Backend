const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({
      error: true,
      message: "No token provided",
    });
  }

  // Remove "Bearer " prefix if present
  const bearerToken = token.startsWith("Bearer ") ? token.slice(7) : token;

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .json({ error: true, message: "Failed to authenticate token" });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
