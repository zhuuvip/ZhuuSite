import { useState } from "react";

const TYPES = [
  { id: "bug", label: "🐛 Bug Report", desc: "Something isn't working" },
  { id: "feature", label: "✨ Feature Request", desc: "Suggest something new" },
  { id: "general", label: "💬 General Feedback", desc: "Share your thoughts" },
  { id: "other", label: "🌊 Other", desc: "Anything else" },
];

export default function Feedback() {
  const [type, setType] = useState("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/public/feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, rating: rating || null, name: name || null, email: email || null, message }),
      });
      if (res.ok) setSubmitted(true);
      else setError("Failed to send. Please try again.");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="ocean-bg min-h-screen pt-20 pb-28 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center glass-card p-10">
          <div className="text-5xl mb-5">🌊</div>
          <h2 className="text-2xl font-black gradient-text mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Thank you!</h2>
          <p className="mb-6" style={{ color: "rgba(0,180,200,0.55)", lineHeight: 1.7 }}>Your feedback has been received. We'll read every word and use it to improve ZhuuVIP.</p>
          <button onClick={() => { setSubmitted(false); setName(""); setEmail(""); setMessage(""); setRating(0); setType("general"); }}
            className="neon-btn-solid px-8 py-3 rounded-full font-semibold text-sm">Send another →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ocean-bg min-h-screen pt-20 pb-28 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black gradient-text mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>Feedback</h1>
          <p style={{ color: "rgba(0,180,200,0.45)", fontSize: 14 }}>Help us improve — every voice matters</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass-card p-5">
            <div className="text-xs font-semibold mb-3" style={{ color: "rgba(0,180,200,0.55)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Type</div>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(t => (
                <button key={t.id} type="button" onClick={() => setType(t.id)}
                  className="p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer"
                  style={{ background: type === t.id ? "rgba(0,200,220,0.1)" : "rgba(0,15,30,0.4)", border: `1px solid ${type === t.id ? "rgba(0,220,240,0.3)" : "rgba(0,200,220,0.08)"}` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: type === t.id ? "#00e5ff" : "rgba(0,180,200,0.65)" }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(0,180,200,0.35)", marginTop: 2 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="text-xs font-semibold mb-3" style={{ color: "rgba(0,180,200,0.55)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Rating</div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                  style={{ fontSize: 28, background: "none", border: "none", cursor: "pointer", transition: "transform 0.15s", transform: (hoverRating || rating) >= star ? "scale(1.2)" : "scale(1)", filter: (hoverRating || rating) >= star ? "none" : "grayscale(80%) opacity(0.4)" }}>⭐</button>
              ))}
            </div>
            {rating > 0 && <div style={{ fontSize: 12, color: "rgba(0,180,200,0.45)", marginTop: 6 }}>{["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}</div>}
          </div>

          <div className="glass-card p-5 space-y-3">
            <div className="text-xs font-semibold mb-1" style={{ color: "rgba(0,180,200,0.55)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Contact <span style={{ color: "rgba(0,180,200,0.25)", textTransform: "none", letterSpacing: "normal" }}>(optional)</span></div>
            {[["Name", name, setName, "text", "Your name"], ["Email", email, setEmail, "email", "your@email.com"]].map(([lbl, val, set, type_, ph]) => (
              <div key={lbl as string}>
                <label style={{ fontSize: 12, color: "rgba(0,180,200,0.45)", display: "block", marginBottom: 5 }}>{lbl as string}</label>
                <input type={type_ as string} value={val as string} onChange={e => (set as (v: string) => void)(e.target.value)} placeholder={ph as string}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "rgba(0,10,24,0.6)", border: "1px solid rgba(0,180,200,0.12)", color: "rgba(200,240,255,0.85)" }} />
              </div>
            ))}
          </div>

          <div className="glass-card p-5">
            <label style={{ fontSize: 12, color: "rgba(0,180,200,0.55)", display: "block", marginBottom: 8, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Message <span style={{ color: "#ff6b6b", textTransform: "none", letterSpacing: "normal" }}>*</span></label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell us what you think..." rows={4} required
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: "rgba(0,10,24,0.6)", border: "1px solid rgba(0,180,200,0.12)", color: "rgba(200,240,255,0.85)", lineHeight: 1.6 }} />
            <div style={{ fontSize: 11, color: "rgba(0,180,200,0.3)", marginTop: 5 }}>{message.length} chars</div>
          </div>

          {error && <div style={{ color: "#ff6b6b", fontSize: 13, textAlign: "center" }}>{error}</div>}

          <button type="submit" disabled={!message.trim() || loading} className="w-full py-3.5 rounded-full font-semibold text-sm transition-all duration-300"
            style={message.trim() && !loading ? {} : { background: "rgba(0,10,24,0.5)", border: "1px solid rgba(0,180,200,0.08)", color: "rgba(0,180,200,0.25)", cursor: "not-allowed" }}
            {...(message.trim() && !loading ? { className: "neon-btn-solid w-full py-3.5 rounded-full font-semibold text-sm" } : {})}>
            {loading ? "Sending..." : "Send Feedback 🌊"}
          </button>
        </form>
      </div>
    </div>
  );
}
