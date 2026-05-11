import { useState, useEffect, useCallback } from "react";

const ADMIN_TOKEN_KEY = "zhuu_admin_token";

interface Link { id: number; title: string; subtitle?: string; url: string; icon?: string; iconType?: string; color: string; badge?: string; sortOrder: number; active: boolean; }
interface Sound { id: number; title: string; artist: string; url: string; active: boolean; sortOrder: number; }
interface Feedback { id: number; type: string; rating?: number; name?: string; email?: string; message: string; read: boolean; createdAt: string; }
interface Settings { site_title?: string; site_description?: string; site_announcement?: string; }
interface CommunityLink { id: number; name: string; icon: string; description: string; url: string; members: string; btnText: string; color: string; badge?: string; sortOrder: number; active: boolean; }
interface ClerkUser { id: string; first_name?: string; last_name?: string; image_url?: string; email_addresses: { email_address: string }[]; created_at: number; last_sign_in_at?: number; }

type Tab = "linktree" | "community" | "sounds" | "feedback" | "settings" | "users";

function useAdmin() {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) ?? "");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) setAuthed(true);
  }, []);

  const login = async () => {
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (res.ok) {
      const { token: t } = await res.json();
      localStorage.setItem(ADMIN_TOKEN_KEY, t);
      setToken(t); setAuthed(true); setError("");
    } else { setError("Wrong password"); }
  };

  const apiFetch = useCallback(async (path: string, opts: RequestInit = {}) => {
    const res = await fetch(`/api${path}`, { ...opts, headers: { ...opts.headers, "Content-Type": "application/json", "x-admin-token": token } });
    if (res.status === 401) { setAuthed(false); localStorage.removeItem(ADMIN_TOKEN_KEY); setToken(""); }
    return res;
  }, [token]);

  const logout = () => { localStorage.removeItem(ADMIN_TOKEN_KEY); setToken(""); setAuthed(false); };

  return { authed, error, password, setPassword, login, logout, apiFetch };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: "rgba(0,180,200,0.5)", display: "block", marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = { background: "rgba(0,10,24,0.7)", border: "1px solid rgba(0,180,200,0.12)", color: "rgba(200,240,255,0.85)" };

function LoginScreen({ password, setPassword, login, error }: { password: string; setPassword: (v: string) => void; login: () => void; error: string; }) {
  return (
    <div className="ocean-bg min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-10 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h1 className="text-2xl font-black gradient-text mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>Admin Panel</h1>
        <p style={{ color: "rgba(0,180,200,0.4)", fontSize: 13, marginBottom: 24 }}>ZhuuVIP Control Center</p>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && login()}
          placeholder="Admin password" className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-3"
          style={{ background: "rgba(0,10,24,0.7)", border: "1px solid rgba(0,200,220,0.15)", color: "rgba(200,240,255,0.85)" }} />
        {error && <div style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 12 }}>{error}</div>}
        <button onClick={login} className="neon-btn-solid w-full py-3 rounded-full font-semibold text-sm">Enter</button>
      </div>
    </div>
  );
}

function LinktreeTab({ apiFetch }: { apiFetch: (path: string, opts?: RequestInit) => Promise<Response> }) {
  const [links, setLinks] = useState<Link[]>([]);
  const [editing, setEditing] = useState<Partial<Link> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => { const r = await apiFetch("/admin/linktree"); if (r.ok) setLinks(await r.json()); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    await apiFetch(isNew ? "/admin/linktree" : `/admin/linktree/${editing.id}`, { method: isNew ? "POST" : "PUT", body: JSON.stringify(editing) });
    setSaving(false); setEditing(null); load();
  };

  const del = async (id: number) => { if (!confirm("Delete this link?")) return; await apiFetch(`/admin/linktree/${id}`, { method: "DELETE" }); load(); };
  const blankLink: Partial<Link> = { title: "", subtitle: "", url: "", icon: "🔗", iconType: "emoji", color: "#00ffff", badge: "", sortOrder: links.length + 1, active: true };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>Linktree Links</h2>
        <button onClick={() => setEditing(blankLink)} className="neon-btn-solid px-4 py-2 rounded-full text-xs font-semibold">+ Add Link</button>
      </div>

      {editing && (
        <div className="glass-card p-5 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[["Title *", "title", "text"], ["URL *", "url", "url"], ["Subtitle", "subtitle", "text"], ["Icon", "icon", "text"], ["Badge", "badge", "text"], ["Color", "color", "color"]].map(([lbl, field, type_]) => (
              <Field key={field as string} label={lbl as string}>
                <input type={type_ as string} value={(editing as Record<string, string>)[field as string] ?? ""} onChange={e => setEditing(p => ({ ...p, [field as string]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
              </Field>
            ))}
            <Field label="Icon Type">
              <select value={editing.iconType ?? "emoji"} onChange={e => setEditing(p => ({ ...p, iconType: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle}>
                <option value="emoji">Emoji</option>
                <option value="text">Text</option>
                <option value="avatar">Image URL (icon field)</option>
              </select>
            </Field>
            <Field label="Sort Order">
              <input type="number" value={editing.sortOrder ?? 0} onChange={e => setEditing(p => ({ ...p, sortOrder: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
            </Field>
            <div className="flex items-center gap-3 pt-5">
              <label style={{ fontSize: 13, color: "rgba(0,180,200,0.65)" }}>Active</label>
              <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing(p => ({ ...p, active: e.target.checked }))} style={{ accentColor: "#00ffff", width: 16, height: 16 }} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="neon-btn-solid px-6 py-2 rounded-full text-xs font-semibold">{saving ? "Saving..." : "Save"}</button>
            <button onClick={() => setEditing(null)} className="neon-btn px-6 py-2 rounded-full text-xs font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {links.map(link => (
          <div key={link.id} className="glass-card p-4 flex items-center gap-4">
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${link.color}12`, border: `1px solid ${link.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              {link.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate" style={{ color: link.active ? "rgba(0,220,240,0.85)" : "rgba(0,180,200,0.35)" }}>{link.title}</div>
              <div className="text-xs truncate" style={{ color: "rgba(0,180,200,0.35)" }}>{link.url}</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: link.active ? "#4ade80" : "rgba(0,180,200,0.2)", flexShrink: 0 }} />
            <button onClick={() => setEditing(link)} style={{ fontSize: 12, color: "rgba(0,200,220,0.5)", background: "none", border: "1px solid rgba(0,200,220,0.1)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>Edit</button>
            <button onClick={() => del(link.id)} style={{ fontSize: 12, color: "rgba(255,80,80,0.5)", background: "none", border: "1px solid rgba(255,80,80,0.1)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommunityTab({ apiFetch }: { apiFetch: (path: string, opts?: RequestInit) => Promise<Response> }) {
  const [links, setLinks] = useState<CommunityLink[]>([]);
  const [editing, setEditing] = useState<Partial<CommunityLink> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => { const r = await apiFetch("/admin/community"); if (r.ok) setLinks(await r.json()); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    await apiFetch(isNew ? "/admin/community" : `/admin/community/${editing.id}`, { method: isNew ? "POST" : "PUT", body: JSON.stringify(editing) });
    setSaving(false); setEditing(null); load();
  };

  const del = async (id: number) => { if (!confirm("Delete this community link?")) return; await apiFetch(`/admin/community/${id}`, { method: "DELETE" }); load(); };

  const blank: Partial<CommunityLink> = { name: "", icon: "🌐", description: "", url: "", members: "", btnText: "Visit", color: "#00e5ff", badge: "", sortOrder: links.length + 1, active: true };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>Community Links</h2>
        <button onClick={() => setEditing(blank)} className="neon-btn-solid px-4 py-2 rounded-full text-xs font-semibold">+ Add Platform</button>
      </div>

      <div className="glass-card p-4 mb-5" style={{ background: "rgba(0,200,220,0.04)", border: "1px solid rgba(0,200,220,0.08)" }}>
        <p style={{ color: "rgba(0,180,200,0.55)", fontSize: 12, lineHeight: 1.7 }}>
          💡 These links appear on the <strong style={{ color: "rgba(0,200,220,0.7)" }}>Community</strong> page. Add any social platform or community you want visitors to find. The first Discord-named link is shown as the featured hero card at the top.
        </p>
      </div>

      {editing && (
        <div className="glass-card p-5 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Field label="Platform Name *">
              <input type="text" value={editing.name ?? ""} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Discord, Instagram, WhatsApp" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
            </Field>
            <Field label="Icon (emoji)">
              <input type="text" value={editing.icon ?? ""} onChange={e => setEditing(p => ({ ...p, icon: e.target.value }))}
                placeholder="e.g. 💬" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
            </Field>
            <Field label="URL *">
              <input type="url" value={editing.url ?? ""} onChange={e => setEditing(p => ({ ...p, url: e.target.value }))}
                placeholder="https://discord.gg/..." className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
            </Field>
            <Field label="Button Text">
              <input type="text" value={editing.btnText ?? ""} onChange={e => setEditing(p => ({ ...p, btnText: e.target.value }))}
                placeholder="e.g. Join, Follow, Subscribe" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
            </Field>
            <Field label="Description">
              <input type="text" value={editing.description ?? ""} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))}
                placeholder="Short description of this platform" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
            </Field>
            <Field label="Members / Followers">
              <input type="text" value={editing.members ?? ""} onChange={e => setEditing(p => ({ ...p, members: e.target.value }))}
                placeholder="e.g. 500+, 2K+" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
            </Field>
            <Field label="Accent Color">
              <div className="flex gap-2 items-center">
                <input type="color" value={editing.color ?? "#00e5ff"} onChange={e => setEditing(p => ({ ...p, color: e.target.value }))}
                  style={{ width: 40, height: 36, borderRadius: 8, border: "1px solid rgba(0,180,200,0.15)", background: "transparent", cursor: "pointer" }} />
                <input type="text" value={editing.color ?? "#00e5ff"} onChange={e => setEditing(p => ({ ...p, color: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
              </div>
            </Field>
            <Field label="Badge (optional)">
              <input type="text" value={editing.badge ?? ""} onChange={e => setEditing(p => ({ ...p, badge: e.target.value }))}
                placeholder="e.g. Most Active, Dev Hub" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
            </Field>
            <Field label="Sort Order">
              <input type="number" value={editing.sortOrder ?? 0} onChange={e => setEditing(p => ({ ...p, sortOrder: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
            </Field>
            <div className="flex items-center gap-3 pt-5">
              <label style={{ fontSize: 13, color: "rgba(0,180,200,0.65)" }}>Active (show on page)</label>
              <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing(p => ({ ...p, active: e.target.checked }))} style={{ accentColor: "#00ffff", width: 16, height: 16 }} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="neon-btn-solid px-6 py-2 rounded-full text-xs font-semibold">{saving ? "Saving..." : "Save"}</button>
            <button onClick={() => setEditing(null)} className="neon-btn px-6 py-2 rounded-full text-xs font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {links.length === 0 && (
          <div style={{ textAlign: "center", color: "rgba(0,180,200,0.35)", padding: "40px 0", fontSize: 14 }}>
            No community links yet — click "+ Add Platform" to add your first one.
          </div>
        )}
        {links.map(link => (
          <div key={link.id} className="glass-card p-4 flex items-center gap-4">
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${link.color}12`, border: `1px solid ${link.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {link.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm" style={{ color: link.active ? "rgba(0,220,240,0.85)" : "rgba(0,180,200,0.35)" }}>
                {link.name}
                {link.badge && <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: `${link.color}18`, color: link.color, border: `1px solid ${link.color}25` }}>{link.badge}</span>}
              </div>
              <div className="text-xs truncate" style={{ color: "rgba(0,180,200,0.35)" }}>{link.url} {link.members ? `· ${link.members}` : ""}</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: link.active ? "#4ade80" : "rgba(0,180,200,0.2)", flexShrink: 0 }} />
            <button onClick={() => setEditing(link)} style={{ fontSize: 12, color: "rgba(0,200,220,0.5)", background: "none", border: "1px solid rgba(0,200,220,0.1)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>Edit</button>
            <button onClick={() => del(link.id)} style={{ fontSize: 12, color: "rgba(255,80,80,0.5)", background: "none", border: "1px solid rgba(255,80,80,0.1)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SoundsTab({ apiFetch }: { apiFetch: (path: string, opts?: RequestInit) => Promise<Response> }) {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [editing, setEditing] = useState<Partial<Sound> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => { const r = await apiFetch("/admin/sounds"); if (r.ok) setSounds(await r.json()); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    await apiFetch(isNew ? "/admin/sounds" : `/admin/sounds/${editing.id}`, { method: isNew ? "POST" : "PUT", body: JSON.stringify(editing) });
    setSaving(false); setEditing(null); load();
  };

  const del = async (id: number) => { if (!confirm("Delete this sound?")) return; await apiFetch(`/admin/sounds/${id}`, { method: "DELETE" }); load(); };
  const blank: Partial<Sound> = { title: "", artist: "", url: "", active: true, sortOrder: sounds.length + 1 };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>Music Tracks</h2>
        <button onClick={() => setEditing(blank)} className="neon-btn-solid px-4 py-2 rounded-full text-xs font-semibold">+ Add Track</button>
      </div>
      <div className="glass-card p-4 mb-5" style={{ background: "rgba(0,200,220,0.04)", border: "1px solid rgba(0,200,220,0.08)" }}>
        <p style={{ color: "rgba(0,180,200,0.55)", fontSize: 12, lineHeight: 1.6 }}>
          💡 <strong style={{ color: "rgba(0,200,220,0.7)" }}>Tip:</strong> Use a direct MP3 file URL. Upload the MP3 to Google Drive (public link), Cloudinary, or similar, and paste the direct URL here.
        </p>
      </div>

      {editing && (
        <div className="glass-card p-5 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[["Title *", "title", "text"], ["Artist *", "artist", "text"], ["URL (direct MP3 link) *", "url", "url"]].map(([lbl, field, type_]) => (
              <div key={field as string} className={field === "url" ? "sm:col-span-2" : ""}>
                <Field label={lbl as string}>
                  <input type={type_ as string} value={(editing as Record<string, string>)[field as string] ?? ""} onChange={e => setEditing(p => ({ ...p, [field as string]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
                </Field>
              </div>
            ))}
            <Field label="Sort Order">
              <input type="number" value={editing.sortOrder ?? 0} onChange={e => setEditing(p => ({ ...p, sortOrder: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
            </Field>
            <div className="flex items-center gap-3 pt-5">
              <label style={{ fontSize: 13, color: "rgba(0,180,200,0.65)" }}>Active (show in player)</label>
              <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing(p => ({ ...p, active: e.target.checked }))} style={{ accentColor: "#00ffff", width: 16, height: 16 }} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="neon-btn-solid px-6 py-2 rounded-full text-xs font-semibold">{saving ? "Saving..." : "Save"}</button>
            <button onClick={() => setEditing(null)} className="neon-btn px-6 py-2 rounded-full text-xs font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sounds.map(s => (
          <div key={s.id} className="glass-card p-4 flex items-center gap-4">
            <span style={{ fontSize: 20, flexShrink: 0 }}>🎵</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm" style={{ color: s.active ? "rgba(0,220,240,0.85)" : "rgba(0,180,200,0.35)" }}>{s.title}</div>
              <div className="text-xs" style={{ color: "rgba(0,180,200,0.4)" }}>{s.artist} {s.url ? "· URL set" : "· No URL"}</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.active ? "#4ade80" : "rgba(0,180,200,0.2)", flexShrink: 0 }} />
            <button onClick={() => setEditing(s)} style={{ fontSize: 12, color: "rgba(0,200,220,0.5)", background: "none", border: "1px solid rgba(0,200,220,0.1)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>Edit</button>
            <button onClick={() => del(s.id)} style={{ fontSize: 12, color: "rgba(255,80,80,0.5)", background: "none", border: "1px solid rgba(255,80,80,0.1)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedbackTab({ apiFetch }: { apiFetch: (path: string, opts?: RequestInit) => Promise<Response> }) {
  const [items, setItems] = useState<Feedback[]>([]);
  const load = async () => { const r = await apiFetch("/admin/feedback"); if (r.ok) setItems(await r.json()); };
  useEffect(() => { load(); }, []);
  const markRead = async (id: number) => { await apiFetch(`/admin/feedback/${id}/read`, { method: "PUT" }); load(); };
  const del = async (id: number) => { if (!confirm("Delete this feedback?")) return; await apiFetch(`/admin/feedback/${id}`, { method: "DELETE" }); load(); };
  const unread = items.filter(i => !i.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>
          Feedback {unread > 0 && <span style={{ fontSize: 12, background: "rgba(255,100,100,0.8)", color: "white", borderRadius: 12, padding: "2px 7px", marginLeft: 6, fontWeight: 700 }}>{unread} new</span>}
        </h2>
      </div>
      {items.length === 0 && <div style={{ textAlign: "center", color: "rgba(0,180,200,0.35)", padding: "40px 0" }}>No feedback yet</div>}
      <div className="space-y-3">
        {[...items].reverse().map(fb => (
          <div key={fb.id} className="glass-card p-5" style={{ opacity: fb.read ? 0.65 : 1 }}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "rgba(0,200,220,0.1)", color: "#00e5ff", border: "1px solid rgba(0,200,220,0.2)" }}>{fb.type}</span>
                {fb.rating && <span style={{ fontSize: 11, color: "rgba(255,200,50,0.8)" }}>{"⭐".repeat(fb.rating)}</span>}
                {!fb.read && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />}
              </div>
              <div style={{ fontSize: 11, color: "rgba(0,180,200,0.35)", flexShrink: 0 }}>{new Date(fb.createdAt).toLocaleDateString()}</div>
            </div>
            <p style={{ color: "rgba(0,220,240,0.75)", fontSize: 14, lineHeight: 1.6, marginBottom: 10 }}>{fb.message}</p>
            {(fb.name || fb.email) && <div style={{ fontSize: 12, color: "rgba(0,180,200,0.45)", marginBottom: 10 }}>{fb.name} {fb.email ? `· ${fb.email}` : ""}</div>}
            <div className="flex gap-2">
              {!fb.read && <button onClick={() => markRead(fb.id)} style={{ fontSize: 11, color: "rgba(74,222,128,0.7)", background: "none", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>Mark read</button>}
              <button onClick={() => del(fb.id)} style={{ fontSize: 11, color: "rgba(255,80,80,0.5)", background: "none", border: "1px solid rgba(255,80,80,0.1)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab({ apiFetch }: { apiFetch: (path: string, opts?: RequestInit) => Promise<Response> }) {
  const [users, setUsers] = useState<ClerkUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    apiFetch("/admin/users")
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); setUsers([]); }
        else { setUsers(Array.isArray(data) ? data : (data.data ?? [])); setError(""); }
        setLoading(false);
      })
      .catch(() => { setError("Failed to fetch users"); setLoading(false); });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>
          Registered Users {!loading && users.length > 0 && <span style={{ fontSize: 13, fontWeight: 400, color: "rgba(0,180,200,0.5)" }}>({users.length})</span>}
        </h2>
        <button onClick={() => { setLoading(true); apiFetch("/admin/users").then(r => r.json()).then(d => { setUsers(Array.isArray(d) ? d : (d.data ?? [])); setLoading(false); }); }}
          style={{ fontSize: 12, color: "rgba(0,200,220,0.5)", background: "none", border: "1px solid rgba(0,200,220,0.1)", borderRadius: 20, padding: "5px 14px", cursor: "pointer" }}>
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="glass-card p-5 mb-5" style={{ borderColor: "rgba(255,80,80,0.2)" }}>
          <p style={{ color: "rgba(255,100,100,0.8)", fontSize: 13 }}>⚠️ {error}</p>
          {error.includes("CLERK_SECRET_KEY") && (
            <p style={{ color: "rgba(0,180,200,0.45)", fontSize: 12, marginTop: 8, lineHeight: 1.6 }}>
              To enable user monitoring, add the <code style={{ color: "#00e5ff" }}>CLERK_SECRET_KEY</code> environment variable. You can find this in your Clerk dashboard under API Keys.
            </p>
          )}
        </div>
      )}

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-4 flex items-center gap-4">
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(0,180,200,0.08)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 14, width: "40%", background: "rgba(0,180,200,0.08)", borderRadius: 6, marginBottom: 6 }} />
                <div style={{ height: 11, width: "60%", background: "rgba(0,180,200,0.05)", borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && users.length === 0 && !error && (
        <div style={{ textAlign: "center", color: "rgba(0,180,200,0.35)", padding: "40px 0", fontSize: 14 }}>
          No users registered yet.
        </div>
      )}

      <div className="space-y-2">
        {users.map(u => {
          const email = u.email_addresses?.[0]?.email_address ?? "—";
          const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || email.split("@")[0];
          const joined = u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—";
          const lastSeen = u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "Never";
          return (
            <div key={u.id} className="glass-card p-4 flex items-center gap-4">
              <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(0,200,220,0.2)", flexShrink: 0, background: "rgba(0,30,60,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {u.image_url ? <img src={u.image_url} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🧑"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="font-semibold text-sm truncate" style={{ color: "rgba(0,220,240,0.85)" }}>{name}</div>
                <div className="text-xs truncate" style={{ color: "rgba(0,180,200,0.45)" }}>{email}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: "rgba(0,180,200,0.35)" }}>Joined</div>
                <div style={{ fontSize: 11, color: "rgba(0,200,220,0.5)" }}>{joined}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: "rgba(0,180,200,0.35)" }}>Last seen</div>
                <div style={{ fontSize: 11, color: "rgba(0,200,220,0.5)" }}>{lastSeen}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsTab({ apiFetch }: { apiFetch: (path: string, opts?: RequestInit) => Promise<Response> }) {
  const [settings, setSettings] = useState<Settings>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/admin/settings").then(r => r.ok ? r.json() : {}).then(setSettings);
  }, []);

  const save = async () => {
    setSaving(true);
    await apiFetch("/admin/settings", { method: "PUT", body: JSON.stringify(settings) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 className="text-lg font-bold gradient-text mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>Site Settings</h2>
      <div className="glass-card p-6 space-y-4">
        {[["Site Title", "site_title", "text"], ["Description", "site_description", "text"], ["Announcement Banner", "site_announcement", "text"]].map(([lbl, key_, type_]) => (
          <Field key={key_ as string} label={lbl as string}>
            <input type={type_ as string} value={(settings as Record<string, string>)[key_ as string] ?? ""} onChange={e => setSettings(p => ({ ...p, [key_ as string]: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
          </Field>
        ))}
        <button onClick={save} disabled={saving} className="neon-btn-solid px-8 py-2.5 rounded-full text-sm font-semibold">
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Settings"}
        </button>
      </div>

      <div className="glass-card p-6 mt-5">
        <h3 className="font-bold mb-3" style={{ color: "rgba(0,220,240,0.8)" }}>AI Provider Status</h3>
        <p style={{ color: "rgba(0,180,200,0.5)", fontSize: 13, lineHeight: 1.7 }}>
          Add API keys as environment variables to enable different AI providers:<br />
          <code style={{ color: "#00e5ff", fontSize: 12 }}>OPENAI_API_KEY</code> — OpenAI GPT-4o-mini<br />
          <code style={{ color: "#00e5ff", fontSize: 12 }}>ANTHROPIC_API_KEY</code> — Claude 3 Haiku<br />
          <code style={{ color: "#00e5ff", fontSize: 12 }}>DEEPSEEK_API_KEY</code> — DeepSeek Chat<br />
          <code style={{ color: "#00e5ff", fontSize: 12 }}>GEMINI_API_KEY</code> — Gemini 1.5 Flash<br />
          <span style={{ color: "rgba(0,180,200,0.35)" }}>Without keys, Pollinations.ai (free) is used as fallback.</span>
        </p>
      </div>
    </div>
  );
}

export default function Admin() {
  const { authed, error, password, setPassword, login, logout, apiFetch } = useAdmin();
  const [tab, setTab] = useState<Tab>("linktree");

  if (!authed) return <LoginScreen password={password} setPassword={setPassword} login={login} error={error} />;

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "linktree", label: "Linktree", icon: "🔗" },
    { id: "community", label: "Community", icon: "🌊" },
    { id: "sounds", label: "Sounds", icon: "🎵" },
    { id: "feedback", label: "Feedback", icon: "💬" },
    { id: "settings", label: "Settings", icon: "⚙️" },
    { id: "users", label: "Users", icon: "👥" },
  ];

  return (
    <div className="ocean-bg min-h-screen pt-16 pb-28 px-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>Admin Panel</h1>
            <p style={{ color: "rgba(0,180,200,0.4)", fontSize: 12 }}>ZhuuVIP Control Center</p>
          </div>
          <button onClick={logout} style={{ fontSize: 12, color: "rgba(0,180,200,0.4)", background: "none", border: "1px solid rgba(0,200,220,0.1)", borderRadius: 20, padding: "6px 14px", cursor: "pointer" }}>Sign out</button>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 cursor-pointer"
              style={{ background: tab === t.id ? "rgba(0,200,220,0.15)" : "rgba(0,10,24,0.5)", border: `1px solid ${tab === t.id ? "rgba(0,220,240,0.3)" : "rgba(0,200,220,0.08)"}`, color: tab === t.id ? "#00e5ff" : "rgba(0,180,200,0.5)" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === "linktree" && <LinktreeTab apiFetch={apiFetch} />}
        {tab === "community" && <CommunityTab apiFetch={apiFetch} />}
        {tab === "sounds" && <SoundsTab apiFetch={apiFetch} />}
        {tab === "feedback" && <FeedbackTab apiFetch={apiFetch} />}
        {tab === "settings" && <SettingsTab apiFetch={apiFetch} />}
        {tab === "users" && <UsersTab apiFetch={apiFetch} />}
      </div>
    </div>
  );
}
