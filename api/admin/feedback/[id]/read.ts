import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, feedbackTable } from "../../../_db";
import { eq } from "drizzle-orm";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zhuu2026admin";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers["x-admin-token"] !== ADMIN_PASSWORD) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.query.id as string);
  try { await db.update(feedbackTable).set({ read: true }).where(eq(feedbackTable.id, id)); res.json({ success: true }); }
  catch { res.status(500).json({ error: "DB error" }); }
}
