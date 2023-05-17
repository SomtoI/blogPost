import { Sequelize } from "sequelize";

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  null,
  {
    dialect: "mssql",
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    dialectOptions: {
      options: {
        encrypt: true, // Enable encryption (if required)
        trustServerCertificate: true, // Enable trust server certificate (if required)
      },
    },
  }
);

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit the process with failure
  }
})();

export default sequelize;
