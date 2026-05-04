export const config = { runtime: "edge" };

const SYSTEM_PROMPT = `You are Zhuu AI — a friendly, helpful assistant for ZhuuVIP. You speak both Indonesian and English fluently. Answer any question the user asks directly and accurately. For questions about ZhuuVIP specifically, use this info:
- Donate: sociabuzz.com/zhuuvip/tribe
- Buy/Order: wa.me/62882005730502
- Community (Circle Vendetta Noire): chat.whatsapp.com/LC8ybe9WPZAEYO2lkmN4X4
- Tools info: whatsapp.com/channel/0029VaXLuPM002TGAkbWtb3G
- Background music: Indila - Love Story
Keep replies concise, warm, and helpful. Use ocean emojis occasionally 🌊.`;

async function tryPollinations(messages: Array<{ role: string; content: string }>): Promise<Response | null> {
  try {
    const res = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
        max_tokens: 1024,
      }),
    });
    if (res.ok && res.body) {
      return new Response(res.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  } catch { /* fall through */ }
  return null;
}

async function tryOpenAI(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  baseUrl: string
): Promise<Response | null> {
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
        max_tokens: 1024,
      }),
    });
    if (res.ok && res.body) {
      return new Response(res.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  } catch { /* fall through */ }
  return null;
}

async function streamFallback(msg: string): Promise<Response> {
  const encoder = new TextEncoder();
  const lower = msg.toLowerCase();
  let reply: string;

  if (/donate|donasi|support|sociabuzz/.test(lower)) {
    reply = "Untuk donasi, kunjungi: sociabuzz.com/zhuuvip/tribe 💜 Terima kasih sudah support Zhuu!";
  } else if (/beli|order|whatsapp|wa\.me/.test(lower)) {
    reply = "Untuk order langsung, hubungi via WA: wa.me/62882005730502 📱";
  } else if (/komunitas|community|circle|vendetta|noire/.test(lower)) {
    reply = "Gabung komunitas ZhuuVIP di WhatsApp: chat.whatsapp.com/LC8ybe9WPZAEYO2lkmN4X4 🔥";
  } else if (/tools|tool/.test(lower)) {
    reply = "Info Zhuu Tools di: whatsapp.com/channel/0029VaXLuPM002TGAkbWtb3G ⚡";
  } else if (/halo|hai|hello|hi|hey/.test(lower)) {
    reply = "Halo! Saya Zhuu AI 🌊 Ada yang bisa saya bantu?";
  } else {
    reply = "Maaf, AI sedang tidak bisa dijangkau saat ini 🌊 Coba lagi sebentar ya!";
  }

  const words = reply.split(/(?<=\s)/);
  const stream = new ReadableStream({
    async start(controller) {
      for (const word of words) {
        const chunk = { choices: [{ delta: { content: word }, finish_reason: null }] };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        await new Promise((r) => setTimeout(r, 20));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let body: { messages?: Array<{ role: string; content: string }> };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = body.messages ?? [];
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";

  // 1. Try user's OpenAI key first (best quality)
  if (OPENAI_API_KEY) {
    const result = await tryOpenAI(messages, OPENAI_API_KEY, OPENAI_BASE_URL);
    if (result) return result;
  }

  // 2. Try Pollinations.ai (free, no key needed, real AI)
  const pollResult = await tryPollinations(messages);
  if (pollResult) return pollResult;

  // 3. Last resort: keyword fallback
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  return streamFallback(lastUser?.content ?? "");
}
