import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, feedbackTable } from "../../_db";
import { eq } from "drizzle-orm";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zhuu2026admin";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers["x-admin-token"] !== ADMIN_PASSWORD) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.query.id as string);
  try {
    if (req.method === "DELETE") { await db.delete(feedbackTable).where(eq(feedbackTable.id, id)); return res.json({ success: true }); }
    res.status(405).end();
  } catch { res.status(500).json({ error: "DB error" }); }
}
