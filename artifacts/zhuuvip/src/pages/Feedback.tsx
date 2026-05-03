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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="ocean-bg min-h-screen pt-20 pb-28 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center glass-card p-10">
          <div className="text-6xl mb-6" style={{ animation: "float-gentle 3s ease-in-out infinite" }}>🌊</div>
          <h2 className="text-2xl font-black gradient-text mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Thanks for your feedback!</h2>
          <p className="mb-6" style={{ color: "rgba(0,200,220,0.55)", lineHeight: 1.7 }}>
            Your message has been received. It means a lot to us — we'll read every word and use it to improve ZhuuVIP!
          </p>
          <button onClick={() => { setSubmitted(false); setName(""); setEmail(""); setMessage(""); setRating(0); setType("general"); }}
            className="neon-btn-solid px-8 py-3.5 rounded-full font-bold">
            Send Another →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ocean-bg min-h-screen pt-20 pb-28 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black gradient-text mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>Feedback</h1>
          <p style={{ color: "rgba(0,200,220,0.5)" }}>Help us improve ZhuuVIP — every voice matters</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4" style={{ color: "rgba(0,200,220,0.8)" }}>What kind of feedback?</h3>
            <div className="grid grid-cols-2 gap-3">
              {TYPES.map((t) => (
                <button key={t.id} type="button" onClick={() => setType(t.id)}
                  className="p-4 rounded-xl text-left transition-all duration-200"
                  style={{
                    background: type === t.id ? "rgba(0,200,220,0.12)" : "rgba(0,20,40,0.4)",
                    border: `1px solid ${type === t.id ? "rgba(0,255,255,0.4)" : "rgba(0,200,220,0.1)"}`,
                    boxShadow: type === t.id ? "0 0 15px rgba(0,200,220,0.1)" : "none",
                    cursor: "pointer",
                  }}>
                  <div className="text-base mb-1" style={{ color: type === t.id ? "#00ffff" : "rgba(0,200,220,0.7)", fontWeight: 600 }}>{t.label}</div>
                  <div className="text-xs" style={{ color: "rgba(0,200,220,0.4)" }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4" style={{ color: "rgba(0,200,220,0.8)" }}>Rate your experience</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ fontSize: 32, background: "none", border: "none", cursor: "pointer", transition: "transform 0.15s ease", transform: (hoverRating || rating) >= star ? "scale(1.15)" : "scale(1)" }}>
                  <span style={{ filter: (hoverRating || rating) >= star ? "drop-shadow(0 0 6px rgba(255,210,50,0.6))" : "grayscale(80%)" }}>⭐</span>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="mt-2 text-sm" style={{ color: "rgba(0,200,220,0.5)" }}>
                {["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold mb-2" style={{ color: "rgba(0,200,220,0.8)" }}>Contact Info <span style={{ color: "rgba(0,200,220,0.35)", fontWeight: 400, fontSize: 13 }}>(optional)</span></h3>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(0,200,220,0.55)" }}>Name</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "rgba(0,20,40,0.6)", border: "1px solid rgba(0,200,220,0.15)", color: "rgba(200,240,255,0.9)" }}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(0,200,220,0.55)" }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "rgba(0,20,40,0.6)", border: "1px solid rgba(0,200,220,0.15)", color: "rgba(200,240,255,0.9)" }}
              />
            </div>
          </div>

          {/* Message */}
          <div className="glass-card p-6">
            <label className="font-semibold mb-3 block" style={{ color: "rgba(0,200,220,0.8)" }}>
              Your Message <span style={{ color: "#ff6b6b", fontSize: 12 }}>*</span>
            </label>
            <textarea
              value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Tell us what you think, what you'd like to see, or what needs fixing..."
              rows={5}
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: "rgba(0,20,40,0.6)", border: "1px solid rgba(0,200,220,0.15)", color: "rgba(200,240,255,0.9)", lineHeight: 1.6 }}
            />
            <div className="mt-2 text-xs" style={{ color: "rgba(0,200,220,0.35)" }}>{message.length} characters</div>
          </div>

          <button type="submit" disabled={!message.trim()}
            className={`w-full py-4 rounded-full font-bold text-base transition-all duration-300 ${message.trim() ? "neon-btn-solid" : ""}`}
            style={!message.trim() ? { background: "rgba(0,20,40,0.4)", border: "1px solid rgba(0,200,220,0.1)", color: "rgba(0,200,220,0.3)", cursor: "not-allowed" } : {}}>
            Send Feedback 🌊
          </button>
        </form>
      </div>
    </div>
  );
}
