import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../db";
const PW = process.env.ADMIN_PASSWORD || "zhuu2026admin";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers["x-admin-token"] !== PW) return res.status(401).json({ error: "Unauthorized" });
  if (req.method !== "PUT") return res.status(405).end();
  const id = Number(req.query.id);
  try { await getDb()`UPDATE feedback SET read=true WHERE id=${id}`; res.json({ success: true }); }
  catch (e: any) { res.status(500).json({ error: e.message }); }
}
