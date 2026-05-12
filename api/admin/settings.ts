import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../db";
const PW = process.env.ADMIN_PASSWORD || "zhuu2026admin";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers["x-admin-token"] !== PW) return res.status(401).json({ error: "Unauthorized" });
  const sql = getDb();
  try {
    if (req.method === "GET") {
      const rows = await sql`SELECT key, value FROM site_settings`;
      const settings: Record<string, string> = {};
      rows.forEach((r: any) => { settings[r.key] = r.value; });
      res.json(settings);
    } else if (req.method === "PUT") {
      for (const [key, value] of Object.entries(req.body) as [string, string][]) {
        await sql`INSERT INTO site_settings (key,value,updated_at) VALUES (${key},${value},NOW()) ON CONFLICT (key) DO UPDATE SET value=${value},updated_at=NOW()`;
      }
      res.json({ success: true });
    } else res.status(405).end();
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}
