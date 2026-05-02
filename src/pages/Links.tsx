import { useEffect, useState } from "react";

const PROFILE = {
  username: "@zhuuvip",
  tagline: "JANGAN LUPA BUY & DONATE 🤖",
  avatar: "/zhuu-avatar.jpg",
};

const SOCIALS = [
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@zhuuvip",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/62882005730502",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@zhuuvip",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

const LINKS = [
  {
    id: "donate",
    label: "ZHUU DIRECT DONATION LINK",
    sublabel: "Support Zhuu via SociaBuzz",
    href: "https://sociabuzz.com/zhuuvip/tribe",
    emoji: "💰",
    color: "#facc15",
    glow: "rgba(250,204,21,0.35)",
    border: "rgba(250,204,21,0.3)",
    bg: "rgba(250,204,21,0.07)",
  },
  {
    id: "buy",
    label: "BUY DIRECTLY FROM ZHUU",
    sublabel: "WhatsApp · Direct purchase",
    href: "https://wa.me/62882005730502",
    emoji: "🛒",
    color: "#25d366",
    glow: "rgba(37,211,102,0.35)",
    border: "rgba(37,211,102,0.3)",
    bg: "rgba(37,211,102,0.07)",
  },
  {
    id: "cc",
    label: "JOIN CC PEPENG VENDETTA NOIRE",
    sublabel: "WhatsApp Community · Free to join",
    href: "https://chat.whatsapp.com/CUaCIYrQsu2IvL31LsV6RE",
    emoji: "⚔️",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.35)",
    border: "rgba(167,139,250,0.3)",
    bg: "rgba(167,139,250,0.07)",
  },
  {
    id: "channel",
    label: "Zhuu Tool Information",
    sublabel: "WhatsApp Channel · Follow for updates",
    href: "https://whatsapp.com/channel/0029VaXLuPM002TGAkbWtb3G",
    emoji: "📡",
    color: "#00e5ff",
    glow: "rgba(0,229,255,0.35)",
    border: "rgba(0,229,255,0.3)",
    bg: "rgba(0,229,255,0.07)",
  },
];

export default function Links() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  return (
    <div
      className="ocean-bg min-h-screen pt-16 pb-32 md:pb-16 flex flex-col items-center"
      data-testid="links-page"
    >
      {/* ── Profile Header ───────────────────────────────────── */}
      <div
        className={`flex flex-col items-center pt-12 pb-6 px-4 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* Avatar with glow rings */}
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          {/* Outer pulse ring */}
          <div style={{
            position: "absolute", width: 128, height: 128, borderRadius: "50%",
            border: "1.5px solid rgba(0,255,255,0.2)",
            animation: "pulse-glow 3s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", width: 110, height: 110, borderRadius: "50%",
            border: "1px solid rgba(0,255,255,0.1)",
          }} />
          {/* Glow */}
          <div style={{
            position: "absolute", width: 96, height: 96, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,200,220,0.2) 0%, transparent 70%)",
            filter: "blur(6px)",
          }} />
          {/* Avatar */}
          <div style={{
            width: 96, height: 96, borderRadius: "50%", overflow: "hidden",
            border: "3px solid rgba(0,255,255,0.55)",
            boxShadow: "0 0 24px rgba(0,255,255,0.45), 0 0 48px rgba(0,200,220,0.2)",
            position: "relative", zIndex: 1,
            animation: "float-gentle 6s ease-in-out infinite",
          }}>
            <img
              src="/zhuu-avatar.jpg"
              alt="Zhuu"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
        </div>

        {/* Username */}
        <h1
          className="gradient-text font-black text-2xl mb-1"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {PROFILE.username}
        </h1>
        {/* Tagline */}
        <p className="text-white/60 text-sm font-medium text-center max-w-xs">
          {PROFILE.tagline}
        </p>

        {/* Social icons */}
        <div
          className={`flex items-center gap-5 mt-5 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "0.25s" }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              style={{
                width: 42, height: 42, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center",
                background: "rgba(0,200,220,0.08)",
                border: "1px solid rgba(0,255,255,0.2)",
                color: "rgba(0,220,240,0.7)",
                transition: "all 0.25s ease",
                boxShadow: "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "rgba(0,200,220,0.18)";
                el.style.borderColor = "rgba(0,255,255,0.5)";
                el.style.color = "#00ffff";
                el.style.boxShadow = "0 0 14px rgba(0,255,255,0.35)";
                el.style.transform = "scale(1.12)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "rgba(0,200,220,0.08)";
                el.style.borderColor = "rgba(0,255,255,0.2)";
                el.style.color = "rgba(0,220,240,0.7)";
                el.style.boxShadow = "none";
                el.style.transform = "scale(1)";
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* ── Link Cards ───────────────────────────────────────── */}
      <div className="w-full max-w-md px-4 flex flex-col gap-3">
        {LINKS.map((link, i) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`link-card-${link.id}`}
            className={`block transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{
              transitionDelay: `${0.35 + i * 0.1}s`,
              textDecoration: "none",
            }}
            onMouseEnter={() => setHovered(link.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderRadius: 16,
                background: hovered === link.id ? link.bg : "rgba(4,14,24,0.75)",
                border: `1px solid ${hovered === link.id ? link.border : "rgba(255,255,255,0.08)"}`,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: hovered === link.id
                  ? `0 0 24px ${link.glow}, 0 8px 32px rgba(0,0,0,0.4)`
                  : "0 2px 16px rgba(0,0,0,0.35)",
                transition: "all 0.25s ease",
                transform: hovered === link.id ? "scale(1.02)" : "scale(1)",
                cursor: "pointer",
              }}
            >
              {/* Icon circle */}
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: `${link.color}18`,
                border: `1.5px solid ${link.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
                boxShadow: hovered === link.id ? `0 0 14px ${link.color}50` : "none",
                transition: "box-shadow 0.25s ease",
              }}>
                {link.emoji}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: hovered === link.id ? link.color : "rgba(255,255,255,0.9)",
                  lineHeight: 1.3,
                  transition: "color 0.2s ease",
                  letterSpacing: "0.01em",
                }}>
                  {link.label}
                </div>
                {link.sublabel && (
                  <div style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    marginTop: 3,
                    fontWeight: 400,
                  }}>
                    {link.sublabel}
                  </div>
                )}
              </div>

              {/* Arrow */}
              <div style={{
                flexShrink: 0,
                width: 28, height: 28, borderRadius: "50%",
                background: `${link.color}12`,
                border: `1px solid ${link.color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: link.color,
                fontSize: 13,
                fontWeight: 700,
                transition: "all 0.2s ease",
                transform: hovered === link.id ? "translateX(3px)" : "translateX(0)",
              }}>
                →
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div
        className={`mt-10 text-center transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "0.85s" }}
      >
        <div className="gradient-text text-sm font-bold mb-1">ZhuuVIP</div>
        <div className="text-cyan-400/30 text-xs">© {new Date().getFullYear()} ZhuuVIP · Underwater Digital World</div>
      </div>
    </div>
  );
}
