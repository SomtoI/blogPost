import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import poolPromise from "../db/connection";

const saltRounds = 10;
const secretKey = "your_secret_key";

const createUser = async (args) => {
  const { username, email, password } = args;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Save the user to the database
  const pool = await poolPromise;
  const request = pool.request();
  request.input("username", username);
  request.input("email", email);
  request.input("password", hashedPassword);
  const result = await request.query(
    "INSERT INTO User (username, email, password) VALUES (@username, @email, @password)"
  );
  const userId = result.recordset[0].id;

  return {
    id: userId,
    username,
    email,
    password: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

const getUsers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM User");

  return result.recordset;
};

export default {
  createUser,
  getUsers,
};
