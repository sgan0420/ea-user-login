import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";

export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Middleware to protect routes and extract user info from JWT
 */
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
