import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../../db";
const PW = process.env.ADMIN_PASSWORD || "zhuu2026admin";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers["x-admin-token"] !== PW) return res.status(401).json({ error: "Unauthorized" });
  const sql = getDb(); const id = Number(req.query.id);
  try {
    if (req.method === "PUT") {
      const { name, icon, description, url, members, btnText: btn_text, color, badge, sortOrder: sort_order, active } = req.body;
      const [row] = await sql`UPDATE community_links SET name=${name},icon=${icon},description=${description},url=${url},members=${members},btn_text=${btn_text},color=${color},badge=${badge},sort_order=${sort_order},active=${active},updated_at=NOW() WHERE id=${id} RETURNING *`;
      res.json(row);
    } else if (req.method === "DELETE") {
      await sql`DELETE FROM community_links WHERE id=${id}`; res.json({ success: true });
    } else res.status(405).end();
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}
