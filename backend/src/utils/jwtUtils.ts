import jwt, { Secret } from "jsonwebtoken";

// Ensure secret is provided
const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
const secret: Secret = rawSecret;
const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

/**
 * Sign a JWT for given payload
 */
export function signToken(payload: object): string {
  // Cast options to any to satisfy type signature
  return jwt.sign(payload, secret, { expiresIn } as any);
}

/**
 * Verify a JWT and return decoded payload
 */
export function verifyToken(token: string): any {
  return jwt.verify(token, secret);
}
