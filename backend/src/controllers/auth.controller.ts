import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import sql from "../config/db.js"; // your postgres.js instance
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const LoginSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    // Fetch super admin from DB
    const admins = await sql`
      SELECT * FROM super_admins WHERE email = ${email}
    `;

    const admin = admins[0];
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { super_admin_id: admin.super_admin_id, email: admin.email, role: "super_admin" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        super_admin_id: admin.super_admin_id,
        name: admin.name,
        email: admin.email,
        role: "super_admin"
      },
    });
  } catch (error) {
    console.error("LoginSuperAdmin Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const RegisterTenantAdmin = async (req: Request, res: Response) => {
  try {
    const { tenant_id, name, email, role } = req.body;

    if (!tenant_id || !name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingAdmin = await sql`
        SELECT user_id
        FROM users
        WHERE tenant_id = ${tenant_id}
        AND role = 'ADMIN'
        LIMIT 1
      `;

    if (existingAdmin.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists for this tenant",
      });
    }


    const password_hash = await bcrypt.hash(email, 10);

    const [user] = await sql`
      INSERT INTO users (
        tenant_id,
        name,
        email,
        password_hash,
        role
      )
      VALUES (
        ${tenant_id},
        ${name},
        ${email},
        ${password_hash},
        ${role}
      )
      RETURNING user_id, tenant_id, name, email, role, created_at
    `;

    return res.status(201).json({
      success: true,
      message: "Tenant user created successfully",
      data: user,
      default_password: email,
    });

  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email already exists for this tenant",
      });
    }

    console.error("RegisterTenantAdmin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;


    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const users = await sql`
      SELECT * FROM users WHERE email = ${email} AND role = ${role}
    `;

    const user = users[0];
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        tenant_id: user.tenant_id,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        tenant_id: user.tenant_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const Logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};