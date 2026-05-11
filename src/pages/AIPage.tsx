import { useState, useRef, useEffect, useCallback } from "react";
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

interface Session {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

const PROVIDERS = [
  { id: "openai", label: "GPT-4o mini", icon: "🤖", desc: "Vision ✓" },
  { id: "claude", label: "Claude Haiku", icon: "🧠", desc: "Vision ✓" },
  { id: "deepseek", label: "DeepSeek", icon: "🔍", desc: "" },
  { id: "gemini", label: "Gemini Flash", icon: "💫", desc: "Vision ✓" },
  { id: "pollinations", label: "Pollinations", icon: "🌱", desc: "Free" },
];

const AI_ICON = () => (
  <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(150,100,255,0.5)", flexShrink: 0, boxShadow: "0 0 10px rgba(150,100,255,0.2)" }}>
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
    blocks.push({ index: match.index, end: match.index + match[0].length, node: <pre key={match.index} style={{ margin: "8px 0", overflowX: "auto" }}><code style={{ display: "block" }}>{match[2].trim()}</code></pre> });
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

const SUGGESTIONS = [
  "Apa yang bisa kamu bantu?",
  "Ceritakan tentang ZhuuVIP",
  "Write a short poem about the ocean",
  "Bagaimana cara bergabung komunitas?",
  "Analisa gambar ini untuk saya 🖼️",
];

declare global { interface Window { SpeechRecognition: new () => SpeechRecognition; webkitSpeechRecognition: new () => SpeechRecognition; } }

function newSessionId() { return `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

export default function AIPage() {
  const { user } = useUser();
  const storageKey = `zhuu_ai_sessions_${user?.id ?? "anonymous"}`;
  const activeKey = `zhuu_ai_active_${user?.id ?? "anonymous"}`;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    try {
      const savedSessions: Session[] = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      const savedActiveId = localStorage.getItem(activeKey) ?? "";
      if (savedSessions.length > 0) {
        setSessions(savedSessions);
        const active = savedSessions.find(s => s.id === savedActiveId) ?? savedSessions[0];
        setActiveSessionId(active.id);
        setMessages(active.messages);
      } else {
        startNewSession(savedSessions);
      }
    } catch { startNewSession([]); }
  }, [storageKey]);

  function startNewSession(currentSessions?: Session[]) {
    const id = newSessionId();
    const newSession: Session = { id, title: "New Chat", messages: [], updatedAt: Date.now() };
    const updated = [newSession, ...(currentSessions ?? sessions)].slice(0, 20);
    setSessions(updated);
    setActiveSessionId(id);
    setMessages([]);
    setShowSessions(false);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.setItem(activeKey, id);
    } catch { }
  }

  function switchSession(id: string) {
    const s = sessions.find(s => s.id === id);
    if (!s) return;
    setActiveSessionId(id);
    setMessages(s.messages);
    setShowSessions(false);
    try { localStorage.setItem(activeKey, id); } catch { }
  }

  function deleteSession(id: string) {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch { }
    if (id === activeSessionId) {
      if (updated.length > 0) switchSession(updated[0].id);
      else startNewSession([]);
    }
  }

  function persistMessages(newMessages: Message[], sessionId: string) {
    setSessions(prev => {
      const title = newMessages.find(m => m.role === "user")
        ? (typeof newMessages.find(m => m.role === "user")!.content === "string"
            ? (newMessages.find(m => m.role === "user")!.content as string).slice(0, 40)
            : "Image Chat")
        : "New Chat";
      const updated = prev.map(s => s.id === sessionId ? { ...s, messages: newMessages, title, updatedAt: Date.now() } : s);
      try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch { }
      return updated;
    });
  }

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamingText, loading]);

  const sendMessage = useCallback(async (overrideText?: string, overrideImage?: string) => {
    const text = (overrideText ?? input).trim();
    const img = overrideImage ?? pendingImage;
    if ((!text && !img) || loading) return;

    const content: MsgContent = img
      ? [{ type: "text", text: text || "Apa yang ada di gambar ini?" }, { type: "image_url", image_url: { url: img } }]
      : text;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content, imageUrl: img ?? undefined };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    persistMessages(newMessages, activeSessionId);
    setInput(""); setPendingImage(null); setLoading(true); setStreamingText("");

    try {
      const history = newMessages.map(m => ({ role: m.role, content: m.content }));
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
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: full };
      const withAi = [...newMessages, aiMsg];
      setMessages(withAi);
      persistMessages(withAi, activeSessionId);
      setStreamingText("");
    } catch {
      const errMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "Maaf, terjadi kesalahan. Silakan coba lagi! 🌊" };
      const withErr = [...newMessages, errMsg];
      setMessages(withErr);
      persistMessages(withErr, activeSessionId);
      setStreamingText("");
    } finally { setLoading(false); }
  }, [input, loading, messages, pendingImage, activeSessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const handleImageFile = (file: File) => { const r = new FileReader(); r.onload = () => setPendingImage(r.result as string); r.readAsDataURL(file); };
  const handlePaste = (e: React.ClipboardEvent) => { for (const item of Array.from(e.clipboardData.items)) { if (item.type.startsWith("image/")) { const f = item.getAsFile(); if (f) handleImageFile(f); } } };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleImageFile(f); };

  const toggleVoice = () => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input not supported in this browser"); return; }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const sr = new SR();
    sr.lang = "id-ID"; sr.interimResults = true;
    sr.onresult = (e) => { setInput(Array.from(e.results).map(r => r[0].transcript).join("")); if (e.results[e.results.length - 1].isFinal) setIsListening(false); };
    sr.onend = () => setIsListening(false);
    sr.start(); recognitionRef.current = sr; setIsListening(true);
  };

  const msgText = (content: MsgContent): string =>
    typeof content === "string" ? content : (content as (ContentPart | ImagePart)[]).filter((p): p is ContentPart => p.type === "text").map(p => p.text).join("");

  const isEmpty = messages.length === 0;
  const currentSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="ocean-bg min-h-screen flex flex-col" style={{ paddingTop: 60, paddingBottom: 0 }}>
      <div className="flex flex-col" style={{ height: "calc(100dvh - 60px)", maxWidth: 800, margin: "0 auto", width: "100%", padding: "0 16px" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0 6px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setShowSessions(!showSessions)}
              style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(0,15,35,0.7)", border: "1px solid rgba(0,180,210,0.15)", color: "rgba(0,200,240,0.65)", fontSize: 12, cursor: "pointer" }}>
              💬 {currentSession?.title?.slice(0, 20) || "Chat"} ▾
            </button>
            {user && <span style={{ fontSize: 11, color: "rgba(0,180,210,0.35)" }}>{user.firstName ?? user.emailAddresses?.[0]?.emailAddress?.split("@")[0]}</span>}
          </div>
          <button onClick={() => startNewSession()}
            style={{ padding: "5px 14px", borderRadius: 20, background: "linear-gradient(135deg, rgba(110,70,240,0.6), rgba(55,90,210,0.6))", border: "1px solid rgba(140,90,255,0.3)", color: "rgba(200,180,255,0.85)", fontSize: 12, cursor: "pointer" }}>
            + New Chat
          </button>
        </div>

        {showSessions && (
          <div style={{ background: "rgba(0,8,22,0.97)", border: "1px solid rgba(0,180,210,0.1)", borderRadius: 14, padding: 10, marginBottom: 8, maxHeight: 200, overflowY: "auto", flexShrink: 0 }}>
            {sessions.length === 0 && <div style={{ color: "rgba(0,180,200,0.35)", fontSize: 12, textAlign: "center", padding: "12px 0" }}>No sessions yet</div>}
            {sessions.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 10, background: s.id === activeSessionId ? "rgba(0,180,210,0.07)" : "transparent", cursor: "pointer", marginBottom: 2 }}
                onClick={() => switchSession(s.id)}>
                <span style={{ fontSize: 12 }}>💬</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: s.id === activeSessionId ? "rgba(0,220,240,0.85)" : "rgba(0,180,200,0.6)", fontWeight: s.id === activeSessionId ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.title || "New Chat"}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(0,180,200,0.3)" }}>{s.messages.length} messages</div>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteSession(s.id); }}
                  style={{ fontSize: 11, color: "rgba(255,80,80,0.4)", background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }}>✕</button>
              </div>
            ))}
          </div>
        )}

        {isEmpty && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4" style={{ gap: 24 }}>
            <div className="flex flex-col items-center gap-3">
              <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(150,100,255,0.4)", boxShadow: "0 0 30px rgba(150,100,255,0.2), 0 0 60px rgba(100,60,200,0.1)" }}>
                <img src="/zhuu-avatar.jpg" alt="Zhuu AI" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              </div>
              <h1 className="gradient-text font-black" style={{ fontFamily: "Poppins, sans-serif", fontSize: 26 }}>Zhuu AI</h1>
              <p style={{ color: "rgba(0,180,200,0.45)", fontSize: 14, maxWidth: 360 }}>
                Tanya apa saja — saya bisa Bahasa Indonesia & English. Kirim gambar untuk analisis, gunakan input suara, atau ketik saja 🌊
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2" style={{ maxWidth: 560 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  style={{ padding: "8px 14px", borderRadius: 20, background: "rgba(0,15,35,0.7)", border: "1px solid rgba(0,180,210,0.15)", color: "rgba(0,200,240,0.6)", fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(0,30,60,0.8)"; el.style.borderColor = "rgba(0,200,240,0.3)"; el.style.color = "rgba(0,220,255,0.8)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(0,15,35,0.7)"; el.style.borderColor = "rgba(0,180,210,0.15)"; el.style.color = "rgba(0,200,240,0.6)"; }}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {PROVIDERS.map(p => (
                <div key={p.id} style={{ padding: "5px 11px", borderRadius: 20, background: "rgba(0,10,25,0.6)", border: "1px solid rgba(0,180,210,0.1)", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12 }}>{p.icon}</span>
                  <span style={{ fontSize: 11, color: "rgba(0,180,210,0.45)" }}>{p.label}</span>
                  {p.desc && <span style={{ fontSize: 9, color: "rgba(0,180,210,0.3)" }}>{p.desc}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {!isEmpty && (
          <div className="flex-1 overflow-y-auto py-4" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map(msg => (
              <div key={msg.id} className="msg-fade-in" style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
                {msg.role === "assistant" && <AI_ICON />}
                {msg.role === "user" && (
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: user?.imageUrl ? "transparent" : "linear-gradient(135deg, rgba(110,70,240,0.7), rgba(55,90,210,0.7))", border: "1.5px solid rgba(140,90,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, overflow: "hidden" }}>
                    {user?.imageUrl ? <img src={user.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🧑"}
                  </div>
                )}
                <div style={{ maxWidth: "75%", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "12px 15px", fontSize: 14, lineHeight: 1.65, background: msg.role === "user" ? "linear-gradient(135deg, rgba(110,70,240,0.75), rgba(55,90,210,0.75))" : "rgba(0,15,35,0.7)", border: msg.role === "user" ? "1px solid rgba(140,90,255,0.35)" : "1px solid rgba(0,180,210,0.12)", color: msg.role === "user" ? "rgba(255,255,255,0.95)" : "rgba(185,240,255,0.9)", backdropFilter: "blur(8px)" }}>
                  {msg.imageUrl && <img src={msg.imageUrl} alt="uploaded" style={{ maxWidth: "100%", maxHeight: 240, borderRadius: 10, marginBottom: 8, objectFit: "contain" }} />}
                  {formatContent(msgText(msg.content))}
                </div>
              </div>
            ))}
            {loading && !streamingText && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <AI_ICON />
                <div style={{ padding: "14px 16px", background: "rgba(0,15,35,0.7)", borderRadius: "18px 18px 18px 4px", border: "1px solid rgba(0,180,210,0.12)", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2].map(i => <div key={i} className="typing-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(0,180,210,0.65)" }} />)}
                </div>
              </div>
            )}
            {streamingText && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <AI_ICON />
                <div style={{ maxWidth: "75%", padding: "12px 15px", background: "rgba(0,15,35,0.7)", borderRadius: "18px 18px 18px 4px", border: "1px solid rgba(0,180,210,0.12)", fontSize: 14, lineHeight: 1.65, color: "rgba(185,240,255,0.9)" }}>
                  {formatContent(streamingText)}
                  <span style={{ display: "inline-block", width: 7, height: 15, background: "rgba(0,180,210,0.65)", marginLeft: 2, animation: "typing-cursor 0.8s ease infinite" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div style={{ paddingBottom: 80, paddingTop: 10, flexShrink: 0 }} onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
          {pendingImage && (
            <div style={{ marginBottom: 8, padding: "8px 12px", background: "rgba(0,15,35,0.7)", border: "1px solid rgba(150,100,255,0.2)", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <img src={pendingImage} alt="pending" style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(150,100,255,0.3)" }} />
              <span style={{ flex: 1, fontSize: 12, color: "rgba(150,100,255,0.7)" }}>Gambar siap dikirim — AI akan menganalisisnya</span>
              <button onClick={() => setPendingImage(null)} style={{ background: "none", border: "none", color: "rgba(150,100,255,0.5)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
            </div>
          )}
          <div style={{ background: "rgba(0,8,22,0.92)", border: "1px solid rgba(0,180,210,0.12)", borderRadius: 18, padding: "10px 12px", backdropFilter: "blur(20px)", boxShadow: "0 4px 30px rgba(0,0,0,0.3)" }}>
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} onPaste={handlePaste}
              placeholder={isListening ? "🎙️ Mendengarkan..." : "Tanya apa saja... (tempel gambar, drag & drop, atau bicara)"}
              rows={2} style={{ width: "100%", background: "transparent", border: "none", color: "rgba(195,230,255,0.9)", fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.55, display: "block", marginBottom: 8 }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 6 }}>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = ""; }} />
                <button onClick={() => fileInputRef.current?.click()} title="Lampirkan gambar"
                  style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(0,15,35,0.7)", border: "1px solid rgba(0,180,210,0.12)", color: "rgba(0,180,210,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>📎</button>
                <button onClick={toggleVoice} title="Input suara"
                  style={{ width: 34, height: 34, borderRadius: 9, background: isListening ? "rgba(255,80,80,0.2)" : "rgba(0,15,35,0.7)", border: `1px solid ${isListening ? "rgba(255,80,80,0.4)" : "rgba(0,180,210,0.12)"}`, color: isListening ? "rgba(255,100,100,0.9)" : "rgba(0,180,210,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
                  {isListening ? "🔴" : "🎙️"}
                </button>
              </div>
              <button onClick={() => sendMessage()} disabled={(!input.trim() && !pendingImage) || loading}
                style={{ padding: "9px 20px", borderRadius: 12, cursor: (input.trim() || pendingImage) && !loading ? "pointer" : "default", background: (input.trim() || pendingImage) && !loading ? "linear-gradient(135deg, rgba(110,70,240,0.9), rgba(55,90,210,0.9))" : "rgba(0,15,35,0.5)", border: `1px solid ${(input.trim() || pendingImage) && !loading ? "rgba(140,90,255,0.5)" : "rgba(0,180,210,0.08)"}`, color: (input.trim() || pendingImage) && !loading ? "white" : "rgba(0,180,210,0.25)", fontSize: 13, fontWeight: 600, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                Kirim
              </button>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "rgba(0,180,210,0.25)" }}>
            Powered by OpenAI · Claude · DeepSeek · Gemini · Pollinations
          </div>
        </div>
      </div>
      <style>{`@keyframes typing-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  );
}
