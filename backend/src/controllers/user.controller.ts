import bcrypt from 'bcrypt';
import type { Request, Response } from "express";
import sql from "../config/db.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { tenant_id, name, email, role } = req.body;

    // 1. Validation
    if (!tenant_id || !name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const allowedRoles = ["USER", "MANAGER"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // 2. Default password = email
    const hashedPassword = await bcrypt.hash(email, 10);

    // 3. Insert user
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
        ${hashedPassword},
        ${role}
      )
      RETURNING user_id, tenant_id, name, email, role, is_active, created_at;
    `;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });

  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists in this tenant",
      });
    }

    console.error("createUser Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
