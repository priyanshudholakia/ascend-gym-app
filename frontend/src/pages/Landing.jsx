import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';

const IMGS = {
  hero: 'https://images.unsplash.com/photo-1517963879433-6ad2a56b4ea5?w=1600&q=80&fit=crop',
  aboutMain: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80&fit=crop',
  aboutSmall: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80&fit=crop',
  prog1: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=80&fit=crop',
  prog2: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&fit=crop',
  prog3: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=900&q=80&fit=crop',
  achLeft: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&fit=crop',
  achMid: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=80&fit=crop',
  achRight: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80&fit=crop',
};

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } };
const fadeLeft = { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } };
const fadeRight = { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } };

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target.replace(/\D/g, ''));
    const step = Math.ceil(num / 60);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, num);
      setCount(cur);
      if (cur >= num) clearInterval(t);
    }, 25);
    return () => clearInterval(t);
  }, [inView, target]);
  const prefix = target.startsWith('+') ? '' : '';
  const hasSuffix = target.includes('+');
  return <span ref={ref}>{prefix}{count.toLocaleString()}{hasSuffix ? '+' : ''}{suffix}</span>;
}

const heroImages = [
  'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/791763/pexels-photo-791763.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/3837781/pexels-photo-3837781.jpeg?auto=compress&cs=tinysrgb&w=1600',
];

const feedbackTestimonials = [
  { quote: "Best decision I made this year. The coaching changed everything.", name: "Rahul S.", tag: "Gold Member", rating: 5 },
  { quote: "Went from 60kg to 100kg bench in 8 months. The programming here is elite.", name: "Anika P.", tag: "Pro Member", rating: 5 },
  { quote: "The community keeps you accountable. Nobody lets you slack off here.", name: "Dev M.", tag: "Basic Member", rating: 4 },
];

function FeedbackSection() {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState('General');

  const handleSubmit = () => {
    if (!feedbackName || !feedbackText || feedbackRating === 0) return;
    setFeedbackSubmitted(true);
  };

  return (
    <section className="bg-[#0d0d0d] py-24 px-8 border-t border-[#1f1f1f]">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#e8ff00] text-xs uppercase tracking-[4px] font-['Inter'] font-bold mb-4">FEEDBACK</p>
        <div className="flex items-end justify-between mb-16">
          <h2 className="font-['Bebas_Neue'] text-6xl text-white leading-none">
            SHARE YOUR<br /><span className="text-[rgba(255,255,255,0.25)]">EXPERIENCE.</span>
          </h2>
          <p className="text-[rgba(255,255,255,0.4)] font-['Inter'] text-sm max-w-xs text-right">
            Your feedback helps us build a better gym. Every word counts.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-0">
          {/* Left — static quotes */}
          <div className="border-r border-[#1f1f1f] pr-12">
            <p className="font-['Inter'] text-xs uppercase tracking-[2px] text-[rgba(255,255,255,0.3)] mb-8">WHAT MEMBERS SAY</p>
            {feedbackTestimonials.map((t, i) => (
              <motion.div key={i} className="border-b border-[#1f1f1f] py-6"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className={`text-xs ${s < t.rating ? 'text-[#e8ff00]' : 'text-[rgba(255,255,255,0.1)]'}`}>★</span>
                  ))}
                </div>
                <p className="font-['Inter'] text-sm text-[rgba(255,255,255,0.65)] leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-[#e8ff00] flex items-center justify-center text-black font-bold text-[10px]">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-['Inter'] text-xs font-bold text-white">{t.name}</p>
                    <p className="font-['Inter'] text-[10px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">{t.tag}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Right — feedback form */}
          <div className="pl-12">
            <p className="font-['Inter'] text-xs uppercase tracking-[2px] text-[rgba(255,255,255,0.3)] mb-8">LEAVE YOUR FEEDBACK</p>
            {feedbackSubmitted ? (
              <motion.div className="border border-[#1f1f1f] border-t-2 border-t-[#e8ff00] p-8 flex flex-col items-center justify-center text-center"
                style={{ minHeight: '400px' }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-12 h-12 bg-[#e8ff00] flex items-center justify-center mb-6">
                  <span className="text-black font-bold text-xl">✓</span>
                </div>
                <h3 className="font-['Bebas_Neue'] text-3xl text-white mb-3">THANK YOU.</h3>
                <p className="font-['Inter'] text-sm text-[rgba(255,255,255,0.5)] max-w-xs">
                  Your feedback has been received. We'll use it to keep improving Ascend.
                </p>
                <button onClick={() => { setFeedbackSubmitted(false); setFeedbackRating(0); setFeedbackName(''); setFeedbackText(''); setFeedbackType('General'); }}
                  className="mt-8 border border-[#1f1f1f] hover:border-[#e8ff00] text-[rgba(255,255,255,0.4)] hover:text-[#e8ff00] font-['Inter'] text-xs uppercase tracking-widest px-6 py-2 transition-all duration-300">
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <div className="border border-[#1f1f1f] border-t-2 border-t-[#e8ff00] p-8">
                <div className="mb-6">
                  <p className="font-['Inter'] text-xs uppercase tracking-[2px] text-[rgba(255,255,255,0.3)] mb-3">YOUR RATING</p>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} onClick={() => setFeedbackRating(star)}
                        onMouseEnter={() => setFeedbackHover(star)} onMouseLeave={() => setFeedbackHover(0)}
                        className={`text-2xl transition-all duration-150 ${star <= (feedbackHover || feedbackRating) ? 'text-[#e8ff00] scale-110' : 'text-[rgba(255,255,255,0.15)]'}`}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="font-['Inter'] text-xs uppercase tracking-[2px] text-[rgba(255,255,255,0.3)] mb-3">CATEGORY</p>
                  <div className="flex gap-2 flex-wrap">
                    {['General', 'Coaching', 'Equipment', 'Cleanliness', 'Community'].map(type => (
                      <button key={type} onClick={() => setFeedbackType(type)}
                        className={`font-['Inter'] text-[10px] uppercase tracking-wider px-3 py-1.5 border transition-all duration-200 ${feedbackType === type ? 'bg-[#e8ff00] text-black border-[#e8ff00] font-bold' : 'border-[#1f1f1f] text-[rgba(255,255,255,0.4)] hover:border-[#e8ff00] hover:text-[#e8ff00]'}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="font-['Inter'] text-xs uppercase tracking-[2px] text-[rgba(255,255,255,0.3)] mb-2">YOUR NAME</p>
                  <input type="text" placeholder="e.g. Rahul S." value={feedbackName}
                    onChange={e => setFeedbackName(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#1f1f1f] focus:border-[#e8ff00] text-white placeholder-[rgba(255,255,255,0.2)] font-['Inter'] text-sm px-4 py-3 outline-none transition-colors duration-200" />
                </div>
                <div className="mb-6">
                  <p className="font-['Inter'] text-xs uppercase tracking-[2px] text-[rgba(255,255,255,0.3)] mb-2">YOUR FEEDBACK</p>
                  <textarea rows={4} placeholder="Tell us about your experience at Ascend..." value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#1f1f1f] focus:border-[#e8ff00] text-white placeholder-[rgba(255,255,255,0.2)] font-['Inter'] text-sm px-4 py-3 outline-none transition-colors duration-200 resize-none" />
                </div>
                <button onClick={handleSubmit} disabled={!feedbackName || !feedbackText || feedbackRating === 0}
                  className={`w-full font-['Inter'] font-bold text-xs uppercase tracking-widest py-3 transition-all duration-300 ${feedbackName && feedbackText && feedbackRating > 0 ? 'bg-[#e8ff00] text-black hover:bg-white cursor-pointer' : 'bg-[#141414] text-[rgba(255,255,255,0.2)] cursor-not-allowed border border-[#1f1f1f]'}`}>
                  SUBMIT FEEDBACK →
                </button>
                <p className="font-['Inter'] text-[10px] text-[rgba(255,255,255,0.2)] mt-3 text-center uppercase tracking-wider">
                  All three fields + a rating are required
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}



export default function Landing() {
  const navigate = useNavigate();
  const [splashDone, setSplashDone] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', source: '' });
  const [formSent, setFormSent] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashDone(true), 2400);
    const removeTimer = setTimeout(() => setSplashVisible(false), 3000);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: 'ABOUT', id: 'about' },
    { label: 'PROGRAMS', id: 'programs' },
    { label: 'ACHIEVEMENTS', id: 'achievements' },
    { label: 'CONTACT', id: 'contact' },
  ];

  const programs = [
    { num: '01', title: 'STRENGTH & POWERLIFTING', img: IMGS.prog1, desc: 'Structured programs for squat, bench, and deadlift. Built for athletes who want to move serious weight.' },
    { num: '02', title: 'FUNCTIONAL FITNESS', img: IMGS.prog2, desc: 'High-intensity functional movement. Build work capacity, endurance, and athleticism that transfers to real life.' },
    { num: '03', title: 'PERSONAL COACHING', img: IMGS.prog3, desc: 'One-on-one sessions with certified coaches. Tailored programs, form checks, and accountability — every step.' },
  ];

  const testimonials = [
    { quote: 'Ascend completely changed how I train. Hit a 180kg deadlift PR last month after 6 months here. The coaching is next level.', name: 'Rahul S.', tier: 'Gold Member', initials: 'RS' },
    { quote: 'The powerlifting program is insane. Went from 60kg to 100kg bench in 8 months. Best gym in Vadodara, no question.', name: 'Anika P.', tier: 'Pro Member', initials: 'AP' },
    { quote: "Staff actually knows your name. Tracks your progress. Feels like a team, not just a gym.", name: 'Dev M.', tier: 'Active Member', initials: 'DM' },
  ];

  const stats = [
    { value: '500+', label: 'Active Members' },
    { value: '12000+', label: 'Workouts Logged' },
    { value: '47', label: 'Competition Medals' },
    { value: '98', label: 'Renewal Rate', suffix: '%' },
  ];

  return (
    <div className="bg-[#0d0d0d] text-white font-['Inter'] overflow-x-hidden">

      {/* ===== SPLASH SCREEN ===== */}
      {splashVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          animate={{ opacity: splashDone ? 0 : 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="relative flex flex-col items-center justify-center">
            <motion.div
              className="absolute h-px bg-[#e8ff00]"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
              style={{ top: '-12px', left: 0 }}
            />
            <div className="flex items-center overflow-hidden">
              {'ASCEND'.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  className="font-['Bebas_Neue'] text-[100px] leading-none text-white inline-block"
                  initial={{ y: 120, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            <motion.p
              className="font-['Inter'] text-xs uppercase tracking-[8px] text-[rgba(255,255,255,0.4)] mt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              Train · Track · Dominate
            </motion.p>
            <motion.div
              className="absolute h-px bg-[#e8ff00]"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.0, ease: 'easeOut' }}
              style={{ bottom: '-12px', right: 0 }}
            />
            <motion.div
              className="w-1.5 h-1.5 bg-[#e8ff00] rounded-full mt-6"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, delay: 1.3, times: [0, 0.5, 1] }}
            />
          </div>
          <motion.p
            className="absolute bottom-8 left-8 font-['Inter'] text-[10px] uppercase tracking-[3px] text-[rgba(255,255,255,0.2)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            Est. 2019 · Vadodara
          </motion.p>
          <motion.p
            className="absolute bottom-8 right-8 font-['Inter'] text-[10px] uppercase tracking-[3px] text-[rgba(255,255,255,0.2)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            Gym Management Platform
          </motion.p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#1f1f1f] h-14 flex items-center justify-between px-8"
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="border-l-4 border-[#e8ff00] pl-3 font-['Bebas_Neue'] text-2xl text-white tracking-widest cursor-pointer bg-transparent border-t-0 border-r-0 border-b-0 p-0"
        >
          ASCEND
        </button>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="text-xs font-semibold uppercase tracking-widest text-[rgba(255,255,255,0.5)] hover:text-white transition-colors">
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} id="nav-login-btn"
            className="border border-[#1f1f1f] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 hover:border-[#e8ff00] hover:text-[#e8ff00] transition-all rounded-none">
            MEMBER LOGIN
          </button>
          <button onClick={() => navigate('/login')} id="nav-join-btn"
            className="bg-[#e8ff00] text-black text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-white transition-colors rounded-none">
            JOIN NOW
          </button>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="min-h-screen pt-14 relative flex items-end pb-20 overflow-hidden">
        {heroImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Ascend Gym"
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
            style={{ opacity: i === heroIndex ? 1 : 0 }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ))}
        {/* Fallback dark background always behind images */}
        <div className="absolute inset-0 bg-[#111111]" style={{ zIndex: -1 }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
          <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}>
            <motion.p variants={fadeUp} className="text-[#e8ff00] text-xs font-bold uppercase tracking-[4px] mb-4">
              EST. 2019 · VADODARA, GUJARAT
            </motion.p>
            <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}>
              {['FORGE', 'YOUR', 'LIMITS.'].map((word) => (
                <motion.div key={word} variants={fadeUp}>
                  <span className="font-['Bebas_Neue'] text-[clamp(72px,10vw,120px)] leading-[0.85] text-white block">
                    {word === 'LIMITS.' ? (
                      <>LIMITS<span className="text-[#e8ff00]">.</span></>
                    ) : word}
                  </span>
                </motion.div>
              ))}
            </motion.div>
            <motion.p variants={fadeUp} className="text-[rgba(255,255,255,0.6)] text-lg font-light mt-6 mb-10 max-w-md">
              Elite strength training. Serious community. Zero excuses.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-14">
              <button onClick={() => navigate('/login')} id="hero-cta-primary"
                className="bg-[#e8ff00] text-black font-bold uppercase tracking-widest px-8 py-4 text-sm rounded-none hover:bg-white transition-colors">
                BEGIN YOUR JOURNEY →
              </button>
              <button onClick={() => scrollTo('programs')}
                className="border border-[#e8ff00] text-[#e8ff00] font-bold uppercase tracking-widest px-8 py-4 text-sm rounded-none hover:bg-[#e8ff00] hover:text-black transition-colors">
                EXPLORE PROGRAMS ↓
              </button>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-8">
              {[['500+', 'MEMBERS'], ['3', 'LOCATIONS'], ['7', 'YEARS STRONG']].map(([num, label]) => (
                <div key={label} className="flex items-center gap-4">
                  <div>
                    <div className="font-['Bebas_Neue'] text-4xl text-white leading-none">{num}</div>
                    <div className="text-[rgba(255,255,255,0.4)] text-[10px] uppercase tracking-widest mt-0.5">{label}</div>
                  </div>
                  <div className="w-px h-10 bg-[#1f1f1f] last:hidden" />
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`w-6 h-0.5 transition-all duration-300 ${i === heroIndex ? 'bg-[#e8ff00]' : 'bg-white/30'}`}
            />
          ))}
        </div>
        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] text-[#e8ff00] uppercase tracking-[4px] font-bold" style={{ writingMode: 'vertical-rl' }}>SCROLL</span>
          <div className="w-px h-12 bg-[#e8ff00] animate-pulse" />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="bg-[#0d0d0d] py-24 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={fadeLeft} transition={{ duration: 0.6 }}>
            <p className="text-[#e8ff00] text-xs uppercase tracking-[3px] font-bold mb-4">WHO WE ARE</p>
            <h2 className="font-['Bebas_Neue'] text-6xl text-white leading-none">NOT JUST A GYM.</h2>
            <h2 className="font-['Bebas_Neue'] text-6xl text-[rgba(255,255,255,0.3)] leading-none mb-6">A PROVING GROUND.</h2>
            <p className="text-[rgba(255,255,255,0.55)] text-base leading-relaxed mb-4">
              Ascend was built for people who are serious about results. No fluff. No overcrowded floors. Just world-class equipment, expert coaching, and a community that pushes you harder than you'd push yourself.
            </p>
            <p className="text-[rgba(255,255,255,0.55)] text-base leading-relaxed mb-8">
              Whether you're chasing your first 100kg squat or your fifth powerlifting competition, this is where you come to do the work.
            </p>
            <div className="flex flex-wrap gap-3">
              {['📍 Vadodara, Gujarat', '🕐 Open 5AM – 11PM'].map((pill) => (
                <span key={pill} className="bg-[#141414] border border-[#1f1f1f] px-4 py-2 text-xs text-[rgba(255,255,255,0.5)] uppercase tracking-wider">{pill}</span>
              ))}
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={fadeRight} transition={{ duration: 0.6 }} className="relative h-80 lg:h-96">
            <img src={IMGS.aboutMain} alt="Gym interior" className="w-full h-full object-cover border border-[#1f1f1f]" onError={(e) => { e.target.style.background = '#1a1a1a'; e.target.src = ''; }} />
            <img src={IMGS.aboutSmall} alt="Heavy lifting" className="absolute -bottom-8 -right-8 w-48 h-48 object-cover border-2 border-[#e8ff00]" onError={(e) => { e.target.style.background = '#1a1a1a'; e.target.src = ''; }} />
          </motion.div>
        </div>
      </section>

      {/* ── PROGRAMS ── */}
      <section id="programs" className="bg-[#080808] py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#e8ff00] text-xs uppercase tracking-[3px] font-bold mb-3">WHAT WE OFFER</p>
            <h2 className="font-['Bebas_Neue'] text-6xl text-white">TRAIN WITH PURPOSE</h2>
          </div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#1f1f1f]"
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}>
            {programs.map(({ num, title, img, desc }) => (
              <motion.div key={num} variants={fadeUp} transition={{ duration: 0.5 }}
                className="relative h-96 overflow-hidden group cursor-pointer border-r border-[#1f1f1f] last:border-r-0 flex flex-col justify-end p-8">
                <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500" onError={(e) => { e.target.style.background = '#1a1a1a'; e.target.src = ''; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <span className="absolute top-4 right-4 font-['Bebas_Neue'] text-7xl text-[#e8ff00] opacity-20 leading-none select-none">{num}</span>
                <div className="relative z-10">
                  <h3 className="font-['Bebas_Neue'] text-3xl text-white leading-tight mb-2">{title}</h3>
                  <p className="text-[rgba(255,255,255,0.5)] text-sm leading-relaxed">{desc}</p>
                  <div className="mt-4 h-0.5 bg-[#e8ff00] w-0 group-hover:w-full transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      <section id="achievements" className="bg-[#0d0d0d] py-20 px-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(232,255,0,0.04) 0%, transparent 70%)' }} />
        <div className="w-full h-1 bg-[#e8ff00] mb-16" />
        <div className="max-w-6xl mx-auto relative">
          <p className="text-[#e8ff00] text-xs uppercase tracking-[4px] font-['Inter'] font-bold mb-4">THE NUMBERS</p>
          <h2 className="font-['Bebas_Neue'] text-6xl text-white mb-16">ASCEND BY THE NUMBERS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {stats.map(({ value, label, suffix }) => (
              <div key={label} className="border-t-2 border-[#e8ff00] pt-6 group cursor-default transition-all duration-300 hover:bg-[#141414] p-4 -mx-4">
                <div className="font-['Bebas_Neue'] text-7xl text-[#e8ff00] leading-none group-hover:text-white transition-colors duration-300">
                  <CountUp target={value} suffix={suffix || ''} />
                </div>
                <p className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[rgba(255,255,255,0.5)] mt-3">{label}</p>
              </div>
            ))}
          </div>
          <div className="w-full h-px bg-[#1f1f1f] my-12" />
          <div className="grid grid-cols-3 gap-4">
            {[
              { src: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80&fit=crop', alt: 'Powerlifting', label: 'STRENGTH' },
              { src: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80&fit=crop', alt: 'Deadlift', label: 'POWER' },
              { src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80&fit=crop', alt: 'Gym equipment', label: 'ELITE GEAR' },
            ].map(({ src, alt, label }) => (
              <div key={label} className="col-span-1 relative overflow-hidden cursor-pointer group" style={{ height: '260px' }}>
                <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.target.style.background = '#1a1a1a'; e.target.src = ''; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/40 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-0.5 h-0 bg-[#e8ff00] group-hover:h-full transition-all duration-500" />
                <span className="absolute bottom-4 left-4 font-['Bebas_Neue'] text-xl text-white group-hover:text-[#e8ff00] transition-colors duration-300">{label}</span>
              </div>
            ))}
          </div>
          <div className="w-full h-px bg-[#1f1f1f] mt-16" />
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-[#0d0d0d] py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-[#e8ff00] text-xs uppercase tracking-[3px] font-bold mb-3">REAL RESULTS</p>
            <h2 className="font-['Bebas_Neue'] text-6xl text-white">MEMBERS SPEAK.</h2>
          </div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}>
            {testimonials.map(({ quote, name, tier, initials }) => (
              <motion.div key={name} variants={fadeUp} transition={{ duration: 0.5 }}
                className="bg-[#141414] border border-[#1f1f1f] border-t-2 border-t-[#e8ff00] p-6">
                <div className="font-['Bebas_Neue'] text-6xl text-[#e8ff00] leading-none mb-3">"</div>
                <p className="text-[rgba(255,255,255,0.7)] text-sm leading-relaxed mb-6">"{quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#1f1f1f]">
                  <div className="w-9 h-9 bg-[#e8ff00] text-black font-bold text-xs flex items-center justify-center rounded-none flex-shrink-0">{initials}</div>
                  <div>
                    <p className="text-white text-sm font-semibold">{name}</p>
                    <p className="text-[rgba(255,255,255,0.3)] text-[10px] uppercase tracking-widest">{tier}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ── MEMBERSHIP PRICING ── */}
      <section className="bg-[#080808] py-24 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(232,255,0,0.03) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto relative">
          <p className="text-[#e8ff00] text-xs uppercase tracking-[4px] font-['Inter'] font-bold mb-4">MEMBERSHIP</p>
          <div className="flex items-end justify-between mb-16">
            <h2 className="font-['Bebas_Neue'] text-6xl text-white leading-none">CHOOSE YOUR<br /><span className="text-[rgba(255,255,255,0.25)]">LEVEL.</span></h2>
            <p className="text-[rgba(255,255,255,0.4)] font-['Inter'] text-sm max-w-xs text-right">No lock-in contracts. Cancel anytime. Start your first week free.</p>
          </div>
          <div className="grid grid-cols-3 gap-0">
            {/* BASIC */}
            <div className="border border-[#1f1f1f] border-r-0 p-8 group hover:bg-[#141414] transition-all duration-300 cursor-pointer">
              <div className="mb-8">
                <p className="font-['Inter'] text-xs uppercase tracking-[3px] text-[rgba(255,255,255,0.35)] mb-2">STARTER</p>
                <h3 className="font-['Bebas_Neue'] text-4xl text-white mb-1">BASIC</h3>
                <div className="flex items-end gap-1 mt-4">
                  <span className="font-['Bebas_Neue'] text-6xl text-white leading-none">₹999</span>
                  <span className="font-['Inter'] text-xs text-[rgba(255,255,255,0.4)] mb-2">/month</span>
                </div>
              </div>
              <div className="w-8 h-px bg-[#1f1f1f] group-hover:bg-[#e8ff00] group-hover:w-full transition-all duration-500 mb-8" />
              <ul className="space-y-3 mb-10">
                {['Locker room access', '2 guest passes/month'].map(f => (
                  <li key={f} className="flex items-center gap-3 font-['Inter'] text-sm text-[rgba(255,255,255,0.55)]"><span className="text-[#e8ff00] text-xs">✦</span> {f}</li>
                ))}
                {['Group classes', 'Personal coaching', 'AI workout guidance', 'Nutrition guidance'].map(f => (
                  <li key={f} className="flex items-center gap-3 font-['Inter'] text-sm text-[rgba(255,255,255,0.2)] line-through"><span className="text-[rgba(255,255,255,0.2)] text-xs">✦</span> {f}</li>
                ))}
              </ul>
              <button onClick={() => navigate('/login')} className="w-full border border-[#1f1f1f] group-hover:border-[#e8ff00] text-[rgba(255,255,255,0.6)] group-hover:text-[#e8ff00] font-['Inter'] font-bold text-xs uppercase tracking-widest py-3 rounded-none transition-all duration-300">GET STARTED →</button>
            </div>
            {/* PRO */}
            <div className="border border-[#e8ff00] p-8 relative bg-[#111] cursor-pointer">
              <div className="absolute -top-px left-0 right-0 flex justify-center">
                <span className="bg-[#e8ff00] text-black font-['Inter'] font-bold text-[9px] uppercase tracking-[2px] px-4 py-1">MOST POPULAR</span>
              </div>
              <div className="mb-8 mt-2">
                <p className="font-['Inter'] text-xs uppercase tracking-[3px] text-[#e8ff00] mb-2">RECOMMENDED</p>
                <h3 className="font-['Bebas_Neue'] text-4xl text-white mb-1">PRO</h3>
                <div className="flex items-end gap-1 mt-4">
                  <span className="font-['Bebas_Neue'] text-6xl text-[#e8ff00] leading-none">₹1,799</span>
                  <span className="font-['Inter'] text-xs text-[rgba(255,255,255,0.4)] mb-2">/month</span>
                </div>
              </div>
              <div className="w-full h-px bg-[#e8ff00]/30 mb-8" />
              <ul className="space-y-3 mb-10">
                {['Locker room access', 'Unlimited guest passes', 'Group classes', '2 coaching sessions/month'].map(f => (
                  <li key={f} className="flex items-center gap-3 font-['Inter'] text-sm text-[rgba(255,255,255,0.75)]"><span className="text-[#e8ff00] text-xs">✦</span> {f}</li>
                ))}
                <li className="flex items-center gap-3 font-['Inter'] text-sm text-[rgba(255,255,255,0.75)]">
                  <span className="text-[#e8ff00] text-xs">✦</span>
                  AI workout guidance
                  <span className="bg-[#e8ff00] text-black text-[8px] font-bold uppercase px-1.5 py-0.5 ml-1">BETA</span>
                </li>
                {['Nutrition guidance'].map(f => (
                  <li key={f} className="flex items-center gap-3 font-['Inter'] text-sm text-[rgba(255,255,255,0.2)] line-through"><span className="text-[rgba(255,255,255,0.2)] text-xs">✦</span> {f}</li>
                ))}
              </ul>
              <button onClick={() => navigate('/login')} className="w-full bg-[#e8ff00] hover:bg-white text-black font-['Inter'] font-bold text-xs uppercase tracking-widest py-3 rounded-none transition-all duration-300">JOIN NOW →</button>
            </div>
            {/* GOLD */}
            <div className="border border-[#1f1f1f] border-l-0 p-8 group hover:bg-[#141414] transition-all duration-300 cursor-pointer">
              <div className="mb-8">
                <p className="font-['Inter'] text-xs uppercase tracking-[3px] text-[rgba(255,255,255,0.35)] mb-2">ELITE</p>
                <h3 className="font-['Bebas_Neue'] text-4xl text-white mb-1">GOLD</h3>
                <div className="flex items-end gap-1 mt-4">
                  <span className="font-['Bebas_Neue'] text-6xl text-white leading-none">₹2,999</span>
                  <span className="font-['Inter'] text-xs text-[rgba(255,255,255,0.4)] mb-2">/month</span>
                </div>
              </div>
              <div className="w-8 h-px bg-[#1f1f1f] group-hover:bg-[#e8ff00] group-hover:w-full transition-all duration-500 mb-8" />
              <ul className="space-y-3 mb-10">
                {['Premium locker room', 'Unlimited guests', 'All group classes', 'Daily coaching sessions'].map(f => (
                  <li key={f} className="flex items-center gap-3 font-['Inter'] text-sm text-[rgba(255,255,255,0.55)]"><span className="text-[#e8ff00] text-xs">✦</span> {f}</li>
                ))}
                <li className="flex items-center gap-3 font-['Inter'] text-sm text-[rgba(255,255,255,0.55)]">
                  <span className="text-[#e8ff00] text-xs">✦</span>
                  AI workout guidance
                  <span className="bg-[#e8ff00] text-black text-[8px] font-bold uppercase px-1.5 py-0.5 ml-1">INCLUDED</span>
                </li>
                <li className="flex items-center gap-3 font-['Inter'] text-sm text-[rgba(255,255,255,0.55)]"><span className="text-[#e8ff00] text-xs">✦</span> Personalised nutrition plan</li>
              </ul>
              <button onClick={() => navigate('/login')} className="w-full border border-[#1f1f1f] group-hover:border-[#e8ff00] text-[rgba(255,255,255,0.6)] group-hover:text-[#e8ff00] font-['Inter'] font-bold text-xs uppercase tracking-widest py-3 rounded-none transition-all duration-300">GO ELITE →</button>
            </div>
          </div>
          <p className="text-center text-[rgba(255,255,255,0.25)] font-['Inter'] text-xs mt-8 uppercase tracking-widest">All plans include a free 7-day trial · No credit card required to start</p>
        </div>
      </section>

      {/* ── CONTACT / LOCATION ── */}
      <section id="contact" className="bg-[#080808] py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-[#e8ff00] text-xs uppercase tracking-[3px] font-bold mb-3">FIND US</p>
            <h2 className="font-['Bebas_Neue'] text-6xl text-white">WHERE TO FIND ASCEND</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={fadeLeft} transition={{ duration: 0.5 }}>
              {[
                { flagship: true, title: 'MAIN GYM', addr: 'Plot 42, Karelibaug, Vadodara — 390018', hours1: 'MON–SAT: 5AM – 11PM', hours2: 'SUN: 6AM – 9PM', phone: '+91 98765 43210' },
                { flagship: false, title: 'ALKAPURI BRANCH', addr: '12 Race Course Road, Alkapuri, Vadodara', hours1: 'MON–SAT: 6AM – 10PM', hours2: 'SUN: 7AM – 8PM', phone: '+91 98765 43211' },
              ].map(({ flagship, title, addr, hours1, hours2, phone }) => (
                <div key={title} className={`bg-[#141414] border border-[#1f1f1f] p-6 mb-4 ${flagship ? 'border-t-2 border-t-[#e8ff00]' : ''}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-['Bebas_Neue'] text-2xl text-white">{title}</h3>
                    {flagship && <span className="bg-[#e8ff00] text-black text-[9px] font-bold uppercase px-2 py-0.5">FLAGSHIP</span>}
                  </div>
                  <p className="text-[rgba(255,255,255,0.5)] text-sm mb-3">{addr}</p>
                  <p className="text-[#e8ff00] text-xs font-mono mb-0.5">{hours1}</p>
                  <p className="text-[#e8ff00] text-xs font-mono mb-3">{hours2}</p>
                  <p className="text-[rgba(255,255,255,0.4)] text-xs font-mono">{phone}</p>
                </div>
              ))}
            </motion.div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={fadeRight} transition={{ duration: 0.5 }}
              className="bg-[#141414] border border-[#1f1f1f] border-t-2 border-t-[#e8ff00] p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-['Bebas_Neue'] text-4xl text-white mb-3">READY TO START?</h3>
                <p className="text-[rgba(255,255,255,0.5)] text-sm mb-8">Get a free 1-day pass and see what Ascend is about.</p>
                {formSent ? (
                  <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-sm font-['Inter'] px-6 py-5">
                    We'll call you within 24 hours. Welcome to Ascend.
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setFormSent(true); }} className="space-y-4">
                    <input type="text" placeholder="Your Name" required value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-[#0d0d0d] border border-[#1f1f1f] text-white placeholder-[rgba(255,255,255,0.2)] focus:border-[#e8ff00] focus:outline-none rounded-none px-4 py-3 w-full text-sm transition-all duration-200" />
                    <input type="tel" placeholder="Phone Number" required value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-[#0d0d0d] border border-[#1f1f1f] text-white placeholder-[rgba(255,255,255,0.2)] focus:border-[#e8ff00] focus:outline-none rounded-none px-4 py-3 w-full text-sm transition-all duration-200" />
                    <select required value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="bg-[#0d0d0d] border border-[#1f1f1f] text-[rgba(255,255,255,0.5)] focus:border-[#e8ff00] focus:outline-none rounded-none px-4 py-3 w-full text-sm transition-all duration-200">
                      <option value="">HOW DID YOU HEAR ABOUT US?</option>
                      <option value="instagram">Instagram</option>
                      <option value="google">Google</option>
                      <option value="friend">Friend</option>
                      <option value="walkin">Walk-in</option>
                    </select>
                    <button type="submit" id="claim-pass-btn"
                      className="bg-[#e8ff00] text-black font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-none hover:bg-white transition-colors w-full">
                      CLAIM FREE PASS →
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEEDBACK SECTION ===== */}
      <FeedbackSection />

      {/* ── FOOTER ── */}
      <footer className="bg-black border-t border-[#1f1f1f] py-12 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="font-['Bebas_Neue'] text-4xl text-white mb-1">ASCEND</div>
            <p className="text-[rgba(255,255,255,0.3)] text-sm mb-5">Train. Track. Dominate.</p>
            <div className="flex gap-2">
              {['IG', 'X', 'YT'].map((s) => (
                <div key={s} className="border border-[#1f1f1f] w-8 h-8 flex items-center justify-center text-xs text-[rgba(255,255,255,0.4)] hover:border-[#e8ff00] hover:text-[#e8ff00] transition-colors cursor-pointer">{s}</div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.3)] font-bold mb-4">QUICK LINKS</p>
            <div className="space-y-2">
              {navLinks.map(({ label, id }) => (
                <button key={id} onClick={() => scrollTo(id)} className="block text-[rgba(255,255,255,0.4)] hover:text-[#e8ff00] text-sm transition-colors">{label}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.3)] font-bold mb-4">MEMBER ACCESS</p>
            <div className="space-y-3">
              <button onClick={() => navigate('/login')} className="block border border-[#e8ff00] text-[#e8ff00] text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-[#e8ff00] hover:text-black transition-colors rounded-none w-full text-left">
                MEMBER LOGIN
              </button>
              <button onClick={() => navigate('/login')} className="block bg-[#e8ff00] text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-white transition-colors rounded-none w-full text-left">
                JOIN NOW
              </button>
              <button onClick={() => navigate('/login')} className="text-[rgba(255,255,255,0.2)] text-xs hover:text-[rgba(255,255,255,0.5)] transition-colors">
                Staff Portal →
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-[#1f1f1f] mt-8 pt-6 flex flex-col md:flex-row justify-between gap-2">
          <p className="text-[rgba(255,255,255,0.2)] text-[10px] uppercase tracking-wider">© 2026 ASCEND FITNESS PVT. LTD. ALL RIGHTS RESERVED.</p>
          <p className="text-[rgba(255,255,255,0.2)] text-[10px] uppercase tracking-wider">VADODARA, GUJARAT, INDIA</p>
        </div>
      </footer>
      </motion.div>

    </div>
  );
}
