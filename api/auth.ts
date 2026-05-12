import type { VercelRequest, VercelResponse } from "@vercel/node";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zhuu2026admin";
export function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  if (req.headers["x-admin-token"] !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}
