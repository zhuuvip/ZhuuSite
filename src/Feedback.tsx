import { useState, useEffect } from "react";

interface FeedbackEntry {
  id: string;
  name: string;
  rating: number;
  category: string;
  message: string;
  timestamp: number;
}

const STORAGE_KEY = "zhuuvip_feedback";
const CATEGORIES = ["General", "Speed Test", "Portfolio", "Community", "Music", "Design", "Bug Report", "Suggestion"];

function loadFeedback(): FeedbackEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFeedback(list: FeedbackEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function timeAgo(ts: number): string {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{
            background: "none", border: "none", cursor: onChange ? "pointer" : "default",
            fontSize: 28, padding: 0, lineHeight: 1,
            transition: "transform 0.15s ease",
            transform: (hover || value) >= star && onChange ? "scale(1.2)" : "scale(1)",
            filter: (hover || value) >= star
              ? "drop-shadow(0 0 6px rgba(250,204,21,0.7))"
              : "none",
          }}
        >
          {(hover || value) >= star ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  const color = rating >= 4 ? "#4ade80" : rating === 3 ? "#facc15" : "#f87171";
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
      background: `${color}18`, border: `1px solid ${color}40`, color,
    }}>
      {"⭐".repeat(rating)}
    </span>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  "General": "#00e5ff", "Speed Test": "#facc15", "Portfolio": "#a78bfa",
  "Community": "#f97316", "Music": "#e879f9", "Design": "#4ade80",
  "Bug Report": "#f87171", "Suggestion": "#38bdf8",
};

export default function Feedback() {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState<"submit" | "view">("submit");
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);
  const [filterCat, setFilterCat] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");

  // Form state
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    setFeedbackList(loadFeedback());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (rating === 0) { setError("Please select a rating."); return; }
    if (message.trim().length < 10) { setError("Message must be at least 10 characters."); return; }
    setError("");

    const entry: FeedbackEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      name: name.trim(),
      rating,
      category,
      message: message.trim(),
      timestamp: Date.now(),
    };
    const updated = [entry, ...loadFeedback()];
    saveFeedback(updated);
    setFeedbackList(updated);
    setSubmitted(true);
    setName(""); setRating(0); setCategory(CATEGORIES[0]); setMessage("");
    setTimeout(() => setSubmitted(false), 4000);
    setTimeout(() => setTab("view"), 1500);
  };

  const displayList = feedbackList
    .filter(f => filterCat === "All" || f.category === filterCat)
    .sort((a, b) =>
      sortBy === "newest" ? b.timestamp - a.timestamp :
      sortBy === "highest" ? b.rating - a.rating : a.rating - b.rating
    );

  const avgRating = feedbackList.length
    ? (feedbackList.reduce((s, f) => s + f.rating, 0) / feedbackList.length).toFixed(1)
    : "—";

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: 12,
    background: "rgba(0,200,220,0.06)", border: "1px solid rgba(0,255,255,0.15)",
    color: "white", fontSize: 14, outline: "none", transition: "border-color 0.2s",
    fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <div className="ocean-bg min-h-screen pt-16 pb-32 md:pb-16" data-testid="feedback-page">
      {/* Hero */}
      <section className="relative py-14 px-4 text-center overflow-hidden">
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-sm font-semibold tracking-widest text-cyan-400/60 uppercase mb-4">
            💬 Community Voice
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
            <span className="gradient-text">Feedback</span>
          </h1>
          <p className="text-cyan-200/50 max-w-xl mx-auto text-base leading-relaxed">
            Share your thoughts, rate your experience, and help ZhuuVIP grow. 
            Every voice matters from the deep.
          </p>
        </div>

        {/* Summary stats */}
        {feedbackList.length > 0 && (
          <div className={`flex justify-center gap-8 mt-8 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "0.3s" }}>
            {[
              { icon: "📝", value: feedbackList.length.toString(), label: "Total Feedback" },
              { icon: "⭐", value: avgRating, label: "Avg Rating" },
              { icon: "🌊", value: `${feedbackList.filter(f => f.rating >= 4).length}`, label: "5-Star Reviews" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xl mb-0.5">{s.icon}</div>
                <div className="text-2xl font-black gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>{s.value}</div>
                <div className="text-xs text-cyan-400/40">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tab switcher */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <div className="flex gap-2 p-1.5 rounded-2xl" style={{ background: "rgba(0,200,220,0.06)", border: "1px solid rgba(0,255,255,0.1)" }}>
          {(["submit", "view"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 14, fontWeight: 600, fontSize: 14,
                transition: "all 0.25s ease", cursor: "pointer", border: "none",
                background: tab === t
                  ? "linear-gradient(135deg, rgba(0,200,220,0.85), rgba(0,120,200,0.8))"
                  : "transparent",
                color: tab === t ? "white" : "rgba(0,200,220,0.55)",
                boxShadow: tab === t ? "0 0 20px rgba(0,200,220,0.3)" : "none",
              }}
              data-testid={`tab-${t}`}
            >
              {t === "submit" ? "✍️ Leave Feedback" : `👁 View All (${feedbackList.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">

        {/* ── Submit Tab ────────────────────────────────────────── */}
        {tab === "submit" && (
          <div className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "0.2s" }}>

            {/* Success banner */}
            {submitted && (
              <div style={{
                padding: "14px 20px", borderRadius: 14, marginBottom: 20,
                background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.35)",
                color: "#4ade80", fontWeight: 600, fontSize: 14, textAlign: "center",
                animation: "scale-in 0.3s ease",
              }}>
                🎉 Thank you! Your feedback has been submitted and is now live.
              </div>
            )}

            <form onSubmit={handleSubmit} className="glass-card p-7 flex flex-col gap-5" noValidate data-testid="feedback-form">
              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(0,220,240,0.7)", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rizky, Anonymous..."
                  style={inputStyle}
                  maxLength={40}
                  data-testid="feedback-name"
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = "rgba(0,255,255,0.45)"}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = "rgba(0,255,255,0.15)"}
                />
              </div>

              {/* Rating */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(0,220,240,0.7)", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Rating
                </label>
                <StarRating value={rating} onChange={setRating} />
                {rating > 0 && (
                  <div style={{ marginTop: 6, fontSize: 12, color: "rgba(250,204,21,0.7)" }}>
                    {["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(0,220,240,0.7)", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Category
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {CATEGORIES.map(cat => {
                    const color = CATEGORY_COLORS[cat] || "#00e5ff";
                    const isActive = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        style={{
                          padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                          cursor: "pointer", transition: "all 0.2s ease", border: "1px solid",
                          background: isActive ? `${color}20` : "rgba(0,200,220,0.04)",
                          borderColor: isActive ? `${color}60` : "rgba(0,255,255,0.1)",
                          color: isActive ? color : "rgba(0,200,220,0.5)",
                          boxShadow: isActive ? `0 0 10px ${color}30` : "none",
                        }}
                        data-testid={`category-${cat}`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(0,220,240,0.7)", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Your Feedback
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us what you think about ZhuuVIP... Share your experience, suggestions, or anything you'd like us to know!"
                  rows={5}
                  maxLength={500}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                  data-testid="feedback-message"
                  onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "rgba(0,255,255,0.45)"}
                  onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = "rgba(0,255,255,0.15)"}
                />
                <div style={{ textAlign: "right", fontSize: 11, color: "rgba(0,200,220,0.3)", marginTop: 4 }}>
                  {message.length}/500
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", fontSize: 13 }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="neon-btn-solid"
                style={{ padding: "14px 0", borderRadius: 50, fontWeight: 700, fontSize: 15, width: "100%", cursor: "pointer" }}
                data-testid="feedback-submit"
              >
                Send Feedback 🚀
              </button>
            </form>
          </div>
        )}

        {/* ── View Tab ──────────────────────────────────────────── */}
        {tab === "view" && (
          <div className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "0.1s" }}>

            {/* Filters */}
            <div className="glass-card p-4 mb-5 flex flex-wrap items-center gap-3">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1 }}>
                {["All", ...CATEGORIES].map(cat => {
                  const color = CATEGORY_COLORS[cat] || "#00e5ff";
                  const isActive = filterCat === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilterCat(cat)}
                      style={{
                        padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                        cursor: "pointer", transition: "all 0.2s", border: "1px solid",
                        background: isActive ? `${cat === "All" ? "#00e5ff" : color}20` : "transparent",
                        borderColor: isActive ? `${cat === "All" ? "#00e5ff" : color}50` : "rgba(0,255,255,0.1)",
                        color: isActive ? (cat === "All" ? "#00e5ff" : color) : "rgba(0,200,220,0.4)",
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                style={{
                  background: "rgba(0,200,220,0.08)", border: "1px solid rgba(0,255,255,0.2)",
                  color: "rgba(0,220,240,0.8)", borderRadius: 10, padding: "6px 10px",
                  fontSize: 12, cursor: "pointer", outline: "none",
                }}
              >
                <option value="newest">Newest</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>

            {displayList.length === 0 ? (
              <div className="glass-card p-12 text-center" data-testid="no-feedback">
                <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
                <h3 className="gradient-text font-bold text-xl mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {feedbackList.length === 0 ? "No Feedback Yet" : "No Results"}
                </h3>
                <p className="text-cyan-400/40 text-sm">
                  {feedbackList.length === 0
                    ? "Be the first to share your thoughts about ZhuuVIP!"
                    : "Try a different filter to see more feedback."}
                </p>
                {feedbackList.length === 0 && (
                  <button
                    onClick={() => setTab("submit")}
                    className="neon-btn mt-6 px-6 py-2.5 rounded-full text-sm font-semibold inline-block"
                  >
                    Leave Feedback →
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }} data-testid="feedback-list">
                {displayList.map((f, i) => {
                  const catColor = CATEGORY_COLORS[f.category] || "#00e5ff";
                  return (
                    <div
                      key={f.id}
                      className="glass-card p-5"
                      style={{ animation: `slide-in-up 0.4s ease ${i * 0.06}s both` }}
                      data-testid={`feedback-entry-${f.id}`}
                    >
                      {/* Header row */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {/* Avatar initial */}
                          <div style={{
                            width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                            background: `linear-gradient(135deg, rgba(0,200,220,0.2), rgba(0,120,200,0.15))`,
                            border: "1px solid rgba(0,255,255,0.25)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 800, fontSize: 16, color: "#00e5ff",
                            textTransform: "uppercase",
                          }}>
                            {f.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "white" }}>{f.name}</div>
                            <div style={{ fontSize: 11, color: "rgba(0,200,220,0.4)" }}>{timeAgo(f.timestamp)}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                          <RatingBadge rating={f.rating} />
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                            background: `${catColor}14`, border: `1px solid ${catColor}35`, color: catColor,
                            whiteSpace: "nowrap",
                          }}>
                            {f.category}
                          </span>
                        </div>
                      </div>
                      {/* Message */}
                      <p style={{ fontSize: 13, color: "rgba(200,230,240,0.75)", lineHeight: 1.6, margin: 0 }}>
                        "{f.message}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slide-in-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
