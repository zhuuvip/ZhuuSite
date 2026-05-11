import { Link } from "wouter";
import UnderwaterMascot from "@/components/UnderwaterMascot";
import { useState } from "react";

const STATS = [
  { label: "Community Members", value: "10K+", icon: "👥" },
  { label: "Projects Shared", value: "500+", icon: "🚀" },
  { label: "Speed Tests Run", value: "50K+", icon: "⚡" },
  { label: "Links Saved", value: "200+", icon: "🔗" },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Speed Test",
    desc: "Real-time internet speed testing with download, upload, and ping measurement.",
    path: "/speedtest",
    color: "#00ffff",
  },
  {
    icon: "✨",
    title: "Zhuu AI",
    desc: "Chat with Zhuu AI — your deep-sea AI companion powered by OpenAI.",
    path: "/ai",
    color: "#a78bfa",
  },
  {
    icon: "💼",
    title: "Portfolio",
    desc: "Explore projects and works curated by Zhuu and the community.",
    path: "/portfolio",
    color: "#34d399",
  },
  {
    icon: "🌊",
    title: "Community",
    desc: "Join our underwater world. Meet creators, share ideas, and grow together.",
    path: "/community",
    color: "#60a5fa",
  },
  {
    icon: "🔗",
    title: "Links",
    desc: "Curated links, resources, and tools from across the web.",
    path: "/links",
    color: "#f9a8d4",
  },
  {
    icon: "💬",
    title: "Feedback",
    desc: "Share your thoughts, ideas, and suggestions to improve ZhuuVIP.",
    path: "/feedback",
    color: "#fcd34d",
  },
];

const MESSAGES = [
  "Welcome to the deep 🌊",
  "Dive into something amazing!",
  "Let's explore the ocean together 🐠",
  "Your VIP pass to the deep sea!",
];

export default function Home() {
  const [msgIdx] = useState(() => Math.floor(Math.random() * MESSAGES.length));

  return (
    <div className="ocean-bg min-h-screen pt-16 pb-24">
      <section className="flex flex-col items-center justify-center min-h-[90vh] px-4 text-center relative">
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,200,220,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="relative z-10 flex flex-col items-center">
          <UnderwaterMascot size={140} message={MESSAGES[msgIdx]} className="mb-8" />

          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: "rgba(0,200,220,0.08)", border: "1px solid rgba(0,255,255,0.2)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 6px rgba(74,222,128,0.7)" }} />
            <span className="text-xs" style={{ color: "rgba(0,200,220,0.8)", fontWeight: 500 }}>Deep ocean, online 24/7</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-5 leading-none" style={{ fontFamily: "Poppins, sans-serif" }}>
            <span className="gradient-text">Zhuu</span>
            <span className="text-white">VIP</span>
          </h1>

          <p className="text-cyan-300/70 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Your VIP portal to the deep ocean. Speed tests, AI chat, community, portfolio, and more — all in one place.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/community">
              <button className="neon-btn-solid px-8 py-4 rounded-full font-bold text-base">
                Join the Community 🌊
              </button>
            </Link>
            <Link href="/ai">
              <button className="neon-btn px-8 py-4 rounded-full font-bold text-base"
                style={{ borderColor: "rgba(167,139,250,0.5)", color: "#c4b5fd" }}>
                Chat with Zhuu AI ✨
              </button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-cyan-400" style={{ letterSpacing: "0.1em" }}>SCROLL</span>
          <div style={{ width: 1.5, height: 30, background: "linear-gradient(180deg, rgba(0,255,255,0.6), transparent)" }} />
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="glass-card glass-card-hover p-5 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-black gradient-text mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{stat.value}</div>
              <div className="text-xs" style={{ color: "rgba(0,200,220,0.5)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider mx-auto max-w-3xl mb-16" />

      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black gradient-text mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
              Explore ZhuuVIP
            </h2>
            <p style={{ color: "rgba(0,200,220,0.5)" }}>Everything you need, in the deep ocean</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <Link key={f.path} href={f.path}>
                <div className="glass-card glass-card-hover p-6 cursor-pointer h-full">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: f.color, fontFamily: "Poppins, sans-serif" }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: "rgba(0,200,220,0.55)", lineHeight: 1.6 }}>{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1.5" style={{ color: f.color, fontSize: 13, fontWeight: 500 }}>
                    Explore →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-2xl mx-auto text-center glass-card p-10">
          <div className="text-4xl mb-4">🌊</div>
          <h2 className="text-3xl font-black gradient-text mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Ready to dive in?</h2>
          <p className="mb-6" style={{ color: "rgba(0,200,220,0.55)" }}>Join ZhuuVIP and become part of the deep ocean community.</p>
          <Link href="/community">
            <button className="neon-btn-solid px-10 py-4 rounded-full font-bold text-base">
              Join Now →
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
