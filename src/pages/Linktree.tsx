import { useState, useEffect } from "react";

interface Link { id: number; title: string; subtitle?: string; url: string; icon?: string; iconType?: string; color: string; badge?: string; }

const SOCIAL_LINKS = [
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" /></svg>, url: "https://tiktok.com/@zhuuvip", label: "TikTok" },
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>, url: "https://wa.me/62882005730502", label: "WhatsApp" },
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>, url: "https://youtube.com/@zhuuvip", label: "YouTube" },
];

function LinkCard({ link }: { link: Link }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 15px", borderRadius: 14, background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.035)", border: `1px solid ${hovered ? link.color + "40" : "rgba(255,255,255,0.07)"}`, boxShadow: hovered ? `0 4px 20px ${link.color}15` : "none", transition: "all 0.22s ease", transform: hovered ? "translateY(-2px)" : "none", cursor: "pointer" }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0, overflow: "hidden", border: `1px solid ${link.color}25`, background: link.iconType === "text" ? "rgba(0,0,0,0.4)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {link.iconType === "text" ? (
            <span style={{ fontWeight: 900, fontSize: 12, color: link.color, fontFamily: "Poppins, sans-serif" }}>{link.icon}</span>
          ) : link.icon?.startsWith("/") || link.icon?.startsWith("http") ? (
            <img src={link.icon} alt={link.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
          ) : (
            <span style={{ fontSize: 20 }}>{link.icon}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontWeight: 700, fontSize: 13, color: "#ffffff", fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>{link.title}</div>
          {link.subtitle && <div style={{ fontSize: 11, color: "rgba(200,180,255,0.45)", marginTop: 2 }}>{link.subtitle}</div>}
        </div>
        {link.badge && (
          <div style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: `${link.color}15`, color: link.color, border: `1px solid ${link.color}25`, whiteSpace: "nowrap" }}>{link.badge}</div>
        )}
      </div>
    </a>
  );
}

export default function Linktree() {
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    fetch("/api/public/linktree").then(r => r.ok ? r.json() : []).then(setLinks).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen pt-16 pb-28 flex flex-col items-center" style={{ background: "linear-gradient(180deg, #080012 0%, #050e14 40%, #010810 100%)" }}>
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 350, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse at top, rgba(100,50,180,0.12) 0%, transparent 70%)" }} />

      <div className="relative w-full max-w-sm px-4 pt-10 pb-6 flex flex-col items-center" style={{ zIndex: 1 }}>
        <div className="mb-4 relative">
          <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(130,70,220,0.5)", boxShadow: "0 0 24px rgba(100,50,180,0.3), 0 0 48px rgba(70,30,140,0.15)" }}>
            <img src="/zhuu-avatar.jpg" alt="Zhuu VIP" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
          </div>
          <div style={{ position: "absolute", bottom: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: "#4ade80", border: "2px solid #050e14", boxShadow: "0 0 6px rgba(74,222,128,0.6)" }} />
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", fontFamily: "Poppins, sans-serif", marginBottom: 4 }}>@zhuuvip</h1>
        <p style={{ fontSize: 13, color: "rgba(200,175,255,0.6)", marginBottom: 20, textAlign: "center" }}>JANGAN LUPA BUY &amp; DONATE 🧸</p>

        <div className="flex items-center gap-3 mb-8">
          {SOCIAL_LINKS.map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" title={s.label}
              style={{ width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)", textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
              {s.icon}
            </a>
          ))}
        </div>

        <div className="w-full flex flex-col gap-2.5">
          {links.map(link => <LinkCard key={link.id} link={link} />)}
          {links.length === 0 && (
            <div style={{ textAlign: "center", color: "rgba(200,180,255,0.3)", fontSize: 13, padding: "40px 0" }}>Loading...</div>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center gap-1.5">
          <div style={{ height: 1, width: 48, background: "linear-gradient(90deg, transparent, rgba(130,70,220,0.25), transparent)" }} />
          <p style={{ color: "rgba(130,80,200,0.3)", fontSize: 11 }}>ZhuuVIP · Deep Ocean Platform</p>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "10px 16px", background: "rgba(8,0,18,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(130,70,220,0.12)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
        <a href="/community" style={{ textDecoration: "none" }}>
          <div style={{ padding: "9px 22px", borderRadius: 40, background: "linear-gradient(135deg, rgba(100,50,180,0.85), rgba(70,30,150,0.85))", border: "1px solid rgba(130,70,220,0.4)", color: "#ffffff", fontWeight: 700, fontSize: 13, fontFamily: "Poppins, sans-serif", cursor: "pointer" }}>
            🌊 Bergabung di ZhuuVIP
          </div>
        </a>
      </div>
    </div>
  );
}
