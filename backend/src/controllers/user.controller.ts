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
export const getUsers = async (req: Request, res: Response) => {
  try {
    const tenant_id = req.query.tenant_id as string;
    if (!tenant_id) {
      return res.status(400).json({ success: false, message: "Tenant id required" });
    }

    const users = await sql`
      SELECT user_id, name, email, role, is_active, created_at
      FROM users
      WHERE tenant_id = ${tenant_id}
      ORDER BY created_at DESC
    `;

    return res.status(200).json({ success: true, data: users });

  } catch (error) {
    console.error("getUsers Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.user_id as string;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const [user] = await sql`
      SELECT user_id, tenant_id, name, email, role, is_active, created_at
      FROM users
      WHERE user_id = ${user_id}
    `;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error("getUserById Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const { name, email } = req.body;

    if (!user_id || !name || !email) {
      return res.status(401).json({
        success: false,
        message: "all fields required"
      })
    }
    const [user] = await sql`
      UPDATE users
      SET
        name = COALESCE(${name}, name),
        email = COALESCE(${email}, email)
      WHERE user_id = ${user_id}
      RETURNING user_id, name, email, role, is_active
    `;

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });

  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email already exists for this tenant",
      });
    }

    console.error("updateUser Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
