import React, { useEffect, useMemo, useState } from 'react';
import './style.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

async function api(path, opts = {}) {
  const response = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

const specialties = ['All', 'Cardiology', 'Neurology', 'Dermatology', 'General Medicine', 'Pediatrics'];

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('medicalUser') || 'null'));
  const [page, setPage] = useState('dashboard');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notice, setNotice] = useState('');

  const loadDoctors = () => api('/doctors').then(setDoctors).catch(e => setNotice(e.message));
  const loadAppointments = (id = user?.id) => id && api('/appointments/patient/' + id).then(setAppointments).catch(() => {});

  useEffect(() => { loadDoctors(); }, []);
  useEffect(() => { loadAppointments(); }, [user]);

  const navigate = (next) => { setNotice(''); setPage(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const login = (u) => { setUser(u); localStorage.setItem('medicalUser', JSON.stringify(u)); navigate('dashboard'); };
  const logout = () => { localStorage.removeItem('medicalUser'); setUser(null); setAppointments([]); navigate('dashboard'); };

  return (
    <div className="app-shell">
      <Header user={user} page={page} navigate={navigate} logout={logout} />
      {notice && <div className="notice"><span>●</span>{notice}<button onClick={() => setNotice('')}>×</button></div>}
      {page === 'dashboard' && <Dashboard user={user} doctors={doctors} appointments={appointments} navigate={navigate} />}
      {page === 'doctors' && <Doctors doctors={doctors} user={user} navigate={navigate} refresh={loadAppointments} />}
      {page === 'login' && <Auth onLogin={login} />}
      {page === 'ai' && <AI />}
      {page === 'appointments' && <Appointments appointments={appointments} setAppointments={setAppointments} navigate={navigate} />}
    </div>
  );
}

function Header({ user, page, navigate, logout }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="logo" onClick={() => navigate('dashboard')}><span className="logo-mark">✚</span><span>Medi<span>Care</span><small>AI HEALTH</small></span></button>
        <nav className="desktop-nav">
          <button className={page === 'dashboard' ? 'active' : ''} onClick={() => navigate('dashboard')}>Overview</button>
          <button className={page === 'doctors' ? 'active' : ''} onClick={() => navigate('doctors')}>Find a Doctor</button>
          {user && <button className={page === 'appointments' ? 'active' : ''} onClick={() => navigate('appointments')}>Appointments</button>}
          <button className={page === 'ai' ? 'active ai-nav' : 'ai-nav'} onClick={() => navigate('ai')}><span>✦</span> AI Assistant</button>
        </nav>
        <div className="top-actions">
          {user ? <><div className="user-chip"><span>{initials(user.name)}</span><div><b>{user.name || 'Patient'}</b><small>Patient</small></div></div><button className="icon-button" onClick={logout} title="Logout">↪</button></> : <button className="primary" onClick={() => navigate('login')}>Sign in</button>}
        </div>
      </div>
    </header>
  );
}

function Dashboard({ user, doctors, appointments, navigate }) {
  const upcoming = appointments.find(a => a.status === 'BOOKED');
  return (
    <main>
      <section className="dashboard-hero">
        <div className="hero-copy">
          <div className="eyebrow"><span>●</span> AI-POWERED CARE PLATFORM</div>
          <h1>Healthcare that feels <em>human.</em></h1>
          <p>Find trusted doctors, book appointments in minutes, and get helpful general health information from your AI assistant.</p>
          <div className="hero-actions"><button className="primary large" onClick={() => navigate('doctors')}>Find a doctor <span>→</span></button><button className="ghost large" onClick={() => navigate('ai')}><span className="sparkle">✦</span> Ask AI assistant</button></div>
          <div className="trust-row"><span>✓ Secure & private</span><span>✓ Easy scheduling</span><span>✓ Human-first AI</span></div>
        </div>
        <div className="hero-visual">
          <div className="orb orb-one" /><div className="orb orb-two" />
          <div className="doctor-art"><div className="doctor-head">👩🏻‍⚕️</div><div className="doctor-body"><b>Dr. Sarah</b><span>General Medicine</span><div className="rating">★ 4.9 <small>Available today</small></div></div></div>
          <div className="floating-card next"><span className="mini-icon">✓</span><div><small>YOUR NEXT VISIT</small><b>{upcoming ? formatDate(upcoming.appointmentDate) : 'No appointment'}</b></div></div>
          <div className="floating-card ai-float"><span className="mini-icon ai-mini">✦</span><div><small>AI ASSISTANT</small><b>Here when you need it</b></div></div>
        </div>
      </section>

      <section className="stats-strip"><Stat value={doctors.length || '20+'} label="Specialists" /><Stat value="24/7" label="AI support" /><Stat value="100%" label="Easy booking" /><Stat value="Secure" label="Patient-first" /></section>

      <section className="content-section">
        <div className="section-heading"><div><span className="section-label">QUICK ACCESS</span><h2>How can we help today?</h2></div></div>
        <div className="quick-grid">
          <QuickCard icon="⌕" title="Find a doctor" text="Browse specialists and choose a convenient slot." onClick={() => navigate('doctors')} />
          <QuickCard icon="▣" title="My appointments" text="View, track or cancel your upcoming visits." onClick={() => user ? navigate('appointments') : navigate('login')} />
          <QuickCard icon="✦" title="Talk to AI" text="Ask general health or appointment questions." ai onClick={() => navigate('ai')} />
        </div>
      </section>

      <section className="content-section doctors-preview">
        <div className="section-heading"><div><span className="section-label">SPECIALISTS</span><h2>Meet our doctors</h2></div><button className="text-button" onClick={() => navigate('doctors')}>View all <span>→</span></button></div>
        <div className="doctor-mini-grid">{doctors.slice(0, 3).map(d => <DoctorMini key={d.id} doctor={d} onClick={() => navigate('doctors')} />)}</div>
      </section>
      <Footer />
    </main>
  );
}

function Stat({ value, label }) { return <div className="stat"><b>{value}</b><span>{label}</span></div>; }
function QuickCard({ icon, title, text, onClick, ai }) { return <button className={'quick-card ' + (ai ? 'ai-card' : '')} onClick={onClick}><span className="quick-icon">{icon}</span><div><b>{title}</b><p>{text}</p></div><span className="arrow">↗</span></button>; }
function DoctorMini({ doctor, onClick }) { return <button className="doctor-mini" onClick={onClick}><div className="doctor-photo">{doctor.name?.includes('Michael') ? '👨🏻‍⚕️' : '👩🏻‍⚕️'}</div><div className="doctor-mini-info"><div className="available"><span /> Available</div><h3>{doctor.name}</h3><p>{doctor.specialty}</p><span className="doctor-meta">★ 4.9&nbsp; · &nbsp;{doctor.experience || 5}+ yrs experience</span></div></button>; }

function Doctors({ doctors, user, navigate, refresh }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => doctors.filter(d => (filter === 'All' || d.specialty === filter) && ((d.name || '').toLowerCase().includes(search.toLowerCase()) || (d.specialty || '').toLowerCase().includes(search.toLowerCase()))), [doctors, filter, search]);
  return <main className="page-wrap"><div className="page-hero"><div><span className="section-label">SPECIALIST DIRECTORY</span><h1>Find a doctor you can trust.</h1><p>Explore specialists and choose an appointment time that works for you.</p></div><div className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or specialty" /></div></div><div className="filter-row">{specialties.map(s => <button className={filter === s ? 'filter active' : 'filter'} key={s} onClick={() => setFilter(s)}>{s}</button>)}</div><div className="doctor-grid">{filtered.map(d => <article className="doctor-card" key={d.id}><div className="doctor-card-top"><div className="large-avatar">{d.name?.includes('Michael') ? '👨🏻‍⚕️' : '👩🏻‍⚕️'}</div><span className="available-badge"><i /> Available</span></div><div className="verified">✓ VERIFIED SPECIALIST</div><h2>{d.name}</h2><h3>{d.specialty}</h3><p>{d.qualification || 'Medical Specialist'} · {d.experience || 5} years experience</p><div className="doctor-footer"><span>★ 4.9 <small>96 reviews</small></span><button className="primary" onClick={() => user ? setSelected(d) : navigate('login')}>Book visit</button></div></article>)}</div>{filtered.length === 0 && <div className="empty-state">No doctors match your search. Try another specialty.</div>}{selected && <Booking doctor={selected} user={user} close={() => setSelected(null)} refresh={refresh} />}</main>;
}

function Booking({ doctor, user, close, refresh }) {
  const [form, setForm] = useState({ date: '', time: '', reason: '' }); const [msg, setMsg] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(e) { e.preventDefault(); setLoading(true); try { await api('/appointments', { method: 'POST', body: JSON.stringify({ patientId: user.id, doctorId: doctor.id, date: form.date, time: form.time + ':00', reason: form.reason }) }); setMsg('Appointment confirmed.'); refresh(); setTimeout(close, 800); } catch (e) { setMsg(e.message); } finally { setLoading(false); } }
  return <div className="modal"><div className="modal-card"><button className="close" onClick={close}>×</button><div className="modal-doctor"><div className="large-avatar">👩🏻‍⚕️</div><div><span className="section-label">BOOK A VISIT</span><h2>{doctor.name}</h2><p>{doctor.specialty}</p></div></div><div className="form-divider"/><form onSubmit={submit}><label>Preferred date<input type="date" min={new Date().toISOString().slice(0, 10)} required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label><label>Preferred time<input type="time" required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></label><label>What would you like help with?<textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Optional note for the doctor" /></label><button className="primary large full" disabled={loading}>{loading ? 'Confirming…' : 'Confirm appointment'}</button></form>{msg && <div className={msg.includes('confirmed') ? 'success-box' : 'error-box'}>{msg}</div>}</div></div>;
}

function Auth({ onLogin }) {
  const [register, setRegister] = useState(false); const [f, setF] = useState({ name: '', email: '', password: '' }); const [err, setErr] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(e) { e.preventDefault(); setLoading(true); setErr(''); try { const d = await api('/auth/' + (register ? 'register' : 'login'), { method: 'POST', body: JSON.stringify(f) }); onLogin(d); } catch (e) { setErr(e.message); } finally { setLoading(false); } }
  return <main className="auth-page"><div className="auth-visual"><div className="auth-orb" /><span className="logo-mark big-mark">✚</span><h1>Care that starts<br />with <em>you.</em></h1><p>Manage appointments, discover specialists and get helpful AI guidance—all in one secure place.</p><div className="auth-testimonial">“Simple, thoughtful and easy to use.”<small>— MediCare patient experience</small></div></div><div className="auth-panel"><div className="auth-inner"><span className="section-label">{register ? 'NEW PATIENT' : 'PATIENT PORTAL'}</span><h2>{register ? 'Create your account' : 'Welcome back'}</h2><p>{register ? 'Set up your account to start managing your care.' : 'Sign in to continue to your healthcare dashboard.'}</p><form onSubmit={submit}>{register && <Field label="Full name" value={f.name} onChange={v => setF({ ...f, name: v })} placeholder="Your full name" />}<Field label="Email address" type="email" value={f.email} onChange={v => setF({ ...f, email: v })} placeholder="you@example.com" /><Field label="Password" type="password" value={f.password} onChange={v => setF({ ...f, password: v })} placeholder="••••••••" /><button className="primary large full" disabled={loading}>{loading ? 'Please wait…' : register ? 'Create account' : 'Sign in'}</button></form>{err && <div className="error-box">{err}</div>}<p className="switch">{register ? 'Already have an account?' : 'New to MediCare?'} <button onClick={() => setRegister(!register)}>{register ? 'Sign in' : 'Create account'}</button></p><div className="auth-note">🔒 Your account information is protected.</div></div></div></main>;
}
function Field({ label, type = 'text', value, onChange, placeholder }) { return <label className="field"><span>{label}</span><input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required /></label>; }

function AI() {
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Hi! I’m your MediCare AI assistant. I can help with general health information and appointment questions. What would you like to know?' }]); const [input, setInput] = useState(''); const [loading, setLoading] = useState(false);
  async function send(e) { e.preventDefault(); if (!input.trim() || loading) return; const q = input.trim(); setInput(''); setMessages(m => [...m, { from: 'user', text: q }]); setLoading(true); try { const d = await api('/ai/chat', { method: 'POST', body: JSON.stringify({ message: q }) }); setMessages(m => [...m, { from: 'ai', text: d.reply }]); } catch { setMessages(m => [...m, { from: 'ai', text: 'The assistant is unavailable right now. You can still use the doctor directory and appointment features.' }]); } finally { setLoading(false); } }
  return <main className="ai-page"><div className="ai-intro"><span className="ai-symbol">✦</span><span className="section-label">MEDICARE AI</span><h1>Your health questions,<br /><em>answered simply.</em></h1><p>Ask for general health information or help navigating appointments. This assistant does not diagnose conditions or prescribe medicines.</p><div className="ai-disclaimer">ⓘ For urgent or severe symptoms, contact a qualified healthcare professional or local emergency service.</div></div><div className="chat-card"><div className="chat-top"><div className="ai-avatar">✦</div><div><b>MediCare AI</b><span>General health & appointment support <i /></span></div><span className="online">ONLINE</span></div><div className="messages">{messages.map((m, i) => <div key={i} className={'chat-message ' + m.from}><span className="message-avatar">{m.from === 'ai' ? '✦' : 'Y'}</span><div>{m.text}</div></div>)}{loading && <div className="chat-message ai"><span className="message-avatar">✦</span><div className="typing"><i /><i /><i /></div></div>}</div><div className="suggestions">{['How do I prepare for a doctor visit?', 'Help me find a specialist', 'What is a healthy sleep routine?'].map(q => <button key={q} onClick={() => setInput(q)}>{q}</button>)}</div><form className="chat-composer" onSubmit={send}><input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your question…" /><button className="send-button">↑</button></form></div></main>;
}

function Appointments({ appointments, setAppointments, navigate }) {
  async function cancel(id) { try { await api('/appointments/' + id + '/cancel', { method: 'PUT' }); setAppointments(a => a.map(x => x.id === id ? { ...x, status: 'CANCELLED' } : x)); } catch {} }
  return <main className="page-wrap"><div className="page-hero compact"><div><span className="section-label">PATIENT PORTAL</span><h1>My appointments.</h1><p>Keep track of your upcoming visits and appointment history.</p></div><button className="primary large" onClick={() => navigate('doctors')}>Book a visit <span>→</span></button></div>{appointments.length === 0 ? <div className="empty-state large-empty"><div>▣</div><h2>No appointments yet</h2><p>Choose a specialist and book your first visit.</p><button className="primary" onClick={() => navigate('doctors')}>Find a doctor</button></div> : <div className="appointment-list">{appointments.map(a => <article className="appointment-card" key={a.id}><div className="date-block"><b>{day(a.appointmentDate)}</b><span>{month(a.appointmentDate)}</span></div><div className="appointment-info"><span className={'status ' + (a.status || '').toLowerCase()}>{a.status}</span><h2>{a.doctor?.name || 'Doctor appointment'}</h2><p>{a.doctor?.specialty || 'Medical consultation'} · {a.appointmentTime?.slice(0, 5)}</p><small>{a.reason || 'General consultation'}</small></div>{a.status === 'BOOKED' && <button className="outline" onClick={() => cancel(a.id)}>Cancel</button>}</article>)}</div>}</main>;
}

function Footer() { return <footer><div className="footer-brand"><span className="logo-mark">✚</span><b>MediCare AI</b><p>Technology that helps people navigate care with confidence.</p></div><div><b>Important</b><p>AI responses are for general information only and are not a diagnosis or medical prescription.</p></div><div><b>Platform</b><p>Doctors · Appointments · AI Assistant</p></div></footer>; }
function initials(name = 'Patient') { return name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase(); }
function formatDate(d) { if (!d) return 'No appointment'; const x = new Date(d + 'T00:00:00'); return x.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function day(d) { return d ? new Date(d + 'T00:00:00').getDate() : '—'; }
function month(d) { return d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : ''; }

export default App;
