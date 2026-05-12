import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../db";
const PW = process.env.ADMIN_PASSWORD || "zhuu2026admin";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers["x-admin-token"] !== PW) return res.status(401).json({ error: "Unauthorized" });
  const sql = getDb();
  try {
    if (req.method === "GET") res.json(await sql`SELECT * FROM sounds ORDER BY sort_order`);
    else if (req.method === "POST") {
      const { title, artist, url, cover, active, sortOrder: sort_order } = req.body;
      const [row] = await sql`INSERT INTO sounds (title,artist,url,cover,active,sort_order) VALUES (${title},${artist},${url},${cover},${active},${sort_order}) RETURNING *`;
      res.json(row);
    } else res.status(405).end();
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}
