import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import sql from "../config/db.ts"; // your postgres.js instance
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // set in .env

export const LoginSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Fetch super admin from DB
    const admins = await sql`
      SELECT * FROM super_admins WHERE email = ${email}
    `;

    const admin = admins[0];
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { super_admin_id: admin.super_admin_id, email: admin.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with token
    return res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        super_admin_id: admin.super_admin_id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("LoginSuperAdmin Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
