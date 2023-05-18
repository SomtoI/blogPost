import { Sequelize } from "sequelize";

// Database configuration

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mssql",
    //host: process.env.DB_SERVER,
    server: process.env.DB_SERVER,
    //port: process.env.DB_PORT,
    dialectOptions: {
      authentication: {
        type: "default",
        options: {
          instanceName: process.env.DB_INSTANCE_NAME,
          //domain:,
          encrypt: true, // Enable encryption (if required)
          trustServerCertificate: true, // Enable trust server certificate (if required)
        },
      },
    },
  }
);
/*
const sequelize = new Sequelize({
  dialect: "mssql",
  dialectOptions: {
    options: {
      instanceName: "TEMP-DEV-LAPTOP",
      trustedConnection: true, // Use Windows authentication
    },
  },
  host: "TEMP-DEV-LAPTOP",
  database: "blog_platform",
});
*/
/*
const sequelize = new Sequelize(
  `mssql://TEMP-DEV-LAPTOP\\HP@localhost:1433/${process.env.DB_NAME}`
);
*/
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
