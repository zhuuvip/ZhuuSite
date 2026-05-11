import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, soundsTable } from "../_db";
import { eq, asc } from "drizzle-orm";
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const sounds = await db.select().from(soundsTable).where(eq(soundsTable.active, true)).orderBy(asc(soundsTable.sortOrder));
    res.json(sounds);
  } catch { res.status(500).json({ error: "DB error" }); }
}
