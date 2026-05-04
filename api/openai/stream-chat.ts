export const config = { runtime: "edge" };

const FALLBACK: Array<{ keys: RegExp; reply: string }> = [
  {
    keys: /\b(halo|hai|hello|hi|hey|hei|assalamu|selamat)\b/i,
    reply: "Halo! Saya Zhuu AI 🌊✨\n\nSenang bertemu dengan Anda! Saya bisa membantu dengan:\n- **Pertanyaan** seputar ZhuuVIP & komunitas\n- **Info** tools, donasi, dan links\n- **Tips** gaming dan konten\n\nMau tanya apa hari ini? 😊",
  },
  {
    keys: /\b(siapa kamu|who are you|kamu siapa|lo siapa|what are you)\b/i,
    reply: "Saya **Zhuu AI** 🤖🌊 — asisten AI dari ZhuuVIP!\n\nSaya hadir untuk membantu kamu dengan berbagai pertanyaan, info komunitas, tools ZhuuVIP, dan hal-hal seru lainnya. Dipersembahkan oleh **ZhuuVIP** untuk komunitas terbaik! 🎮💜",
  },
  {
    keys: /\b(donate|donasi|support|saweria|sociabuzz|traktir|derma)\b/i,
    reply: "Terima kasih sudah ingin support Zhuu! 🙏💜\n\nKamu bisa donasi langsung melalui:\n👉 **sociabuzz.com/zhuuvip/tribe**\n\nSetiap donasi sangat berarti dan membantu Zhuu terus berkarya untuk komunitas! ❤️",
  },
  {
    keys: /\b(whatsapp|wa|beli|order|produk|jasa|service|chat)\b/i,
    reply: "Untuk **order / beli langsung** dari Zhuu, hubungi via WhatsApp:\n\n📱 **wa.me/62882005730502**\n\nTim Zhuu siap melayani kamu dengan cepat! 🌊",
  },
  {
    keys: /\b(komunitas|community|group|grup|circle|vendetta|noire|join|gabung)\b/i,
    reply: "Yuk gabung **Circle Vendetta Noire** — komunitas eksklusif ZhuuVIP! 🔥\n\nLink komunitas WhatsApp:\n👉 **chat.whatsapp.com/LC8ybe9WPZAEYO2lkmN4X4**\n\nGratis, aktif, dan penuh konten seru! 🎮🌊",
  },
  {
    keys: /\b(tools|tool|aplikasi|app|software|program)\b/i,
    reply: "Untuk info lengkap tentang **Zhuu Tools**, cek channel info kami:\n\n📢 **whatsapp.com/channel/0029VaXLuPM002TGAkbWtb3G**\n\nUpdate tools terbaru selalu diposting di sana! ⚡",
  },
  {
    keys: /\b(speedtest|speed test|internet|kecepatan|koneksi|bandwidth|ping)\b/i,
    reply: "Cek **kecepatan internet** kamu langsung di halaman Speed Test ZhuuVIP! 🚀\n\nKlik menu **Speed Test** di navigasi — tersedia tes download, upload, dan ping secara real-time.\n\nPastikan koneksi kamu optimal sebelum gaming! 🎮",
  },
  {
    keys: /\b(code|coding|kode|program|javascript|python|react|html|css|typescript|bug|error|debug)\b/i,
    reply: "Wah, pertanyaan coding! 💻🌊\n\nSaya siap membantu dengan berbagai topik:\n- **JavaScript / TypeScript**\n- **Python**\n- **React / Vue / Angular**\n- **HTML & CSS**\n\nSilakan ceritakan masalah atau kode yang ingin kamu tanyakan! 🔧",
  },
  {
    keys: /\b(game|gaming|gim|main|play|ff|free fire|mlbb|mobile legend|valorant|pubg)\b/i,
    reply: "Gaming time! 🎮🔥\n\nZhuuVIP adalah rumah para gamer! Bergabunglah dengan **Circle Vendetta Noire** untuk:\n- Tips & trick gaming\n- Squad & team up\n- Tournament info\n- Konten gaming terbaru\n\nLink: **chat.whatsapp.com/LC8ybe9WPZAEYO2lkmN4X4** 🌊",
  },
  {
    keys: /\b(terima kasih|makasih|thanks|thank you|thx|mantap|keren|bagus|good|great|nice|sip)\b/i,
    reply: "Sama-sama! 😊🌊\n\nSenang bisa membantu! Jangan ragu untuk tanya apa saja lagi ya. Zhuu AI selalu siap di sini untuk kamu! ✨",
  },
  {
    keys: /\b(portfolio|karya|project|projek|hasil|work|desain|design)\b/i,
    reply: "Portfolio ZhuuVIP ada di halaman **Portfolio** website ini! 🎨\n\nLihat berbagai karya dan project dari Zhuu — dari design, tools, hingga konten komunitas. Semuanya di sana! 💜",
  },
  {
    keys: /\b(linktree|link|sosmed|social media|tiktok|youtube|instagram|semua link)\b/i,
    reply: "Semua link penting ZhuuVIP ada di halaman **Linktree**! 🔗\n\n📌 Link aktif:\n- 💜 **Donate** → sociabuzz.com/zhuuvip/tribe\n- 🛒 **Beli Langsung** → wa.me/62882005730502\n- 👥 **Circle Vendetta Noire** → WA Community\n- 📢 **Zhuu Tools Info** → WA Channel\n\nKlik menu Linktree di navigasi! 🌊",
  },
  {
    keys: /\b(musik|music|lagu|song|bgm|background music|indila|love story)\b/i,
    reply: "Musik background yang mengalun adalah **Indila — Love Story** 🎵🌊\n\nKamu bisa pause/play musik dengan tombol di pojok kanan bawah layar. 🎶",
  },
];

function smartReply(userMessages: Array<{ role: string; content: string }>): string {
  const lastUser = [...userMessages].reverse().find((m) => m.role === "user");
  const msg = lastUser?.content ?? "";
  for (const { keys, reply } of FALLBACK) {
    if (keys.test(msg)) return reply;
  }
  return `Halo! Saya Zhuu AI 🌊✨\n\nSaya bisa membantu kamu dengan info seputar ZhuuVIP:\n\n- 💜 **Donasi** → sociabuzz.com/zhuuvip/tribe\n- 📱 **Order/Beli** → wa.me/62882005730502\n- 👥 **Komunitas** → Circle Vendetta Noire\n- ⚡ **Tools** → Zhuu Tools Channel\n- 🚀 **Speed Test** internet\n\nTanyakan sesuatu tentang ZhuuVIP atau topik apa saja! 😊`;
}

async function streamText(text: string): Promise<Response> {
  const encoder = new TextEncoder();
  const words = text.split(/(?<=\s)/);
  const stream = new ReadableStream({
    async start(controller) {
      for (const word of words) {
        const chunk = { choices: [{ delta: { content: word }, finish_reason: null }] };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        await new Promise((r) => setTimeout(r, 18 + Math.random() * 22));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
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
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "Content-Type": "application/json" } }); }

  const messages = body.messages ?? [];
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";

  if (OPENAI_API_KEY) {
    try {
      const upstream = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are Zhuu AI — a friendly, ocean-themed assistant for ZhuuVIP. You speak both Indonesian and English. Help with ZhuuVIP tools, gaming, community, coding, and general topics. Keep replies concise and warm." },
            ...messages,
          ],
          stream: true,
          max_tokens: 1024,
        }),
      });
      if (upstream.ok && upstream.body) {
        return new Response(upstream.body, {
          status: 200,
          headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive", "Access-Control-Allow-Origin": "*" },
        });
      }
    } catch { /* fall through */ }
  }

  return streamText(smartReply(messages));
}
