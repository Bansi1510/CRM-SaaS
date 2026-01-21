import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({});
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL missing");

const sql = postgres(connectionString);

export const connectDB = async () => {
  try {
    await sql`select 1`;
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed");
    throw err;
  }
};

export default sql;
