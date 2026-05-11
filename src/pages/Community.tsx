import { useEffect, useState } from "react";

interface CommunityLink {
  id: number;
  name: string;
  icon: string;
  description: string;
  url: string;
  members: string;
  btnText: string;
  color: string;
  badge?: string;
  sortOrder: number;
  active: boolean;
}

const RULES = [
  { icon: "🌊", title: "Be respectful", desc: "Treat everyone with kindness and respect. No harassment or hate speech." },
  { icon: "💡", title: "Share & inspire", desc: "Share your work, ideas, and knowledge to inspire others in the community." },
  { icon: "🤝", title: "Collaborate", desc: "Reach out, team up, and help others. We grow together." },
  { icon: "🌐", title: "Stay on topic", desc: "Keep discussions relevant and constructive. Use the right channels." },
];

export default function Community() {
  const [platforms, setPlatforms] = useState<CommunityLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/community")
      .then(r => r.ok ? r.json() : [])
      .then(setPlatforms)
      .catch(() => setPlatforms([]))
      .finally(() => setLoading(false));
  }, []);

  const discord = platforms.find(p => p.name.toLowerCase().includes("discord"));

  return (
    <div className="ocean-bg min-h-screen pt-20 pb-28 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🌊</div>
          <h1 className="text-4xl font-black gradient-text mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Join the Community</h1>
          <p style={{ color: "rgba(0,200,220,0.5)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            Dive into ZhuuVIP's ocean community. A space for creators, developers, and dreamers to connect and grow.
          </p>
        </div>

        {discord && (
          <div className="glass-card p-8 mb-10 text-center" style={{ background: "linear-gradient(135deg, rgba(0,100,150,0.15), rgba(0,50,100,0.15))" }}>
            <div className="text-4xl mb-4">{discord.icon}</div>
            <h2 className="text-2xl font-black gradient-text mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>{discord.name}</h2>
            <p className="mb-6" style={{ color: "rgba(0,200,220,0.6)" }}>{discord.description || "Our main community hub. Meet the crew, share work, get feedback, and have fun!"}</p>
            <a href={discord.url} target="_blank" rel="noopener noreferrer">
              <button className="neon-btn-solid px-10 py-4 rounded-full font-bold text-base">
                {discord.btnText} →
              </button>
            </a>
            {discord.members && (
              <div className="mt-4 flex justify-center gap-6">
                <div className="text-center">
                  <div className="font-black text-lg gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>{discord.members}</div>
                  <div className="text-xs" style={{ color: "rgba(0,200,220,0.4)" }}>Members</div>
                </div>
                <div className="text-center">
                  <div className="font-black text-lg gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>#general</div>
                  <div className="text-xs" style={{ color: "rgba(0,200,220,0.4)" }}>Channels</div>
                </div>
                <div className="text-center">
                  <div className="font-black text-lg gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>24/7</div>
                  <div className="text-xs" style={{ color: "rgba(0,200,220,0.4)" }}>Active</div>
                </div>
              </div>
            )}
          </div>
        )}

        <h2 className="text-2xl font-black gradient-text mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>Find Us Everywhere</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card p-6 animate-pulse" style={{ minHeight: 140 }}>
                <div style={{ width: "60%", height: 16, background: "rgba(0,200,220,0.08)", borderRadius: 8, marginBottom: 12 }} />
                <div style={{ width: "90%", height: 12, background: "rgba(0,200,220,0.05)", borderRadius: 6, marginBottom: 6 }} />
                <div style={{ width: "70%", height: 12, background: "rgba(0,200,220,0.05)", borderRadius: 6 }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {platforms.map((p) => (
              <div key={p.id} className="glass-card glass-card-hover p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <h3 className="font-bold" style={{ color: p.color, fontFamily: "Poppins, sans-serif" }}>{p.name}</h3>
                  </div>
                  {p.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}30` }}>
                      {p.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm mb-4" style={{ color: "rgba(0,200,220,0.55)", lineHeight: 1.6 }}>{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "rgba(0,200,220,0.4)" }}>{p.members ? `${p.members} followers` : ""}</span>
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    <button className="neon-btn px-4 py-2 rounded-full text-sm font-semibold"
                      style={{ borderColor: `${p.color}50`, color: p.color }}>
                      {p.btnText} →
                    </button>
                  </a>
                </div>
              </div>
            ))}

            {platforms.length === 0 && !loading && (
              <div className="col-span-full text-center py-12" style={{ color: "rgba(0,180,200,0.35)" }}>
                No community links yet — add some in the Admin panel.
              </div>
            )}
          </div>
        )}

        <div className="glass-card p-8">
          <h2 className="text-2xl font-black gradient-text mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>Community Guidelines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RULES.map((r) => (
              <div key={r.title} className="flex gap-4 p-4 rounded-xl" style={{ background: "rgba(0,200,220,0.04)", border: "1px solid rgba(0,200,220,0.08)" }}>
                <span className="text-2xl flex-shrink-0">{r.icon}</span>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: "rgba(0,220,240,0.85)" }}>{r.title}</h4>
                  <p className="text-sm" style={{ color: "rgba(0,200,220,0.5)", lineHeight: 1.55 }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
