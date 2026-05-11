import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, siteSettingsTable } from "../_db";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zhuu2026admin";
function auth(req: VercelRequest, res: VercelResponse): boolean {
  if (req.headers["x-admin-token"] !== ADMIN_PASSWORD) { res.status(401).json({ error: "Unauthorized" }); return false; }
  return true;
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!auth(req, res)) return;
  try {
    if (req.method === "GET") {
      const rows = await db.select().from(siteSettingsTable);
      const settings: Record<string, string> = {};
      rows.forEach(r => { settings[r.key] = r.value; });
      return res.json(settings);
    }
    if (req.method === "PUT") {
      const entries = Object.entries(req.body) as [string, string][];
      for (const [key, value] of entries) {
        await db.insert(siteSettingsTable).values({ key, value, updatedAt: new Date() })
          .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value, updatedAt: new Date() } });
      }
      return res.json({ success: true });
    }
    res.status(405).end();
  } catch { res.status(500).json({ error: "DB error" }); }
}
