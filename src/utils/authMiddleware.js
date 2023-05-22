const verifyToken = require("./auth.js").verifyToken;

const authenticateUser = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        const user = verifyToken(token);

        return user;
      } catch (error) {
        throw new Error("Invalid token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]'");
  }
  return {};
};

module.exports = { authenticateUser };
