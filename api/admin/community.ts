import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../db";
const PW = process.env.ADMIN_PASSWORD || "zhuu2026admin";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers["x-admin-token"] !== PW) return res.status(401).json({ error: "Unauthorized" });
  const sql = getDb();
  try {
    if (req.method === "GET") res.json(await sql`SELECT * FROM community_links ORDER BY sort_order`);
    else if (req.method === "POST") {
      const { name, icon, description, url, members, btnText: btn_text, color, badge, sortOrder: sort_order, active } = req.body;
      const [row] = await sql`INSERT INTO community_links (name,icon,description,url,members,btn_text,color,badge,sort_order,active) VALUES (${name},${icon},${description},${url},${members},${btn_text},${color},${badge},${sort_order},${active}) RETURNING *`;
      res.json(row);
    } else res.status(405).end();
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}
