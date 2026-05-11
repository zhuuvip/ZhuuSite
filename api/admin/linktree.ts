import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, linktreeLinksTable } from "../_db";
import { asc } from "drizzle-orm";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zhuu2026admin";
function auth(req: VercelRequest, res: VercelResponse): boolean {
  if (req.headers["x-admin-token"] !== ADMIN_PASSWORD) { res.status(401).json({ error: "Unauthorized" }); return false; }
  return true;
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!auth(req, res)) return;
  try {
    if (req.method === "GET") return res.json(await db.select().from(linktreeLinksTable).orderBy(asc(linktreeLinksTable.sortOrder)));
    if (req.method === "POST") {
      const { title, subtitle, url, icon, iconType, color, badge, sortOrder, active } = req.body;
      const [row] = await db.insert(linktreeLinksTable).values({ title, subtitle, url, icon, iconType, color, badge, sortOrder, active }).returning();
      return res.json(row);
    }
    res.status(405).end();
  } catch { res.status(500).json({ error: "DB error" }); }
}
