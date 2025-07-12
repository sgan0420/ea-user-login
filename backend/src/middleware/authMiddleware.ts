import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";
import { createUnauthorizedError } from "../utils/errorUtils";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    throw createUnauthorizedError("Access token required");
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    throw createUnauthorizedError("Invalid or expired token");
  }
};
