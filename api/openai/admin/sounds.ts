import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, soundsTable } from "../_db";
import { asc } from "drizzle-orm";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zhuu2026admin";
function auth(req: VercelRequest, res: VercelResponse): boolean {
  if (req.headers["x-admin-token"] !== ADMIN_PASSWORD) { res.status(401).json({ error: "Unauthorized" }); return false; }
  return true;
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!auth(req, res)) return;
  try {
    if (req.method === "GET") return res.json(await db.select().from(soundsTable).orderBy(asc(soundsTable.sortOrder)));
    if (req.method === "POST") {
      const { title, artist, url, cover, active, sortOrder } = req.body;
      const [row] = await db.insert(soundsTable).values({ title, artist, url, cover, active, sortOrder }).returning();
      return res.json(row);
    }
    res.status(405).end();
  } catch { res.status(500).json({ error: "DB error" }); }
}
