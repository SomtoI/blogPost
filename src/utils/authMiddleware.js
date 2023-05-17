import { verifyToken } from "./auth";

export const authenticateUser = (req) => {
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
  throw new Error("Authorization header must be provided");
};
