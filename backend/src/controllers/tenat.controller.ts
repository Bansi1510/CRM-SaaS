import type { Request, Response } from "express";
import sql from "../config/db.js";
 

export const CreateTenant = async (req: Request, res: Response) => {
  try {
    const { name, domain } = req.body;

    if (!name || !domain) {
      return res.status(400).json({ message: "Name and domain are required" });
    }
    
    const [tenant] = await sql`
      INSERT INTO tenants (name, domain)
      VALUES (${name}, ${domain})
      RETURNING tenant_id, name, domain, status, created_at
    `;

    return res.status(201).json({
      message: "Tenant created successfully",
      data: tenant,
    });

  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Domain already exists" });
    }

    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
