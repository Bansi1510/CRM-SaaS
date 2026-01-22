import type { Request, Response } from "express";
import sql from "../config/db.js";


export const CreateTenant = async (req: Request, res: Response) => {
  try {
    const { name, domain } = req.body;

    if (!name || !domain) {
      return res.status(400).json({ success: false, message: "Name and domain are required" });
    }

    const [tenant] = await sql`
      INSERT INTO tenants (name, domain)
      VALUES (${name}, ${domain})
      RETURNING tenant_id, name, domain, status, created_at
    `;

    return res.status(201).json({
      success: true,
      message: "Tenant created successfully",
      data: tenant,
    });

  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "Domain already exists" });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTenantById = async (req: Request, res: Response) => {
  try {
    const { tenant_id } = req.params;

    if (!tenant_id) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required",
      });
    }
    const [tenant] = await sql`
      SELECT * FROM tenants WHERE tenant_id = ${tenant_id}
    `;
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (error: any) {
    console.error("getTenantById Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};