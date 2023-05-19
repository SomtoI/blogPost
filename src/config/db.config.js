import { Sequelize } from "sequelize";

const config = "./config.json";
const env = process.env.NODE_ENV || "development";

// Database configurations
//MSSQL Configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mssql",
    //host: process.env.DB_SERVER,
    server: process.env.DB_SERVER,
    port: process.env.DB_PORT,
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

//MySql configuration
/*
console.log(env);
const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  config[env]
);

// Test the database connection
console.log("in here");
(async () => {
  try {
    console.log("first");
    await sequelize.authenticate();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit the process with failure
  }
})();
*/
export default sequelize;
