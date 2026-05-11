import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, linktreeLinksTable } from "../_db";
import { eq, asc } from "drizzle-orm";
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const links = await db.select().from(linktreeLinksTable).where(eq(linktreeLinksTable.active, true)).orderBy(asc(linktreeLinksTable.sortOrder));
    res.json(links);
  } catch { res.status(500).json({ error: "DB error" }); }
}
