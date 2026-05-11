import { useState, useEffect, useRef, useCallback } from "react";

interface Track { id: number; title: string; artist: string; url: string; }

const DEFAULT_TRACKS: Track[] = [
  { id: 0, title: "Love Story", artist: "Indila", url: "/bgm.mp3" },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(55);
  const [blocked, setBlocked] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showTrackList, setShowTrackList] = useState(false);

  useEffect(() => {
    fetch("/api/public/sounds").then(r => r.ok ? r.json() : [])
      .then((data: Track[]) => { if (data.length > 0) setTracks(data); })
      .catch(() => {});
  }, []);

  const currentTrack = tracks[currentIdx] ?? tracks[0];

  useEffect(() => {
    if (!currentTrack?.url) return;
    const prev = audioRef.current;
    if (prev) { prev.pause(); prev.src = ""; }
    const audio = new Audio(currentTrack.url);
    audio.loop = tracks.length === 1;
    audio.volume = volume / 100;
    audio.preload = "auto";
    audioRef.current = audio;
    setReady(false);
    setPlaying(false);
    const onCanPlay = () => {
      setReady(true);
      audio.play().then(() => { setPlaying(true); setBlocked(false); }).catch(() => setBlocked(true));
    };
    const onEnded = () => {
      if (tracks.length > 1) setCurrentIdx(i => (i + 1) % tracks.length);
    };
    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("playing", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("ended", onEnded);
    return () => { audio.pause(); audio.src = ""; };
  }, [currentIdx, tracks]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!blocked) return;
    const unlock = () => {
      audioRef.current?.play().then(() => { setPlaying(true); setBlocked(false); }).catch(() => {});
    };
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
    return () => { document.removeEventListener("click", unlock); document.removeEventListener("touchstart", unlock); };
  }, [blocked]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a || !ready) return;
    if (playing) a.pause(); else a.play().catch(() => {});
  }, [playing, ready]);

  const next = () => setCurrentIdx(i => (i + 1) % tracks.length);
  const prev = () => setCurrentIdx(i => (i - 1 + tracks.length) % tracks.length);

  const showOverlay = blocked && !dismissed;

  return (
    <>
      {showOverlay && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,5,12,0.75)", backdropFilter: "blur(16px)" }}
          onClick={() => { audioRef.current?.play().then(() => { setPlaying(true); setBlocked(false); }).catch(() => { setBlocked(false); setDismissed(true); }); }}>
          <div style={{ maxWidth: 340, width: "90%", borderRadius: 24, background: "rgba(2,10,22,0.98)", border: "1px solid rgba(0,200,220,0.2)", boxShadow: "0 0 50px rgba(0,160,180,0.15)", padding: "32px 24px 24px", textAlign: "center", position: "relative" }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => { setBlocked(false); setDismissed(true); }} style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", color: "rgba(0,180,200,0.4)", cursor: "pointer", fontSize: 18 }}>×</button>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🎵</div>
            <h3 style={{ color: "#00e5ff", fontWeight: 700, marginBottom: 6, fontFamily: "Poppins, sans-serif", fontSize: 18 }}>Background Music</h3>
            <p style={{ color: "rgba(0,180,200,0.55)", fontSize: 13, marginBottom: 22 }}><strong style={{ color: "rgba(0,210,230,0.75)" }}>{currentTrack?.title}</strong> — {currentTrack?.artist}</p>
            <button onClick={() => { audioRef.current?.play().then(() => { setPlaying(true); setBlocked(false); }).catch(() => { setBlocked(false); setDismissed(true); }); }} className="neon-btn-solid w-full py-3 rounded-full font-semibold text-sm">▶ Play Music</button>
            <button onClick={() => { setBlocked(false); setDismissed(true); }} style={{ width: "100%", padding: "10px 0 0", background: "none", border: "none", cursor: "pointer", color: "rgba(0,180,200,0.35)", fontSize: 12 }}>Skip</button>
          </div>
        </div>
      )}

      <div style={{ position: "fixed", bottom: 80, right: 16, zIndex: 200, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        {expanded && (
          <div style={{ marginBottom: 10, background: "rgba(2,10,22,0.97)", border: "1px solid rgba(0,200,220,0.15)", borderRadius: 16, padding: "14px 16px", minWidth: 220, backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,220,240,0.8)", marginBottom: 1 }}>{currentTrack?.title}</div>
            <div style={{ fontSize: 11, color: "rgba(0,180,200,0.45)", marginBottom: 12 }}>{currentTrack?.artist}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 12 }}>🔈</span>
              <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#00ffff", height: 3 }} />
              <span style={{ fontSize: 11, color: "rgba(0,180,200,0.45)", minWidth: 28 }}>{volume}%</span>
            </div>
            {tracks.length > 1 && (
              <button onClick={() => setShowTrackList(v => !v)} style={{ width: "100%", fontSize: 11, color: "rgba(0,200,220,0.5)", background: "none", border: "1px solid rgba(0,200,220,0.1)", borderRadius: 8, padding: "5px 0", cursor: "pointer" }}>
                {showTrackList ? "Hide" : "📋 Track list"}
              </button>
            )}
            {showTrackList && tracks.length > 1 && (
              <div style={{ marginTop: 8, maxHeight: 160, overflowY: "auto" }}>
                {tracks.map((t, i) => (
                  <div key={t.id} onClick={() => { setCurrentIdx(i); setShowTrackList(false); }}
                    style={{ padding: "7px 8px", borderRadius: 8, cursor: "pointer", background: i === currentIdx ? "rgba(0,200,220,0.1)" : "transparent", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10 }}>{i === currentIdx ? "▶" : "○"}</span>
                    <div>
                      <div style={{ fontSize: 12, color: i === currentIdx ? "#00e5ff" : "rgba(0,200,220,0.7)", fontWeight: 500 }}>{t.title}</div>
                      <div style={{ fontSize: 10, color: "rgba(0,180,200,0.4)" }}>{t.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {playing && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16, paddingBottom: 2 }}>
              {[1.2, 1.8, 0.9, 1.5].map((h, i) => (
                <div key={i} style={{ width: 2.5, background: "#00e5ff", borderRadius: 2, opacity: 0.6, animation: `playing-bar 0.9s ease-in-out ${i * 0.18}s infinite alternate`, height: `${h * 7}px` }} />
              ))}
            </div>
          )}
          {tracks.length > 1 && (
            <button onClick={prev} style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(2,10,22,0.88)", border: "1px solid rgba(0,200,220,0.12)", cursor: "pointer", color: "rgba(0,180,200,0.5)", fontSize: 12 }}>‹</button>
          )}
          <button onClick={() => setExpanded(!expanded)} style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(2,10,22,0.88)", border: "1px solid rgba(0,200,220,0.12)", cursor: "pointer", color: "rgba(0,180,200,0.5)" }}>
            <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" /></svg>
          </button>
          <button onClick={togglePlay} style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: playing ? "linear-gradient(135deg, rgba(0,180,200,0.7), rgba(0,120,180,0.7))" : "rgba(2,10,22,0.88)", border: `1px solid ${playing ? "rgba(0,220,240,0.4)" : "rgba(0,200,220,0.12)"}`, cursor: "pointer", color: "white", fontSize: 14 }}>
            {playing ? "⏸" : "▶"}
          </button>
          {tracks.length > 1 && (
            <button onClick={next} style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(2,10,22,0.88)", border: "1px solid rgba(0,200,220,0.12)", cursor: "pointer", color: "rgba(0,180,200,0.5)", fontSize: 12 }}>›</button>
          )}
        </div>
      </div>
      <style>{`@keyframes playing-bar { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }`}</style>
    </>
  );
}
