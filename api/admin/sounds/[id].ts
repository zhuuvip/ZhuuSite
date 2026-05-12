import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../../db";
const PW = process.env.ADMIN_PASSWORD || "zhuu2026admin";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers["x-admin-token"] !== PW) return res.status(401).json({ error: "Unauthorized" });
  const sql = getDb(); const id = Number(req.query.id);
  try {
    if (req.method === "PUT") {
      const { title, artist, url, cover, active, sortOrder: sort_order } = req.body;
      const [row] = await sql`UPDATE sounds SET title=${title},artist=${artist},url=${url},cover=${cover},active=${active},sort_order=${sort_order} WHERE id=${id} RETURNING *`;
      res.json(row);
    } else if (req.method === "DELETE") {
      await sql`DELETE FROM sounds WHERE id=${id}`; res.json({ success: true });
    } else res.status(405).end();
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}
