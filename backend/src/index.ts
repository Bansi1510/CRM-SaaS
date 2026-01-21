import { connectDB } from "./config/db.ts";
import app from "./server.ts";

const PORT = process.env.PORT || 2005;

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
