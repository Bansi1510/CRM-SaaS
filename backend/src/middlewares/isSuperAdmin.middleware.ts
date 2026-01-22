import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const isSuperAdmin=async(req:Request,res:Response,next:NextFunction)=>{
try {
  console.log(req)
  const token=req.cookies.token;
  if(!token){
    return res.status(401).json({
      success:false,
      message:"Token not found",
    })
  }
   const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    
    if (decoded.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    req.user = decoded;

    next();

} catch (error: any) {
    console.error("Access denied:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }

}
export default isSuperAdmin;