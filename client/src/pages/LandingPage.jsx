import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Store, BarChart3, Bell, Lock, Package, MapPin, Clock, Download, QrCode, CheckCircle, ArrowRight, ChevronRight, Star, Smartphone } from 'lucide-react';

/* ── Intersection Observer hook ── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

/* ── Animated counter ── */
const Counter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Section = ({ children, className = '' }) => {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)' }} className={className}>
      {children}
    </div>
  );
};

const features = [
  { icon: Shield, title: 'மோசடி கண்டறிதல்', titleEn: 'Fraud Detection', desc: 'Duplicate distribution detection with real-time alerts to prevent misuse', color: '#1a6b3c' },
  { icon: QrCode, title: 'டிஜிட்டல் ரசீது', titleEn: 'Digital Receipts', desc: 'QR-enabled receipts for instant verification at any checkpoint', color: '#c8a000' },
  { icon: BarChart3, title: 'நேரடி பகுப்பாய்வு', titleEn: 'Live Analytics', desc: 'Real-time dashboards with district-wise distribution insights', color: '#1a6b3c' },
  { icon: Bell, title: 'அறிவிப்புகள்', titleEn: 'Smart Alerts', desc: 'Automated low-stock and distribution notifications', color: '#c8a000' },
  { icon: Package, title: 'இருப்பு மேலாண்மை', titleEn: 'Stock Management', desc: 'Automated stock deduction with demand forecasting', color: '#1a6b3c' },
  { icon: MapPin, title: 'கடை கண்டுபிடிப்பு', titleEn: 'Shop Locator', desc: 'Find nearest ration shops with real-time availability', color: '#c8a000' },
  { icon: Clock, title: 'நேர இட முன்பதிவு', titleEn: 'Slot Booking', desc: 'Eliminate queues with smart time-slot management', color: '#1a6b3c' },
  { icon: Lock, title: 'பாதுகாப்பு', titleEn: 'Secure Access', desc: 'Role-based access control for Admin, Shopkeeper & Beneficiary', color: '#c8a000' },
];

const testimonials = [
  { name: 'ராமசாமி', role: 'பயனாளி, சென்னை', text: 'டிஜிட்டல் ரசீது மிகவும் பயனுள்ளது. இனி காகித சீட்டு தேவையில்லை.', rating: 5 },
  { name: 'Priya Sharma', role: 'Shopkeeper, Coimbatore', text: 'Stock management is so easy now. Distribution process takes seconds.', rating: 5 },
  { name: 'மாவட்ட ஆட்சியர்', role: 'அரசு அதிகாரி, மதுரை', text: 'மோசடி வழக்குகள் 90% குறைந்தன. முழு வெளிப்படைத்தன்மை கிடைத்தது.', rating: 5 },
  { name: 'Sunita Devi', role: 'Beneficiary, Trichy', text: 'Slot booking means no more long queues. I collect my rations in 10 minutes.', rating: 5 },
];

const slides = [
  { icon: Shield, title: 'மோசடி இல்லா விநியோகம்', desc: 'Zero Fraud Distribution System', color: '#1a6b3c' },
  { icon: Clock, title: 'நேர இட முன்பதிவு', desc: 'Smart Slot Booking — No More Queues', color: '#c8a000' },
  { icon: Download, title: 'டிஜிட்டல் ரசீது', desc: 'Download PDF Receipts with QR Code', color: '#1a6b3c' },
  { icon: BarChart3, title: 'நேரடி தரவு பகுப்பாய்வு', desc: 'District-wise Real-time Analytics', color: '#c8a000' },
  { icon: Users, title: 'பயனாளி மேலாண்மை', desc: 'Complete Beneficiary Management Portal', color: '#1a6b3c' },
];

/* ── TN Emblem SVG ── */
const TNEmblem = () => (
  <svg viewBox="0 0 100 100" width="64" height="64" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
    <circle cx="50" cy="50" r="48" fill="#1a6b3c" stroke="#c8a000" strokeWidth="3"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke="#c8a000" strokeWidth="1.5"/>
    <text x="50" y="38" textAnchor="middle" fill="#c8a000" fontSize="8" fontWeight="bold">தமிழ்நாடு</text>
    <text x="50" y="50" textAnchor="middle" fill="white" fontSize="6">அரசு</text>
    <text x="50" y="62" textAnchor="middle" fill="#c8a000" fontSize="5.5">TAMIL NADU</text>
    <text x="50" y="72" textAnchor="middle" fill="white" fontSize="5">GOVERNMENT</text>
    {[0,45,90,135,180,225,270,315].map((a,i) => (
      <circle key={i} cx={50 + 30*Math.cos(a*Math.PI/180)} cy={50 + 30*Math.sin(a*Math.PI/180)} r="2" fill="#c8a000"/>
    ))}
  </svg>
);

/* ── Smart Card Visual ── */
const SmartCardVisual = ({ type = 'green', name = 'குடும்ப அட்டை', cardNo = 'TN-2024-XXXXXX' }) => {
  const bg = type === 'green' ? 'linear-gradient(135deg,#1a6b3c,#2d9e5f)' : 'linear-gradient(135deg,#b8860b,#c8a000)';
  return (
    <div style={{ width: 280, background: bg, borderRadius: 16, padding: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.2)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', letterSpacing: 1 }}>GOVERNMENT OF TAMIL NADU</div>
          <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.7)' }}>Civil Supplies & Consumer Protection Dept.</div>
        </div>
        <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🏛️</div>
      </div>
      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: 2 }}>குடும்ப அட்டை</div>
      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>FAMILY CARD — {type === 'green' ? 'PHH' : 'APL'}</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ width: 44, height: 52, background: 'rgba(255,255,255,0.15)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👤</div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{name}</div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>Card No: {cardNo}</div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)' }}>Tamil Nadu, India</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 10 }}>
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)' }}>TNPDS Smart Card</div>
        <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 4, padding: '4px 6px', fontSize: '0.55rem', fontWeight: 700, color: '#1a6b3c' }}>DIGITAL ✓</div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [slide, setSlide] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  const cur = slides[slide];
  const CurIcon = cur.icon;
  const t = testimonials[testimonialIdx];

  return (
    <div style={{ background: '#f5f5f0', color: '#1a1a1a', fontFamily: '"Segoe UI", system-ui, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .feat-card:hover { transform:translateY(-6px); box-shadow:0 12px 32px rgba(26,107,60,0.15) !important; }
        .nav-link:hover { color:#1a6b3c !important; }
        .gov-btn-primary:hover { background:#145530 !important; transform:translateY(-1px); }
        .gov-btn-outline:hover { background:#1a6b3c !important; color:#fff !important; }
        .card-float { animation: float 4s ease-in-out infinite; }
        .card-float-2 { animation: float 5s ease-in-out infinite reverse; }
      `}</style>

      {/* ── TOP STRIP ── */}
      <div style={{ background: '#1a6b3c', color: '#fff', fontSize: '0.75rem', padding: '6px 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
        <span>🏛️ தமிழ்நாடு அரசு — உணவு வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்பு துறை</span>
        <span style={{ color: '#c8a000', fontWeight: 600 }}>GOVERNMENT OF TAMIL NADU — Civil Supplies &amp; Consumer Protection</span>
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
        backdropFilter: 'blur(12px)',
        borderBottom: '3px solid #1a6b3c',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.3s',
        padding: '0 2rem',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <TNEmblem />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1a6b3c', lineHeight: 1.2 }}>Digital Ration Distribution</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1a6b3c', lineHeight: 1.2 }}>Monitoring System</div>
              <div style={{ fontSize: '0.65rem', color: '#c8a000', fontWeight: 600 }}>டிஜிட்டல் ரேஷன் விநியோக கண்காணிப்பு முறை</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {['Features', 'How It Works', 'Contact'].map(l => (
              <a key={l} href={`#${l.replace(/ /g,'').toLowerCase()}`} className="nav-link" style={{ color: '#444', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s' }}>{l}</a>
            ))}
            <Link to="/login" className="gov-btn-outline" style={{ padding: '8px 20px', borderRadius: 6, border: '2px solid #1a6b3c', color: '#1a6b3c', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700, transition: 'all 0.2s' }}>Login</Link>
            <Link to="/register" className="gov-btn-primary" style={{ padding: '8px 20px', borderRadius: 6, background: '#1a6b3c', color: '#fff', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700, transition: 'all 0.2s' }}>Register</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg,#0d4a28 0%,#1a6b3c 50%,#0d4a28 100%)', padding: '60px 1.5rem 80px', position: 'relative', overflow: 'hidden' }}>
        {/* decorative circles */}
        <div style={{ position:'absolute', top:-60, right:-60, width:300, height:300, borderRadius:'50%', background:'rgba(200,160,0,0.08)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          {/* Left */}
          <div style={{ animation: 'fadeSlideUp 0.8s ease both' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(200,160,0,0.2)', border:'1px solid rgba(200,160,0,0.4)', borderRadius:4, padding:'4px 14px', marginBottom:20, fontSize:'0.8rem', color:'#f0d060', fontWeight:600, letterSpacing:1 }}>
              🏛️ OFFICIAL DIGITAL PORTAL
            </div>
            <h1 style={{ fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:900, color:'#fff', lineHeight:1.15, marginBottom:8 }}>
              Digital Ration Distribution
            </h1>
            <h1 style={{ fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:900, color:'#c8a000', lineHeight:1.15, marginBottom:8 }}>
              Monitoring System
            </h1>
            <div style={{ fontSize:'1.1rem', color:'rgba(255,255,255,0.85)', marginBottom:6, fontWeight:600 }}>
              டிஜிட்டல் ரேஷன் விநியோக கண்காணிப்பு முறை
            </div>
            <p style={{ color:'rgba(255,255,255,0.7)', marginBottom:12, lineHeight:1.7, fontSize:'0.95rem' }}>
              "வாழ்க நலமுடன் — உணவே மருந்து, மருந்தே உணவு"
            </p>
            <p style={{ color:'rgba(255,255,255,0.65)', marginBottom:32, lineHeight:1.7, fontSize:'0.9rem' }}>
              Department of Civil Supplies &amp; Consumer Protection, Government of Tamil Nadu. Transparent, efficient, and fraud-free ration distribution for every family.
            </p>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              <Link to="/register" className="gov-btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 28px', borderRadius:6, background:'#c8a000', color:'#fff', textDecoration:'none', fontWeight:700, fontSize:'0.95rem', transition:'all 0.2s', boxShadow:'0 4px 16px rgba(200,160,0,0.4)' }}>
                பதிவு செய்யுங்கள் / Register <ArrowRight size={16} />
              </Link>
              <Link to="/login" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 28px', borderRadius:6, border:'2px solid rgba(255,255,255,0.5)', color:'#fff', textDecoration:'none', fontWeight:600, fontSize:'0.95rem', transition:'all 0.2s' }}>
                உள்நுழைவு / Login <ChevronRight size={16} />
              </Link>
            </div>
            <div style={{ display:'flex', gap:24, marginTop:36, flexWrap:'wrap' }}>
              {[['50,000+','பயனாளிகள்'],['200+','கடைகள்'],['32','மாவட்டங்கள்'],['99.9%','நம்பகத்தன்மை']].map(([n,l]) => (
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'1.4rem', fontWeight:800, color:'#c8a000' }}>{n}</div>
                  <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.6)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Smart Cards */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20, position:'relative' }}>
            <div style={{ position:'relative', display:'flex', gap:16, justifyContent:'center', alignItems:'center' }}>
              <div className="card-float" style={{ transform:'rotate(-6deg)' }}>
                <SmartCardVisual type="green" name="அன்பரசு குடும்பம்" cardNo="TN-2024-001234" />
              </div>
              <div className="card-float-2" style={{ transform:'rotate(4deg)', marginTop:30 }}>
                <SmartCardVisual type="gold" name="Priya Family" cardNo="TN-2024-005678" />
              </div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(200,160,0,0.3)', borderRadius:10, padding:'12px 20px', textAlign:'center', backdropFilter:'blur(8px)' }}>
              <div style={{ fontSize:'0.75rem', color:'#c8a000', fontWeight:700, marginBottom:4 }}>TNPDS — Smart Ration Card</div>
              <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.7)' }}>குடும்ப அட்டை • Family Card • Digital Verified ✓</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE BANNER ── */}
      <div style={{ background:'#c8a000', padding:'10px 0', overflow:'hidden', whiteSpace:'nowrap' }}>
        <div style={{ display:'inline-block', animation:'marquee 20s linear infinite' }}>
          {['📢 Smart Ration Card — Apply Online Now', '🌾 உணவு தானியங்கள் விநியோகம் — Digital System', '✅ Transparent PDS for Tamil Nadu Families', '🏛️ Government of Tamil Nadu — Civil Supplies Dept.', '📱 Book Your Slot Online — No More Queues', '🔒 Secure & Fraud-Free Distribution'].concat(
            ['📢 Smart Ration Card — Apply Online Now', '🌾 உணவு தானியங்கள் விநியோகம் — Digital System', '✅ Transparent PDS for Tamil Nadu Families', '🏛️ Government of Tamil Nadu — Civil Supplies Dept.', '📱 Book Your Slot Online — No More Queues', '🔒 Secure & Fraud-Free Distribution']
          ).map((item, i) => (
            <span key={i} style={{ marginRight:60, fontSize:'0.85rem', fontWeight:700, color:'#fff' }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── CAROUSEL ── */}
      <section style={{ background:'#fff', padding:'48px 1.5rem', borderBottom:'3px solid #e8e8e0' }}>
        <Section>
          <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
            <p style={{ color:'#1a6b3c', fontSize:'0.75rem', letterSpacing:3, textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Platform Highlights — சிறப்பம்சங்கள்</p>
            <div style={{ background:'#f8fdf9', border:'2px solid #1a6b3c', borderRadius:12, padding:'36px 28px', minHeight:150, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,#1a6b3c,${cur.color},#1a6b3c)`, transition:'background 0.5s' }} />
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                <div style={{ width:56, height:56, borderRadius:12, background:`${cur.color}15`, border:`2px solid ${cur.color}40`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <CurIcon size={26} color={cur.color} />
                </div>
                <h3 style={{ fontSize:'1.3rem', fontWeight:800, color:'#1a1a1a' }}>{cur.title}</h3>
                <p style={{ color:'#555', fontSize:'0.95rem' }}>{cur.desc}</p>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:14 }}>
              {slides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 24 : 8, height:8, borderRadius:4, background: i === slide ? '#1a6b3c' : '#ccc', border:'none', cursor:'pointer', transition:'all 0.3s', padding:0 }} />
              ))}
            </div>
          </div>
        </Section>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:'72px 1.5rem', background:'#f5f5f0' }}>
        <Section>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <div style={{ display:'inline-block', background:'#1a6b3c', color:'#fff', fontSize:'0.75rem', fontWeight:700, letterSpacing:2, padding:'4px 16px', borderRadius:4, marginBottom:12 }}>சேவைகள் — SERVICES</div>
              <h2 style={{ fontSize:'clamp(1.6rem,3.5vw,2.4rem)', fontWeight:800, color:'#1a1a1a' }}>Portal Features</h2>
              <p style={{ color:'#666', marginTop:8 }}>தமிழ்நாடு பொது விநியோக முறையின் முழுமையான டிஜிட்டல் தீர்வு</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
              {features.map(({ icon: Icon, title, titleEn, desc, color }) => (
                <div key={titleEn} className="feat-card" style={{ background:'#fff', border:`2px solid ${color}25`, borderTop:`4px solid ${color}`, borderRadius:10, padding:'24px 20px', transition:'all 0.3s', cursor:'default', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ width:48, height:48, borderRadius:10, background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                    <Icon size={22} color={color} />
                  </div>
                  <h3 style={{ fontWeight:700, fontSize:'0.95rem', color:'#1a1a1a', marginBottom:2 }}>{title}</h3>
                  <p style={{ fontSize:'0.75rem', color:'#888', marginBottom:6, fontWeight:500 }}>{titleEn}</p>
                  <p style={{ color:'#555', fontSize:'0.85rem', lineHeight:1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="howitworks" style={{ padding:'72px 1.5rem', background:'#fff', borderTop:'3px solid #e8e8e0' }}>
        <Section>
          <div style={{ maxWidth:1000, margin:'0 auto', textAlign:'center' }}>
            <div style={{ display:'inline-block', background:'#c8a000', color:'#fff', fontSize:'0.75rem', fontWeight:700, letterSpacing:2, padding:'4px 16px', borderRadius:4, marginBottom:12 }}>எப்படி பயன்படுத்துவது — HOW IT WORKS</div>
            <h2 style={{ fontSize:'clamp(1.6rem,3.5vw,2.4rem)', fontWeight:800, color:'#1a1a1a', marginBottom:40 }}>Simple 4-Step Process</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:24 }}>
              {[
                { step:'01', icon: Users, title:'பதிவு செய்யுங்கள்', sub:'Register', desc:'Beneficiaries register and get verified by the admin', color:'#1a6b3c' },
                { step:'02', icon: Store, title:'கடை ஒதுக்கீடு', sub:'Shop Assignment', desc:'Admin assigns the nearest ration shop to your family', color:'#c8a000' },
                { step:'03', icon: Clock, title:'நேரம் முன்பதிவு', sub:'Book Slot', desc:'Book a convenient time slot online — no waiting in queues', color:'#1a6b3c' },
                { step:'04', icon: CheckCircle, title:'பெறுங்கள்', sub:'Collect & Pay', desc:'Visit shop, pay, collect rations and get a digital receipt', color:'#c8a000' },
              ].map(({ step, icon: Icon, title, sub, desc, color }) => (
                <div key={step} style={{ background:'#f8fdf9', border:`2px solid ${color}30`, borderRadius:10, padding:'28px 18px', position:'relative', textAlign:'center' }}>
                  <div style={{ position:'absolute', top:12, right:14, fontSize:'2rem', fontWeight:900, color:`${color}20` }}>{step}</div>
                  <div style={{ width:52, height:52, borderRadius:12, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                    <Icon size={24} color={color} />
                  </div>
                  <h3 style={{ fontWeight:800, color:'#1a1a1a', marginBottom:2, fontSize:'0.95rem' }}>{title}</h3>
                  <p style={{ fontSize:'0.75rem', color:color, fontWeight:600, marginBottom:8 }}>{sub}</p>
                  <p style={{ color:'#666', fontSize:'0.85rem', lineHeight:1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </section>

      {/* ── SMART CARD SHOWCASE ── */}
      <section style={{ padding:'72px 1.5rem', background:'linear-gradient(135deg,#0d4a28,#1a6b3c)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:400, height:400, borderRadius:'50%', background:'rgba(200,160,0,0.06)', pointerEvents:'none' }} />
        <Section>
          <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
            <div>
              <div style={{ display:'inline-block', background:'rgba(200,160,0,0.2)', border:'1px solid rgba(200,160,0,0.4)', color:'#f0d060', fontSize:'0.75rem', fontWeight:700, letterSpacing:2, padding:'4px 16px', borderRadius:4, marginBottom:16 }}>TNPDS SMART CARD</div>
              <h2 style={{ fontSize:'clamp(1.6rem,3.5vw,2.4rem)', fontWeight:800, color:'#fff', marginBottom:8 }}>உங்கள் குடும்ப அட்டை</h2>
              <h3 style={{ fontSize:'1.1rem', color:'#c8a000', fontWeight:700, marginBottom:16 }}>Your Family Smart Ration Card</h3>
              <p style={{ color:'rgba(255,255,255,0.75)', lineHeight:1.8, marginBottom:20, fontSize:'0.95rem' }}>
                The TNPDS Smart Ration Card is your digital identity for accessing subsidised food grains under the Public Distribution System. Issued by the Government of Tamil Nadu, it ensures every eligible family receives their rightful entitlement.
              </p>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:10 }}>
                {['PHH (Priority Household) — Green Card','APL (Above Poverty Line) — Yellow Card','AAY (Antyodaya Anna Yojana) — Pink Card','BPL (Below Poverty Line) — Blue Card'].map(item => (
                  <li key={item} style={{ display:'flex', alignItems:'center', gap:10, color:'rgba(255,255,255,0.85)', fontSize:'0.875rem' }}>
                    <CheckCircle size={16} color="#c8a000" style={{ flexShrink:0 }} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:20, alignItems:'center' }}>
              <div className="card-float">
                <SmartCardVisual type="green" name="முருகேசன் குடும்பம்" cardNo="TN-2024-112233" />
              </div>
              <div className="card-float-2">
                <SmartCardVisual type="gold" name="Kavitha Family" cardNo="TN-2024-445566" />
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding:'64px 1.5rem', background:'#fff', borderTop:'3px solid #e8e8e0' }}>
        <Section>
          <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
            <h2 style={{ fontSize:'clamp(1.6rem,3.5vw,2.2rem)', fontWeight:800, color:'#1a1a1a', marginBottom:8 }}>தமிழ்நாடு — Impact in Numbers</h2>
            <p style={{ color:'#888', marginBottom:40 }}>Serving Tamil Nadu families with transparency and efficiency</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:28 }}>
              {[
                { target:50000, suffix:'+', label:'பயனாளிகள் / Beneficiaries', color:'#1a6b3c' },
                { target:200, suffix:'+', label:'கடைகள் / Ration Shops', color:'#c8a000' },
                { target:32, suffix:'', label:'மாவட்டங்கள் / Districts', color:'#1a6b3c' },
                { target:90, suffix:'%', label:'மோசடி குறைப்பு / Fraud Reduced', color:'#c8a000' },
              ].map(({ target, suffix, label, color }) => (
                <div key={label} style={{ background:'#f8fdf9', border:`2px solid ${color}20`, borderRadius:10, padding:'28px 16px' }}>
                  <div style={{ fontSize:'2.5rem', fontWeight:900, color }}><Counter target={target} suffix={suffix} /></div>
                  <div style={{ color:'#666', fontSize:'0.85rem', marginTop:6 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:'64px 1.5rem', background:'#f5f5f0' }}>
        <Section>
          <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center' }}>
            <div style={{ display:'inline-block', background:'#1a6b3c', color:'#fff', fontSize:'0.75rem', fontWeight:700, letterSpacing:2, padding:'4px 16px', borderRadius:4, marginBottom:12 }}>மக்கள் கருத்து — TESTIMONIALS</div>
            <h2 style={{ fontSize:'clamp(1.6rem,3.5vw,2.2rem)', fontWeight:800, color:'#1a1a1a', marginBottom:32 }}>What People Say</h2>
            <div style={{ background:'#fff', border:'2px solid #1a6b3c', borderRadius:12, padding:'36px 28px', minHeight:180, position:'relative' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:'linear-gradient(90deg,#1a6b3c,#c8a000,#1a6b3c)', borderRadius:'12px 12px 0 0' }} />
              <div style={{ display:'flex', justifyContent:'center', gap:4, marginBottom:14 }}>
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={18} fill="#c8a000" color="#c8a000" />)}
              </div>
              <p style={{ color:'#444', fontSize:'1rem', lineHeight:1.8, fontStyle:'italic', marginBottom:20 }}>"{t.text}"</p>
              <div style={{ fontWeight:800, color:'#1a1a1a' }}>{t.name}</div>
              <div style={{ color:'#888', fontSize:'0.85rem' }}>{t.role}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:16 }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} style={{ width: i === testimonialIdx ? 24 : 8, height:8, borderRadius:4, background: i === testimonialIdx ? '#1a6b3c' : '#ccc', border:'none', cursor:'pointer', transition:'all 0.3s', padding:0 }} />
              ))}
            </div>
          </div>
        </Section>
      </section>

      {/* ── TN QUOTE BANNER ── */}
      <section style={{ background:'linear-gradient(135deg,#c8a000,#a07800)', padding:'48px 1.5rem', textAlign:'center' }}>
        <Section>
          <div style={{ maxWidth:800, margin:'0 auto' }}>
            <div style={{ fontSize:'2rem', marginBottom:12 }}>🌾</div>
            <blockquote style={{ fontSize:'clamp(1.1rem,2.5vw,1.5rem)', fontWeight:700, color:'#fff', lineHeight:1.6, marginBottom:12, fontStyle:'italic' }}>
              "யாதும் ஊரே யாவரும் கேளிர்"
            </blockquote>
            <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'0.95rem', marginBottom:4 }}>
              "Every town is my town; every person is my kin."
            </p>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.8rem' }}>— கணியன் பூங்குன்றனார், புறநானூறு</p>
          </div>
        </Section>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:'64px 1.5rem', background:'#fff', textAlign:'center' }}>
        <Section>
          <div style={{ maxWidth:700, margin:'0 auto' }}>
            <h2 style={{ fontSize:'clamp(1.6rem,3.5vw,2.4rem)', fontWeight:800, color:'#1a1a1a', marginBottom:12 }}>உங்கள் குடும்ப அட்டையை டிஜிட்டல் ஆக்குங்கள்</h2>
            <p style={{ color:'#666', marginBottom:32, fontSize:'1rem' }}>Digitise your ration card today. Join thousands of Tamil Nadu families already using the TNPDS portal.</p>
            <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/register" className="gov-btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 32px', borderRadius:6, background:'#1a6b3c', color:'#fff', textDecoration:'none', fontWeight:700, fontSize:'1rem', transition:'all 0.2s' }}>
                பதிவு செய்யுங்கள் / Register <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="gov-btn-outline" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 32px', borderRadius:6, border:'2px solid #1a6b3c', color:'#1a6b3c', textDecoration:'none', fontWeight:700, fontSize:'1rem', transition:'all 0.2s' }}>
                உள்நுழைவு / Login
              </Link>
            </div>
          </div>
        </Section>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#0d4a28', borderTop:'4px solid #c8a000', padding:'48px 1.5rem 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:40, marginBottom:40 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <TNEmblem />
                <div>
                  <div style={{ fontWeight:800, color:'#fff', fontSize:'0.95rem' }}>Digital Ration Distribution</div>
                  <div style={{ fontWeight:800, color:'#c8a000', fontSize:'0.85rem' }}>Monitoring System</div>
                  <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.6)' }}>Government of Tamil Nadu</div>
                </div>
              </div>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.85rem', lineHeight:1.7 }}>
                Department of Civil Supplies &amp; Consumer Protection, Government of Tamil Nadu. Ensuring transparent and efficient food distribution.
              </p>
            </div>
            <div>
              <h4 style={{ color:'#c8a000', fontWeight:700, marginBottom:14, fontSize:'0.875rem', textTransform:'uppercase', letterSpacing:1 }}>Quick Links</h4>
              {['Smart Card Status','Apply for Ration Card','Grievance Portal','NFSA Reports','Shop Locator'].map(l => (
                <div key={l} style={{ marginBottom:8 }}>
                  <a href="#" style={{ color:'rgba(255,255,255,0.55)', textDecoration:'none', fontSize:'0.85rem', transition:'color 0.2s' }} onMouseEnter={e=>e.target.style.color='#c8a000'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.55)'}>{l}</a>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ color:'#c8a000', fontWeight:700, marginBottom:14, fontSize:'0.875rem', textTransform:'uppercase', letterSpacing:1 }}>Portals</h4>
              <Link to="/login" style={{ display:'block', marginBottom:8, color:'rgba(255,255,255,0.55)', textDecoration:'none', fontSize:'0.85rem' }}>Admin Portal</Link>
              <Link to="/login" style={{ display:'block', marginBottom:8, color:'rgba(255,255,255,0.55)', textDecoration:'none', fontSize:'0.85rem' }}>Shopkeeper Login</Link>
              <Link to="/login" style={{ display:'block', marginBottom:8, color:'rgba(255,255,255,0.55)', textDecoration:'none', fontSize:'0.85rem' }}>Beneficiary Login</Link>
              <Link to="/register" style={{ display:'block', marginBottom:8, color:'rgba(255,255,255,0.55)', textDecoration:'none', fontSize:'0.85rem' }}>New Registration</Link>
            </div>
            <div>
              <h4 style={{ color:'#c8a000', fontWeight:700, marginBottom:14, fontSize:'0.875rem', textTransform:'uppercase', letterSpacing:1 }}>Contact</h4>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.85rem', lineHeight:1.8 }}>
                Civil Supplies &amp; Consumer Protection Dept.<br />
                Chepauk, Chennai — 600 005<br />
                Tamil Nadu, India<br />
                📞 Toll Free: 1967
              </p>
            </div>
          </div>
          <div style={{ borderTop:'1px solid rgba(200,160,0,0.2)', paddingTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.8rem' }}>© 2026 Government of Tamil Nadu — Digital Ration Distribution Monitoring System. All rights reserved.</p>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.8rem' }}>தமிழ்நாடு அரசு — உணவு வழங்கல் துறை</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
