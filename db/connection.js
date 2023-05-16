import sql from "mssql";

const config = {
  user: "username",
  password: "password",
  server: "localhost",
  database: "blog_db",
  options: {
    enableArithAbort: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL database");
    return pool;
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });

export default poolPromise;
