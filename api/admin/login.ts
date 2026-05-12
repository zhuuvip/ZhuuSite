import type { VercelRequest, VercelResponse } from "@vercel/node";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zhuu2026admin";
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { password } = req.body ?? {};
  if (password === ADMIN_PASSWORD) res.json({ success: true, token: ADMIN_PASSWORD });
  else res.status(401).json({ error: "Wrong password" });
}
