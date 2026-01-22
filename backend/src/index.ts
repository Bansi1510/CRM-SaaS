import { connectDB } from "./config/db.js";
import app from "./server.js";
import dotenv from "dotenv";
dotenv.config()
 
const PORT = process.env.PORT ||2005;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

startServer();
