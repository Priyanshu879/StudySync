const jwt = require("jsonwebtoken");
const { User } = require("../models/UserModel");

const verifyToken = async (req, res, next) => {
  try {
    // Tokens can be sent in Authorization header or cookies (adjust as per your frontend)
    const authHeader = req.headers.authorization;
    let token;
    

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
   

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { id: user._id, email: user.email, username: user.username };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid", error: error.message });
  }
};

module.exports = {
  verifyToken,
};
