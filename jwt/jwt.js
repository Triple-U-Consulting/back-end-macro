const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();

// Create JWT Token
const createToken = async (user) => {
  const accessToken = sign(
    { email: user.rows[0].email, user_id: user.rows[0].user_id },
    process.env.JWT_KEY
  );
  console.log(accessToken);
  //  console.log(process.env.JWT_KEY);
  return accessToken;
};

// Verify token
const validateToken = async (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  const cookie = accessToken.split("=")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const validToken = await verify(cookie, process.env.JWT_KEY);
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error.message });
  }
};

module.exports = {
  createToken,
  validateToken,
};
