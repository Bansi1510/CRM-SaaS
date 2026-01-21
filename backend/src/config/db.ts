import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const config = {
  server: "localhost",
  port: 1433,
  database: "crm",
  user: "crm_user",
  password: "crm@123",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};


let pool: sql.ConnectionPool;

export const connectDB = async (): Promise<sql.ConnectionPool> => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log("✅ SQL Server connected");
    }
    return pool;
  } catch (error) {
    console.error("❌ SQL Server connection failed");
    console.error(error);
    process.exit(1);
  }
};

export { sql };
