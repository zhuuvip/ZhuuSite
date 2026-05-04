const SOCIAL_LINKS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
      </svg>
    ),
    url: "https://tiktok.com/@zhuuvip",
    label: "TikTok",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
    url: "https://wa.me/62882005730502",
    label: "WhatsApp",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    url: "https://youtube.com/@zhuuvip",
    label: "YouTube",
  },
];

const LINKS = [
  {
    id: "donate",
    title: "LINK DONATE LIVE ZHUU",
    subtitle: null,
    url: "https://sociabuzz.com/zhuuvip/tribe",
    icon: "/zhuu-avatar.jpg",
    iconType: "avatar",
    color: "#ff6b35",
    badge: "💰 Support",
  },
  {
    id: "buy-wa",
    title: "BELI LANGSUNG DI ZHUU",
    subtitle: "WhatsApp · Chat langsung",
    url: "https://wa.me/62882005730502",
    icon: "/zhuu-avatar.jpg",
    iconType: "avatar",
    color: "#25d366",
    badge: "🛒 Shop",
  },
  {
    id: "cc-vendetta",
    title: "JOIN CIRCLE VENDETTA NOIRE",
    subtitle: "WhatsApp Community · Free to join",
    url: "https://chat.whatsapp.com/LC8ybe9WPZAEYO2lkmN4X4",
    icon: "VN",
    iconType: "text",
    iconBg: "linear-gradient(135deg, #1a0533, #2d0a5e)",
    color: "#a855f7",
    badge: "⚔️ Community",
  },
  {
    id: "zhuu-tools",
    title: "Zhuu Tools Information",
    subtitle: "Saluran Informasi · WhatsApp Channel",
    url: "https://whatsapp.com/channel/0029VaXLuPM002TGAkbWtb3G",
    icon: "/zhuu-logo.png",
    iconType: "avatar",
    color: "#00ffff",
    badge: "🛠️ Tools",
  },
];

export default function Linktree() {
  return (
    <div
      className="min-h-screen pt-16 pb-24 flex flex-col items-center"
      style={{
        background: "linear-gradient(180deg, #0a0014 0%, #050f14 40%, #010810 100%)",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 400, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at top, rgba(120,60,200,0.15) 0%, transparent 70%)",
      }} />

      <div className="relative w-full max-w-md px-4 pt-10 pb-6 flex flex-col items-center" style={{ zIndex: 1 }}>

        {/* Avatar */}
        <div className="mb-4 relative">
          <div style={{
            width: 96, height: 96, borderRadius: "50%", overflow: "hidden",
            border: "3px solid rgba(150,80,255,0.6)",
            boxShadow: "0 0 30px rgba(120,60,200,0.4), 0 0 60px rgba(80,40,160,0.2)",
          }}>
            <img
              src="/zhuu-avatar.jpg"
              alt="Zhuu VIP"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
          {/* Online dot */}
          <div style={{
            position: "absolute", bottom: 4, right: 4,
            width: 16, height: 16, borderRadius: "50%",
            background: "#4ade80", border: "2px solid #050f14",
            boxShadow: "0 0 8px rgba(74,222,128,0.7)",
          }} />
        </div>

        {/* Name */}
        <h1
          className="text-2xl font-black mb-1"
          style={{ fontFamily: "Poppins, sans-serif", color: "#ffffff", letterSpacing: "-0.01em" }}
        >
          @zhuuvip
        </h1>

        {/* Bio */}
        <p className="text-sm mb-5 text-center" style={{ color: "rgba(200,180,255,0.7)", maxWidth: 260, lineHeight: 1.5 }}>
          JANGAN LUPA BUY &amp; DONATE 🧸
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-4 mb-8">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              style={{
                width: 40, height: 40, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.75)",
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Link Buttons */}
        <div className="w-full flex flex-col gap-3">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.25s ease",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.09)";
                  el.style.borderColor = `${link.color}50`;
                  el.style.boxShadow = `0 0 20px ${link.color}20`;
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.04)";
                  el.style.borderColor = "rgba(255,255,255,0.09)";
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* Left icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0, overflow: "hidden",
                  border: `1px solid ${link.color}30`,
                  background: link.iconType === "text" ? (link.iconBg ?? "rgba(0,0,0,0.3)") : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {link.iconType === "text" ? (
                    <span style={{ fontWeight: 900, fontSize: 13, color: link.color, fontFamily: "Poppins, sans-serif", letterSpacing: "-0.02em" }}>
                      {link.icon as string}
                    </span>
                  ) : (
                    <img
                      src={link.icon as string}
                      alt={link.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                    />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#ffffff", fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>
                    {link.title}
                  </div>
                  {link.subtitle && (
                    <div style={{ fontSize: 11, color: "rgba(200,180,255,0.5)", marginTop: 2 }}>
                      {link.subtitle}
                    </div>
                  )}
                </div>

                {/* Badge */}
                <div style={{
                  flexShrink: 0, fontSize: 11, fontWeight: 600,
                  padding: "3px 8px", borderRadius: 20,
                  background: `${link.color}18`,
                  color: link.color,
                  border: `1px solid ${link.color}30`,
                  whiteSpace: "nowrap",
                }}>
                  {link.badge}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <div style={{ height: 1, width: 60, background: "linear-gradient(90deg, transparent, rgba(150,80,255,0.3), transparent)" }} />
          <p style={{ color: "rgba(150,100,200,0.35)", fontSize: 11 }}>ZhuuVIP · Deep Ocean Platform</p>
        </div>
      </div>

      {/* Floating CTA at bottom (like Linktree) */}
      <div
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "12px 16px",
          background: "rgba(10,0,20,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(150,80,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200,
        }}
      >
        <a href="/community" style={{ textDecoration: "none" }}>
          <div style={{
            padding: "10px 24px", borderRadius: 40,
            background: "linear-gradient(135deg, rgba(120,60,200,0.9), rgba(80,40,160,0.9))",
            border: "1px solid rgba(150,80,255,0.5)",
            color: "#ffffff", fontWeight: 700, fontSize: 13,
            fontFamily: "Poppins, sans-serif",
            boxShadow: "0 0 20px rgba(120,60,200,0.3)",
            cursor: "pointer",
          }}>
            🌊 Bergabung dengan zhuuvip di ZhuuVIP
          </div>
        </a>
      </div>
    </div>
  );
}
