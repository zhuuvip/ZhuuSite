import type { VercelRequest, VercelResponse } from "@vercel/node";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zhuu2026admin";
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { password } = req.body as { password: string };
  if (password === ADMIN_PASSWORD) return res.json({ success: true, token: ADMIN_PASSWORD });
  res.status(401).json({ error: "Wrong password" });
}
