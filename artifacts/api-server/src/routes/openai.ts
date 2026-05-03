import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  baseURL: process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"],
  apiKey: process.env["AI_INTEGRATIONS_OPENAI_API_KEY"],
});

function isCodeRelated(messages: { role: string; content: string }[]): boolean {
  const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content?.toLowerCase() || "";
  const codeKeywords = ["code", "function", "class", "debug", "error", "bug", "script", "program", "algorithm",
    "javascript", "typescript", "python", "react", "css", "html", "sql", "api", "implement", "fix", "refactor"];
  return codeKeywords.some(kw => lastUserMsg.includes(kw));
}

const SYSTEM_PROMPT = `You are Zhuu AI, a friendly and knowledgeable AI assistant for ZhuuVIP — a deep-ocean themed VIP community platform. 

You have a warm, enthusiastic personality with a subtle ocean/deep-sea theme. You:
- Are helpful, accurate, and thorough
- Enjoy coding, creative writing, answering questions, and exploring ideas
- Occasionally use ocean-related metaphors naturally (not forced)
- Format code in markdown code blocks
- Are concise but comprehensive

The ZhuuVIP platform includes: Speed Test, Portfolio, Community, Links, Feedback pages, and you (Zhuu AI).`;

router.post("/stream-chat", async (req, res) => {
  const { messages } = req.body as { messages: Array<{ role: "user" | "assistant"; content: string }> };

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array required" });
    return;
  }

  const model = isCodeRelated(messages) ? "gpt-4o" : "gpt-4o-mini";

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  try {
    const stream = await openai.chat.completions.create({
      model,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-20),
      ],
      max_tokens: 2048,
      temperature: 0.7,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      if (delta) {
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: delta } }] })}\n\n`);
      }
      if (chunk.choices[0]?.finish_reason === "stop") {
        res.write("data: [DONE]\n\n");
        break;
      }
    }
  } catch (err) {
    req.log.error({ err }, "OpenAI stream error");
    res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
  } finally {
    res.end();
  }
});

export default router;
