import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../../db";
const PW = process.env.ADMIN_PASSWORD || "zhuu2026admin";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers["x-admin-token"] !== PW) return res.status(401).json({ error: "Unauthorized" });
  const sql = getDb(); const id = Number(req.query.id);
  try {
    if (req.method === "PUT") {
      const { title, subtitle, url, icon, iconType: icon_type, color, badge, sortOrder: sort_order, active } = req.body;
      const [row] = await sql`UPDATE linktree_links SET title=${title},subtitle=${subtitle},url=${url},icon=${icon},icon_type=${icon_type},color=${color},badge=${badge},sort_order=${sort_order},active=${active},updated_at=NOW() WHERE id=${id} RETURNING *`;
      res.json(row);
    } else if (req.method === "DELETE") {
      await sql`DELETE FROM linktree_links WHERE id=${id}`; res.json({ success: true });
    } else res.status(405).end();
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}
