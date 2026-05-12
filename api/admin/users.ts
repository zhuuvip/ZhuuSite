import type { VercelRequest, VercelResponse } from "@vercel/node";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zhuu2026admin";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers["x-admin-token"] !== ADMIN_PASSWORD) return res.status(401).json({ error: "Unauthorized" });
  const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
  if (!CLERK_SECRET_KEY) return res.json({ data: [], error: "CLERK_SECRET_KEY not configured" });
  try {
    const r = await fetch("https://api.clerk.com/v1/users?limit=100&order_by=-created_at", { headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` } });
    if (!r.ok) return res.status(r.status).json({ error: "Clerk API error" });
    res.json(await r.json());
  } catch { res.status(500).json({ error: "Failed to fetch users" }); }
}
