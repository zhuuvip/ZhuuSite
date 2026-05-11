import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useUser } from "@clerk/react";

interface ContentPart { type: "text"; text: string; }
interface ImagePart { type: "image_url"; image_url: { url: string }; }
type MsgContent = string | (ContentPart | ImagePart)[];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: MsgContent;
  imageUrl?: string;
}

const AI_ICON = () => (
  <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(150,100,255,0.5)", flexShrink: 0, boxShadow: "0 0 8px rgba(150,100,255,0.25)" }}>
    <img src="/zhuu-avatar.jpg" alt="Zhuu AI" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
  </div>
);

function formatContent(text: string) {
  const parts: React.ReactNode[] = [];
  const codeBlockRe = /```(\w+)?\n?([\s\S]*?)```/g;
  const inlineRe = /`([^`]+)`/g;
  let lastIndex = 0, match;
  const blocks: { index: number; end: number; node: React.ReactNode }[] = [];
  while ((match = codeBlockRe.exec(text)) !== null) {
    blocks.push({ index: match.index, end: match.index + match[0].length, node: <pre key={match.index} style={{ margin: "6px 0" }}><code style={{ display: "block" }}>{match[2].trim()}</code></pre> });
  }
  for (const b of blocks) {
    if (b.index > lastIndex) {
      const seg = text.slice(lastIndex, b.index).replace(inlineRe, '<code>$1</code>').replace(/\n/g, '<br/>');
      parts.push(<span key={lastIndex} dangerouslySetInnerHTML={{ __html: seg }} />);
    }
    parts.push(b.node);
    lastIndex = b.end;
  }
  if (lastIndex < text.length) {
    const seg = text.slice(lastIndex).replace(inlineRe, '<code>$1</code>').replace(/\n/g, '<br/>');
    parts.push(<span key={lastIndex} dangerouslySetInnerHTML={{ __html: seg }} />);
  }
  return parts;
}

declare global { interface Window { SpeechRecognition: new () => SpeechRecognition; webkitSpeechRecognition: new () => SpeechRecognition; } }

const INIT_MSG: Message = { id: "init", role: "assistant", content: "Hey! Saya Zhuu AI 🌊 Tanya apa saja — atau kirim gambar untuk saya analisis!" };

export default function ZhuuAIChat() {
  const [location] = useLocation();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INIT_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const sessionKey = `zhuu_chat_widget_${user?.id ?? "anonymous"}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(sessionKey);
      if (saved) {
        const parsed: Message[] = JSON.parse(saved);
        if (parsed.length > 0) setMessages(parsed);
      }
    } catch { }
  }, [sessionKey]);

  useEffect(() => {
    try { localStorage.setItem(sessionKey, JSON.stringify(messages)); } catch { }
  }, [messages, sessionKey]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamingText, loading]);

  const clearChat = () => {
    setMessages([INIT_MSG]);
    try { localStorage.removeItem(sessionKey); } catch { }
  };

  const sendMessage = useCallback(async (overrideText?: string, overrideImage?: string) => {
    const text = (overrideText ?? input).trim();
    const img = overrideImage ?? pendingImage;
    if ((!text && !img) || loading) return;

    const content: MsgContent = img
      ? [{ type: "text", text: text || "Apa yang ada di gambar ini?" }, { type: "image_url", image_url: { url: img } }]
      : text;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content, imageUrl: img ?? undefined };
    setMessages(prev => [...prev, userMsg]);
    setInput(""); setPendingImage(null); setLoading(true); setStreamingText("");

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/openai/stream-chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
      if (!res.ok || !res.body) throw new Error("Failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value, { stream: true }).split("\n")) {
          if (line.startsWith("data: ")) {
            const d = line.slice(6).trim();
            if (d === "[DONE]") continue;
            try { const delta = JSON.parse(d).choices?.[0]?.delta?.content; if (typeof delta === "string") { full += delta; setStreamingText(full); } } catch { }
          }
        }
      }
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: full }]);
      setStreamingText("");
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Terjadi kesalahan. Coba lagi ya! 🌊" }]);
      setStreamingText("");
    } finally { setLoading(false); }
  }, [input, loading, messages, pendingImage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    for (const item of Array.from(e.clipboardData.items)) {
      if (item.type.startsWith("image/")) { const file = item.getAsFile(); if (file) handleImageFile(file); }
    }
  };

  const toggleVoice = () => {
    const SRClass = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SRClass) return;
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const sr = new SRClass();
    sr.lang = "id-ID"; sr.interimResults = true;
    sr.onresult = (e) => {
      setInput(Array.from(e.results).map(r => r[0].transcript).join(""));
      if (e.results[e.results.length - 1].isFinal) setIsListening(false);
    };
    sr.onend = () => setIsListening(false);
    sr.start(); recognitionRef.current = sr; setIsListening(true);
  };

  const msgText = (content: MsgContent): string =>
    typeof content === "string" ? content : (content as (ContentPart | ImagePart)[]).filter((p): p is ContentPart => p.type === "text").map(p => p.text).join("");

  if (location === "/ai") return null;

  return (
    <>
      <button onClick={() => setOpen(!open)} title="Zhuu AI Chat"
        style={{ position: "fixed", bottom: 80, left: 20, zIndex: 150, width: 50, height: 50, borderRadius: "50%", background: open ? "rgba(100,60,200,0.9)" : "linear-gradient(135deg, rgba(120,80,255,0.85), rgba(60,100,220,0.85))", border: "2px solid rgba(150,100,255,0.55)", boxShadow: "0 0 18px rgba(150,100,255,0.35), 0 0 36px rgba(100,60,200,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease", fontSize: 20 }}>
        {open ? "✕" : "✨"}
      </button>

      {open && (
        <div style={{ position: "fixed", bottom: 140, left: 16, zIndex: 150, width: 340, maxWidth: "calc(100vw - 32px)", height: 480, background: "rgba(2,8,20,0.98)", border: "1px solid rgba(150,100,255,0.25)", borderRadius: 20, boxShadow: "0 0 40px rgba(100,60,200,0.15), 0 20px 60px rgba(0,0,0,0.5)", backdropFilter: "blur(24px)", display: "flex", flexDirection: "column", overflow: "hidden", animation: "page-enter 0.3s ease forwards" }}>
          <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 9, background: "linear-gradient(90deg, rgba(100,60,200,0.12), rgba(50,80,180,0.08))", borderBottom: "1px solid rgba(150,100,255,0.15)", flexShrink: 0 }}>
            <AI_ICON />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#c4b5fd", fontSize: 12.5, fontFamily: "Poppins, sans-serif" }}>Zhuu AI</div>
              <div style={{ fontSize: 9.5, color: "rgba(150,100,255,0.5)" }}>
                {user ? `${user.firstName ?? user.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? "User"} · ` : ""}Multi-model · Vision
              </div>
            </div>
            <button onClick={clearChat} title="New chat" style={{ background: "none", border: "1px solid rgba(150,100,255,0.15)", borderRadius: 6, color: "rgba(150,100,255,0.45)", cursor: "pointer", fontSize: 10, padding: "3px 7px" }}>New</button>
            <div style={{ display: "flex", gap: 4, alignItems: "center", marginLeft: 2 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 5px rgba(74,222,128,0.6)" }} />
              <span style={{ fontSize: 9, color: "rgba(74,222,128,0.6)" }}>Online</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((msg) => (
              <div key={msg.id} className="msg-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ display: "flex", gap: 6, alignItems: "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                  {msg.role === "assistant" && <AI_ICON />}
                  <div style={{ maxWidth: "82%", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "9px 11px", fontSize: 12.5, lineHeight: 1.55, background: msg.role === "user" ? "linear-gradient(135deg, rgba(110,70,240,0.8), rgba(55,90,210,0.8))" : "rgba(0,15,35,0.85)", border: msg.role === "user" ? "1px solid rgba(140,90,255,0.35)" : "1px solid rgba(0,180,210,0.12)", color: msg.role === "user" ? "rgba(255,255,255,0.93)" : "rgba(180,238,255,0.88)" }}>
                    {msg.imageUrl && <img src={msg.imageUrl} alt="uploaded" style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 6 }} />}
                    {formatContent(msgText(msg.content))}
                  </div>
                </div>
              </div>
            ))}
            {loading && !streamingText && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <AI_ICON />
                <div style={{ padding: "10px 12px", background: "rgba(0,15,35,0.85)", borderRadius: "14px 14px 14px 4px", border: "1px solid rgba(0,180,210,0.12)", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map(i => <div key={i} className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(0,180,210,0.65)" }} />)}
                </div>
              </div>
            )}
            {streamingText && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <AI_ICON />
                <div style={{ maxWidth: "82%", padding: "9px 11px", background: "rgba(0,15,35,0.85)", borderRadius: "14px 14px 14px 4px", border: "1px solid rgba(0,180,210,0.12)", fontSize: 12.5, lineHeight: 1.55, color: "rgba(180,238,255,0.88)" }}>
                  {formatContent(streamingText)}
                  <span style={{ display: "inline-block", width: 6, height: 13, background: "rgba(0,180,210,0.65)", marginLeft: 2, animation: "typing-cursor 0.8s ease infinite" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {pendingImage && (
            <div style={{ padding: "6px 10px", borderTop: "1px solid rgba(150,100,255,0.1)", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <img src={pendingImage} alt="pending" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(150,100,255,0.3)" }} />
              <span style={{ fontSize: 11, color: "rgba(150,100,255,0.6)", flex: 1 }}>Gambar terlampir — siap dikirim</span>
              <button onClick={() => setPendingImage(null)} style={{ background: "none", border: "none", color: "rgba(150,100,255,0.5)", cursor: "pointer", fontSize: 14 }}>×</button>
            </div>
          )}

          <div style={{ padding: "8px 10px", borderTop: "1px solid rgba(150,100,255,0.12)", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = ""; }} />
              <button onClick={() => fileInputRef.current?.click()} title="Lampirkan gambar" style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,15,35,0.7)", border: "1px solid rgba(150,100,255,0.2)", color: "rgba(150,100,255,0.55)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>📎</button>
              <button onClick={toggleVoice} title="Input suara" style={{ width: 32, height: 32, borderRadius: 8, background: isListening ? "rgba(255,80,80,0.2)" : "rgba(0,15,35,0.7)", border: `1px solid ${isListening ? "rgba(255,80,80,0.4)" : "rgba(150,100,255,0.2)"}`, color: isListening ? "rgba(255,100,100,0.9)" : "rgba(150,100,255,0.55)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>
                {isListening ? "🔴" : "🎙️"}
              </button>
              <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} onPaste={handlePaste}
                placeholder={isListening ? "Mendengarkan..." : "Tanya apa saja, atau tempel gambar..."}
                rows={1} style={{ flex: 1, background: "rgba(0,15,35,0.7)", border: "1px solid rgba(140,90,255,0.2)", borderRadius: 10, padding: "8px 10px", color: "rgba(195,225,255,0.9)", fontSize: 12.5, resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.4, maxHeight: 70, overflowY: "auto" }} />
              <button onClick={() => sendMessage()} disabled={(!input.trim() && !pendingImage) || loading}
                style={{ width: 34, height: 34, borderRadius: 9, cursor: (input.trim() || pendingImage) && !loading ? "pointer" : "default", background: (input.trim() || pendingImage) && !loading ? "linear-gradient(135deg, rgba(110,70,240,0.9), rgba(55,90,210,0.9))" : "rgba(0,15,35,0.5)", border: `1px solid ${(input.trim() || pendingImage) && !loading ? "rgba(140,90,255,0.5)" : "rgba(140,90,255,0.12)"}`, color: (input.trim() || pendingImage) && !loading ? "white" : "rgba(140,90,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes typing-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </>
  );
}
