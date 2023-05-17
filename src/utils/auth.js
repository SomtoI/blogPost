import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = (user) => {
  const { id, username, email } = user;
  const token = jwt.sign({ id, username, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePasswords = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

export { generateToken, hashPassword, comparePasswords };
