import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) { setError('Email and password are required.'); return; }
    if (isRegister && !formData.name.trim()) { setError('Name is required.'); return; }
    try {
      setLoading(true);
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone, role: 'member' }
        : { email: formData.email, password: formData.password };
      const res = await api.post(endpoint, payload);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'staff' ? '/staff' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "bg-[#0d0d0d] border border-[#1f1f1f] text-white placeholder-[rgba(255,255,255,0.2)] focus:border-[#e8ff00] focus:outline-none rounded-none px-4 py-3 w-full font-['Inter'] text-sm transition-all duration-200";
  const labelClass = "block text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.4)] font-['Inter'] mb-2";

  const credentials = [
    { label: 'STAFF', email: 'staff@ascend.com', pass: 'staff123' },
    { label: 'MEMBER', email: 'member@ascend.com', pass: 'member123' },
    { label: 'MEMBER', email: 'riya@ascend.com', pass: 'member123' },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      {/* Left: Brand hero */}
      <div className="hidden lg:flex lg:w-1/2 border-r border-[#1f1f1f] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#e8ff00 1px, transparent 1px), linear-gradient(90deg, #e8ff00 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative z-10">
          <div className="border-l-4 border-[#e8ff00] pl-4 mb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.3)] font-['Inter']">GYM MANAGEMENT</span>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="font-['Bebas_Neue'] text-[10rem] leading-none text-white tracking-wide mb-4"
          >
            ASCEND
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[rgba(255,255,255,0.4)] font-['Inter'] text-lg tracking-widest uppercase"
          >
            Train<span className="text-[#e8ff00]">.</span> Track<span className="text-[#e8ff00]">.</span> Dominate<span className="text-[#e8ff00]">.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex gap-2"
          >
            {['STRENGTH', 'PERFORMANCE', 'RESULTS'].map((tag) => (
              <span key={tag} className="border border-[#1f1f1f] text-[rgba(255,255,255,0.2)] text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 font-['Inter']">
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Demo credentials */}
        <div className="relative z-10">
          <p className="text-[9px] uppercase tracking-widest text-[rgba(255,255,255,0.2)] font-['Inter'] mb-3">Demo Credentials</p>
          <div className="space-y-2">
            {credentials.map((c) => (
              <div key={c.email} className="bg-[#141414] border border-[#1f1f1f] text-xs font-mono text-[rgba(255,255,255,0.4)] px-3 py-2 flex items-center gap-3">
                <span className="text-[#e8ff00] text-[9px] font-['Inter'] font-bold tracking-widest">{c.label}</span>
                <span>{c.email}</span>
                <span className="text-[rgba(255,255,255,0.2)]">/</span>
                <span>{c.pass}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Wordmark */}
          <div className="flex items-center gap-2 mb-10">
            <span className="font-['Bebas_Neue'] text-2xl text-white tracking-widest">ASCEND</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8ff00]" />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-['Bebas_Neue'] text-5xl text-white tracking-wide">
              {isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </h2>
            <p className="text-[rgba(255,255,255,0.3)] text-xs font-['Inter'] mt-1 uppercase tracking-widest">
              {isRegister ? 'Join the platform' : 'Enter your credentials'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-[#ff4444]/10 border border-[#ff4444]/30 text-[#ff4444] text-xs font-['Inter'] px-4 py-3 uppercase tracking-wider"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
            {isRegister && (
              <div>
                <label className={labelClass}>Full Name</label>
                <input id="name-input" name="name" type="text" placeholder="Your full name" value={formData.name} onChange={handleChange} className={inputClass} />
              </div>
            )}

            <div>
              <label className={labelClass}>Email</label>
              <input id="email-input" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input id="password-input" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className={inputClass} />
            </div>

            {isRegister && (
              <div>
                <label className={labelClass}>Phone (optional)</label>
                <input id="phone-input" name="phone" type="tel" placeholder="+91-9876543210" value={formData.phone} onChange={handleChange} className={inputClass} />
              </div>
            )}

            <button
              type="submit"
              id="submit-btn"
              disabled={loading}
              className="bg-[#e8ff00] text-black font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-none hover:bg-white transition-colors duration-200 w-full font-['Inter'] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'LOADING...' : isRegister ? 'CREATE ACCOUNT →' : 'ENTER →'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1f1f1f]">
            <button
              id="toggle-auth-mode"
              onClick={() => { setIsRegister(!isRegister); setError(''); setFormData({ name: '', email: '', password: '', phone: '' }); }}
              className="text-[rgba(255,255,255,0.3)] text-xs font-['Inter'] hover:text-[#e8ff00] transition-colors duration-200 uppercase tracking-wider"
            >
              {isRegister ? '← Back to Sign In' : "Don't have an account? Register"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
