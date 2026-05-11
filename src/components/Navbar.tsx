import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useUser, useClerk, Show } from "@clerk/react";

const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/speedtest", label: "Speed" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/community", label: "Community" },
  { path: "/links", label: "Links" },
  { path: "/linktree", label: "Linktree", highlight: "purple" },
  { path: "/feedback", label: "Feedback" },
  { path: "/ai", label: "Zhuu AI", highlight: "ai" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      background: "rgba(1,8,18,0.85)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(0,200,220,0.07)",
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-15" style={{ height: 60 }}>
        <Link href="/">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(0,200,220,0.4)", boxShadow: "0 0 10px rgba(0,200,220,0.2)" }}>
              <img src="/zhuu-avatar.jpg" alt="ZhuuVIP" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
            </div>
            <span className="gradient-text font-bold text-base" style={{ fontFamily: "Poppins, sans-serif", letterSpacing: "-0.01em" }}>ZhuuVIP</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.path;
            if (item.highlight === "ai") return (
              <Link key={item.path} href={item.path}>
                <button className="ml-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                  style={{ background: "linear-gradient(135deg, rgba(120,80,255,0.7), rgba(0,120,220,0.7))", border: "1px solid rgba(120,80,255,0.4)", color: "#e0d0ff" }}>
                  ✨ {item.label}
                </button>
              </Link>
            );
            if (item.highlight === "purple") return (
              <Link key={item.path} href={item.path}>
                <button className="ml-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                  style={{ color: isActive ? "#c084fc" : "rgba(192,132,252,0.55)", background: isActive ? "rgba(120,60,200,0.12)" : "transparent", border: "1px solid rgba(150,80,255,0.2)" }}>
                  🔗 {item.label}
                </button>
              </Link>
            );
            return (
              <Link key={item.path} href={item.path}>
                <div className="px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200"
                  style={{ color: isActive ? "#00ffff" : "rgba(0,180,200,0.5)", background: isActive ? "rgba(0,255,255,0.07)" : "transparent" }}>
                  {item.label}
                  {isActive && <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#00ffff", margin: "2px auto 0", opacity: 0.8 }} />}
                </div>
              </Link>
            );
          })}

          <Show when="signed-in">
            <div className="ml-2 flex items-center gap-2">
              <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(0,200,220,0.3)" }}>
                <img src={user?.imageUrl ?? "/zhuu-avatar.jpg"} alt="me" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <button onClick={() => signOut()} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={{ color: "rgba(0,180,200,0.5)", background: "transparent", border: "1px solid rgba(0,200,220,0.1)", cursor: "pointer" }}>
                Sign out
              </button>
            </div>
          </Show>
          <Show when="signed-out">
            <div className="ml-3 flex items-center gap-2">
              <Link href="/sign-in">
                <button className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer"
                  style={{ color: "rgba(0,200,220,0.7)", border: "1px solid rgba(0,200,220,0.15)", background: "transparent" }}>
                  Sign in
                </button>
              </Link>
              <Link href="/sign-up">
                <button className="neon-btn-solid px-4 py-1.5 rounded-full text-xs font-semibold">
                  Join free
                </button>
              </Link>
            </div>
          </Show>
        </div>

        <button className="md:hidden p-2 rounded-lg cursor-pointer" style={{ background: "rgba(0,200,220,0.04)", border: "1px solid rgba(0,200,220,0.1)" }} onClick={() => setOpen(!open)}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="rgba(0,200,220,0.7)" strokeWidth={2}>
            {open ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 pt-2" style={{ background: "rgba(1,8,18,0.97)", borderBottom: "1px solid rgba(0,200,220,0.06)" }}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className="px-4 py-2.5 rounded-xl cursor-pointer my-0.5 text-sm font-medium transition-all"
                style={{ color: location === item.path ? "#00ffff" : "rgba(0,180,200,0.55)", background: location === item.path ? "rgba(0,255,255,0.06)" : "transparent" }}
                onClick={() => setOpen(false)}>
                {item.highlight === "purple" ? "🔗 " : item.highlight === "ai" ? "✨ " : ""}{item.label}
              </div>
            </Link>
          ))}
          <div className="border-t border-cyan-400/10 mt-3 pt-3 flex gap-2">
            <Show when="signed-out">
              <Link href="/sign-in"><button className="flex-1 py-2 rounded-xl text-sm font-medium cursor-pointer" style={{ color: "rgba(0,200,220,0.7)", border: "1px solid rgba(0,200,220,0.15)", background: "transparent" }} onClick={() => setOpen(false)}>Sign in</button></Link>
              <Link href="/sign-up"><button className="flex-1 neon-btn-solid py-2 rounded-xl text-sm font-semibold" onClick={() => setOpen(false)}>Join free</button></Link>
            </Show>
            <Show when="signed-in">
              <button onClick={() => { signOut(); setOpen(false); }} className="flex-1 py-2 rounded-xl text-sm font-medium cursor-pointer" style={{ color: "rgba(0,180,200,0.5)", border: "1px solid rgba(0,200,220,0.1)", background: "transparent" }}>Sign out</button>
            </Show>
          </div>
        </div>
      )}
    </nav>
  );
}
