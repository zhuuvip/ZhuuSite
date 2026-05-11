import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, communityLinksTable } from "../_db";
import { eq, asc } from "drizzle-orm";
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const links = await db.select().from(communityLinksTable)
      .where(eq(communityLinksTable.active, true))
      .orderBy(asc(communityLinksTable.sortOrder));
    res.json(links);
  } catch { res.status(500).json({ error: "DB error" }); }
}
