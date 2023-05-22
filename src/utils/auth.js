const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (user) => {
  const { id, username, email } = user;
  const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
  const expiresIn = 24 * 60 * 60; // Token expiration time in seconds (1 day)

  const payload = {
    id,
    username,
    email,
    iat: currentTime, // "iat" field represents the issued at time
    exp: currentTime + expiresIn, // Set the expiration time
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const verifyToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.HASH, 10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePasswords = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePasswords,
};
