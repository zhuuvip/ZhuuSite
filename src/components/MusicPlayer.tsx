import { useState, useEffect, useRef, useCallback } from "react";

const AUDIO_SRC = "/bgm.mp3";
const SONG = { title: "Squidward's Tiki Land", artist: "SpongeBob Soundtrack" };

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(60);
  const [blocked, setBlocked] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  /* ── Bootstrap audio ─────────────────────────────────────────── */
  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0.6;
    audio.preload = "auto";
    audioRef.current = audio;

    const onCanPlay = () => {
      setReady(true);
      audio.play()
        .then(() => {
          setPlaying(true);
          setBlocked(false);
        })
        .catch(() => {
          setBlocked(true);
        });
    };
    const onPlaying = () => setPlaying(true);
    const onPause   = () => setPlaying(false);
    const onEnded   = () => setPlaying(false);

    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause",   onPause);
    audio.addEventListener("ended",   onEnded);

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── One-click unlock (user gesture triggers autoplay) ─────── */
  useEffect(() => {
    if (!blocked) return;
    const unlock = () => {
      const audio = audioRef.current;
      if (!audio || !blocked) return;
      audio.play()
        .then(() => {
          setPlaying(true);
          setBlocked(false);
        })
        .catch(() => {});
    };
    document.addEventListener("click",     unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
    document.addEventListener("keydown",    unlock, { once: true });
    return () => {
      document.removeEventListener("click",     unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("keydown",    unlock);
    };
  }, [blocked]);

  /* ── Toggle play / pause ────────────────────────────────────── */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !ready) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [playing, ready]);

  const handleVolume = useCallback((v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
  }, []);

  const handleDismiss = () => {
    setBlocked(false);
    setDismissed(true);
  };

  /* ── Autoplay blocked overlay ────────────────────────────────── */
  const showOverlay = blocked && !dismissed;

  return (
    <>
      {/* ── Autoplay-blocked banner ─────────────────────────── */}
      {showOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,6,14,0.72)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            animation: "fade-in 0.4s ease",
          }}
          onClick={() => {
            const audio = audioRef.current;
            if (audio) {
              audio.play()
                .then(() => { setPlaying(true); setBlocked(false); })
                .catch(() => { setBlocked(false); setDismissed(true); });
            }
          }}
        >
          <div
            style={{
              maxWidth: 340,
              width: "90%",
              borderRadius: 24,
              background: "rgba(3,14,28,0.98)",
              border: "1px solid rgba(0,255,255,0.3)",
              boxShadow: "0 0 60px rgba(0,200,220,0.25), 0 24px 64px rgba(0,0,0,0.7)",
              padding: "36px 28px 28px",
              textAlign: "center",
              position: "relative",
              animation: "scale-in 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              style={{
                position: "absolute", top: 12, right: 14,
                background: "none", border: "none",
                color: "rgba(0,220,240,0.4)", cursor: "pointer", fontSize: 18, lineHeight: 1,
              }}
            >✕</button>

            {/* Animated disc */}
            <div style={{
              width: 96, height: 96, borderRadius: "50%",
              background: "radial-gradient(circle at 38% 35%, #0d3a5c, #060f1c)",
              border: "3px solid rgba(0,255,255,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 38, margin: "0 auto 20px",
              boxShadow: "0 0 40px rgba(0,255,255,0.3), 0 0 80px rgba(0,180,220,0.15)",
              animation: "float-gentle 4s ease-in-out infinite",
              position: "relative",
            }}>
              {[40, 60, 80].map(r => (
                <div key={r} style={{
                  position: "absolute", width: r, height: r, borderRadius: "50%",
                  border: "0.5px solid rgba(0,255,255,0.1)",
                  left: "50%", top: "50%", transform: "translate(-50%,-50%)",
                }} />
              ))}
              <span style={{ position: "relative", zIndex: 1 }}>🎵</span>
            </div>

            <div style={{ fontWeight: 800, fontSize: 20, color: "white", marginBottom: 8, fontFamily: "Poppins, sans-serif" }}>
              Tap to Play Music
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(0,220,240,0.85)", marginBottom: 4 }}>
              {SONG.title}
            </div>
            <div style={{ fontSize: 12, color: "rgba(0,200,220,0.45)", marginBottom: 24 }}>
              {SONG.artist}
            </div>

            <button
              onClick={() => {
                const audio = audioRef.current;
                if (audio) {
                  audio.play()
                    .then(() => { setPlaying(true); setBlocked(false); })
                    .catch(() => { setBlocked(false); setDismissed(true); });
                }
              }}
              style={{
                width: "100%", padding: "13px 0", borderRadius: 50,
                background: "linear-gradient(135deg, rgba(0,200,220,0.9), rgba(0,120,200,0.85))",
                border: "1px solid rgba(0,255,255,0.5)",
                color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer",
                boxShadow: "0 0 28px rgba(0,200,220,0.4), 0 4px 20px rgba(0,0,0,0.4)",
                letterSpacing: "0.02em",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            >
              ▶ &nbsp;Play Music
            </button>

            <div style={{ marginTop: 12, fontSize: 11, color: "rgba(0,200,220,0.3)" }}>
              or tap anywhere on the page
            </div>
          </div>
        </div>
      )}

      {/* ── Player FAB + panel ───────────────────────────────── */}
      <div style={{ position: "fixed", bottom: 24, right: 16, zIndex: 1001 }}>

        {/* Expanded panel */}
        {expanded && (
          <div style={{
            marginBottom: 12, width: 264,
            borderRadius: 22,
            background: "rgba(3,14,22,0.97)",
            border: "1px solid rgba(0,255,255,0.22)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 40px rgba(0,200,220,0.06)",
            overflow: "hidden",
            animation: "slide-in-up 0.3s ease forwards",
          }}>
            {/* Art header */}
            <div style={{
              background: "linear-gradient(135deg, rgba(0,100,160,0.22), rgba(0,180,200,0.1))",
              padding: "22px 16px 16px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            }}>
              <div style={{
                width: 84, height: 84, borderRadius: "50%",
                background: "radial-gradient(circle at 38% 35%, #1a4060, #080e18)",
                border: "3px solid rgba(0,255,255,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, position: "relative",
                boxShadow: playing
                  ? "0 0 28px rgba(0,255,255,0.4), 0 0 60px rgba(0,180,220,0.2)"
                  : "0 0 10px rgba(0,0,0,0.5)",
                transition: "box-shadow 0.5s ease",
                animation: playing ? "float-gentle 4s ease-in-out infinite" : "none",
              }}>
                {[36, 52, 68].map(r => (
                  <div key={r} style={{
                    position: "absolute", width: r, height: r, borderRadius: "50%",
                    border: "0.5px solid rgba(0,255,255,0.08)",
                    left: "50%", top: "50%", transform: "translate(-50%,-50%)",
                  }} />
                ))}
                <span style={{ position: "relative", zIndex: 1 }}>🎵</span>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: "white", fontSize: 13, marginBottom: 2 }}>{SONG.title}</div>
                <div style={{ fontSize: 11, color: "rgba(0,220,240,0.5)" }}>{SONG.artist}</div>
              </div>

              {playing && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 20 }}>
                  {[10, 18, 8, 22, 14, 20, 9, 16, 12].map((h, i) => (
                    <div key={i} style={{
                      width: 3, borderRadius: 3,
                      background: "linear-gradient(to top, #00c8dc, #00ffff)",
                      height: h,
                      animation: `wave-bar ${0.45 + i * 0.07}s ease-in-out ${i * 0.05}s infinite alternate`,
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            <div style={{ padding: "14px 20px 18px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <button
                  onClick={togglePlay}
                  disabled={!ready}
                  style={{
                    width: 50, height: 50, borderRadius: "50%",
                    border: "1px solid rgba(0,255,255,0.4)",
                    background: playing
                      ? "rgba(0,255,255,0.12)"
                      : "linear-gradient(135deg, rgba(0,200,220,0.85), rgba(0,120,200,0.75))",
                    cursor: ready ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: playing ? "0 0 24px rgba(0,255,255,0.4)" : "none",
                    transition: "all 0.3s ease",
                    opacity: ready ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) => { if (ready) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                >
                  {!ready ? (
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%",
                      border: "2px solid rgba(0,255,255,0.4)",
                      borderTopColor: "#00ffff",
                      animation: "spin 1s linear infinite",
                    }} />
                  ) : playing ? (
                    <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="#00ffff">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, marginLeft: 2 }} fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Volume */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, flexShrink: 0 }} fill="rgba(0,220,240,0.45)">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                <div style={{ flex: 1, position: "relative", height: 6, cursor: "pointer" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: "rgba(0,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{
                      width: `${volume}%`, height: "100%",
                      background: "linear-gradient(90deg, #00a8c0, #00ffff)",
                      borderRadius: 3, transition: "width 0.08s",
                    }} />
                  </div>
                  <input
                    type="range" min={0} max={100} value={volume}
                    onChange={(e) => handleVolume(Number(e.target.value))}
                    style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: "100%", margin: 0 }}
                  />
                </div>
                <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, flexShrink: 0 }} fill="rgba(0,220,240,0.45)">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </div>

              {!ready && (
                <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "rgba(0,200,220,0.45)" }}>
                  Loading audio…
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAB */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setExpanded(!expanded)}
            title={playing ? "Music playing — click to manage" : "Click to manage music"}
            style={{
              width: 52, height: 52, borderRadius: "50%",
              border: `1px solid ${playing ? "rgba(0,255,255,0.55)" : "rgba(0,255,255,0.35)"}`,
              background: playing
                ? "linear-gradient(135deg, rgba(0,210,230,0.9), rgba(0,120,200,0.85))"
                : "linear-gradient(135deg, rgba(0,180,210,0.78), rgba(0,100,180,0.7))",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
              boxShadow: playing
                ? "0 0 28px rgba(0,255,255,0.55), 0 0 56px rgba(0,200,220,0.3), 0 4px 20px rgba(0,0,0,0.4)"
                : "0 0 14px rgba(0,200,220,0.22), 0 4px 20px rgba(0,0,0,0.4)",
              transition: "all 0.3s ease",
              position: "relative",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          >
            {playing && (
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "rgba(0,255,255,0.15)",
                animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
                pointerEvents: "none",
              }} />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>{playing ? "🎵" : "🎶"}</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </>
  );
}
