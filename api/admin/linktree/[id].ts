import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, linktreeLinksTable } from "../../_db";
import { eq } from "drizzle-orm";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zhuu2026admin";
function auth(req: VercelRequest, res: VercelResponse): boolean {
  if (req.headers["x-admin-token"] !== ADMIN_PASSWORD) { res.status(401).json({ error: "Unauthorized" }); return false; }
  return true;
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!auth(req, res)) return;
  const id = parseInt(req.query.id as string);
  try {
    if (req.method === "PUT") {
      const { title, subtitle, url, icon, iconType, color, badge, sortOrder, active } = req.body;
      const [row] = await db.update(linktreeLinksTable).set({ title, subtitle, url, icon, iconType, color, badge, sortOrder, active, updatedAt: new Date() }).where(eq(linktreeLinksTable.id, id)).returning();
      return res.json(row);
    }
    if (req.method === "DELETE") {
      await db.delete(linktreeLinksTable).where(eq(linktreeLinksTable.id, id));
      return res.json({ success: true });
    }
    res.status(405).end();
  } catch { res.status(500).json({ error: "DB error" }); }
}
