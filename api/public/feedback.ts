import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, feedbackTable } from "../_db";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { type, rating, name, email, message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: "Message required" });
    const [row] = await db.insert(feedbackTable).values({ type, rating, name, email, message }).returning();
    res.json(row);
  } catch { res.status(500).json({ error: "DB error" }); }
}
