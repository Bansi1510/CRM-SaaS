import postgres from 'postgres';
const connectionString = process.env.DATABASE_URL;
if (!connectionString)
    throw new Error("url nakh ben stocke");
const sql = postgres(connectionString);
export const connectDB = async () => {
    try {
        await sql`SELECT 1`;
        console.log("✅ PostgreSQL connected");
    }
    catch (error) {
        console.error("❌ PostgreSQL connection failed");
        console.error(error);
        process.exit(1);
    }
};
export default sql;
