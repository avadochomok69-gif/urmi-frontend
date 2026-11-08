import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getMediaUrl } from '../utils/mediaUrl';
const mainHomeImage = '/mainhome.png';

/* ─────────────────────────────────────────────
   Decorative floating heart component
───────────────────────────────────────────── */
const FloatingHeart = ({ style, size = 16, opacity = 0.4, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: [0, opacity, 0], y: -60 }}
    transition={{ duration: 4, delay, repeat: Infinity, repeatDelay: Math.random() * 3 }}
    style={style}
    className="absolute pointer-events-none select-none"
  >
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
      className="text-red-500">
      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
    </svg>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Package Card Component
───────────────────────────────────────────── */
const PackageCard = ({ pkg, onSeeDemo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(145deg, #1a0505 0%, #0d0d0d 60%, #1a0000 100%)',
        border: '1px solid rgba(220,38,38,0.25)',
        boxShadow: '0 4px 30px rgba(220,38,38,0.1), 0 2px 8px rgba(0,0,0,0.6)',
        minHeight: '340px'
      }}
    >
      {/* Subtle red glow top-right */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)', filter: 'blur(20px)' }} />

      {/* Featured Image - 100% clear, contain mode without dark gradient/shadow */}
      <div className="relative w-full overflow-hidden flex items-center justify-center bg-black/40" style={{ height: '220px' }}>
        {pkg.thumbnail ? (
          <img
            src={getMediaUrl(pkg.thumbnail)}
            alt={pkg.title}
            className="w-full h-full object-contain"
            style={{ filter: 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #200000, #0a0000)' }}>
            <svg className="w-16 h-16 text-red-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
          </div>
        )}
        {/* Premium badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-xs font-bold tracking-widest uppercase px-2 py-1 rounded-full shadow-md"
            style={{ background: 'rgba(220,38,38,0.9)', color: '#fff', letterSpacing: '0.1em' }}>
            ♦ Premium
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-4 py-3 flex flex-col gap-3">
        {/* Title */}
        <h3 className="text-white font-bold text-lg leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
          {pkg.title}
        </h3>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">মূল্য</span>
            <p className="text-2xl font-bold leading-none"
              style={{
                background: 'linear-gradient(90deg, #ef4444, #ff6b6b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
              ৳{pkg.price}
            </p>
          </div>

          {/* See Demo Button */}
          <button
            onClick={() => onSeeDemo(pkg._id || pkg.id)}
            className="relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-bold tracking-wider text-white active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #1a0000 0%, #2d0000 50%, #1a0000 100%)',
              border: '1.5px solid transparent',
              backgroundClip: 'padding-box',
              boxShadow: '0 0 14px rgba(220,38,38,0.4), 0 0 28px rgba(220,38,38,0.15)',
            }}
          >
            {/* gradient border */}
            <span className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #dc2626, #ff4455, #991b1b)', zIndex: -1, margin: '-1.5px' }} />
            <span className="relative z-10">👁️ See Demo</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Main Landing Component
───────────────────────────────────────────── */
const Landing = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    axios.get('/api/packages').then(res => {
      setPackages(res.data.packages || []);
    }).catch(() => {});
  }, []);

  const handleSeeDemo = (packageId) => {
    navigate(`/package-demo/${packageId}`);
  };

  const hearts = [
    { style: { top: '15%', left: '5%' }, size: 12, opacity: 0.5, delay: 0 },
    { style: { top: '30%', left: '8%' }, size: 8, opacity: 0.3, delay: 1.2 },
    { style: { top: '60%', left: '3%' }, size: 14, opacity: 0.4, delay: 0.5 },
    { style: { top: '20%', right: '6%' }, size: 10, opacity: 0.4, delay: 0.8 },
    { style: { top: '50%', right: '4%' }, size: 16, opacity: 0.5, delay: 1.5 },
    { style: { top: '70%', right: '7%' }, size: 8, opacity: 0.3, delay: 2 },
    { style: { top: '10%', left: '25%' }, size: 6, opacity: 0.25, delay: 1 },
    { style: { top: '8%', right: '25%' }, size: 7, opacity: 0.25, delay: 2.5 },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">

      {/* ══ BACKGROUND LAYERS ══ */}
      {/* Deep crimson radial glow — left side */}
      <div className="red-ambient w-96 h-96 top-1/4 -left-24" style={{ width: 400, height: 400, top: '20%', left: '-80px' }} />
      {/* Deep crimson radial glow — right side */}
      <div className="red-ambient" style={{ width: 350, height: 350, top: '30%', right: '-60px' }} />
      {/* Top center glow */}
      <div className="red-ambient" style={{ width: 500, height: 300, top: '-80px', left: '50%', transform: 'translateX(-50%)' }} />
      {/* Bottom glow */}
      <div className="red-ambient" style={{ width: 600, height: 200, bottom: '-50px', left: '50%', transform: 'translateX(-50%)' }} />

      {/* Dark texture overlay */}
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.3) 2px,
            rgba(0,0,0,0.3) 4px
          )`
        }}
      />

      {/* Vignette */}
      <div className="vignette absolute inset-0 pointer-events-none" />

      {/* Floating Hearts */}
      {hearts.map((h, i) => (
        <FloatingHeart key={i} {...h} />
      ))}

      {/* ══════════════════════════════════════
          MOBILE LAYOUT  (flex-col, hidden on md+)
          USES HOME 2 IMAGE DIRECTLY
          ══════════════════════════════════════ */}
      <div className="relative z-10 md:hidden flex flex-col min-h-screen w-full m-0 p-0">
        
        {/* Mobile Homepage Image Container - Top 0, No gaps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full m-0 p-0"
        >
          {/* The exact main home image - flush with top 0, left 0, right 0 */}
          <img
            src={mainHomeImage}
            alt="Urmi's Kingdom"
            className="w-full h-auto block m-0 p-0"
            style={{
              width: '100%',
              display: 'block',
              margin: 0,
              padding: 0,
              filter: 'drop-shadow(0 0 20px rgba(229, 9, 32, 0.3))'
            }}
          />
        </motion.div>

        {/* ── MOBILE PACKAGE CARDS ── */}
        {packages.length > 0 && (
          <div className="w-full px-3 pb-6 mt-2 flex flex-col gap-4">
            <div className="flex items-center gap-3 mt-2">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(220,38,38,0.6))' }} />
              <span className="text-xs tracking-[0.3em] text-red-500 uppercase font-semibold">✦ Premium Packages ✦</span>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(220,38,38,0.6))' }} />
            </div>
            {packages.map((pkg) => (
              <PackageCard key={pkg._id || pkg.id} pkg={pkg} onSeeDemo={handleSeeDemo} />
            ))}
            <div className="h-20" />
          </div>
        )}
        {packages.length === 0 && <div className="h-24" />}
      </div>

      {/* ══════════════════════════════════════
          DESKTOP LAYOUT  (hidden on mobile, flex on md+)
          ══════════════════════════════════════ */}
      <div className="relative z-10 hidden md:flex min-h-screen flex-col">

        {/* Top ornamental bar */}
        <div className="flex items-center justify-center pt-10 pb-6 px-12">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-800 to-red-500" />
          <div className="mx-6 flex items-center gap-3">
            <span className="text-red-600 text-lg">♦</span>
            <span className="text-xs tracking-[0.4em] text-red-400 uppercase font-light">Exclusive Premium</span>
            <span className="text-red-600 text-lg">♦</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-red-800 to-red-500" />
        </div>

        {/* MAIN HERO GRID: Left text | Woman | Right text */}
        <div className="flex-1 flex items-center justify-center px-8 pb-12">
          <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center">

            {/* LEFT TEXT COLUMN */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="flex-1 flex flex-col items-end pr-6 lg:pr-10"
              style={{ maxWidth: '340px' }}
            >
              {/* Decorative corner ornament */}
              <div className="mb-6 self-end flex items-center gap-2 opacity-60">
                <div className="h-px w-16 bg-gradient-to-l from-red-500 to-transparent" />
                <span className="text-red-500 text-xs">✦</span>
              </div>

              <h1 className="script-title text-right leading-none"
                style={{
                  fontSize: 'clamp(40px, 5.5vw, 80px)',
                  color: '#fff',
                  textShadow: '0 0 20px rgba(220,38,38,0.8), 0 0 40px rgba(220,38,38,0.4), 0 4px 8px rgba(0,0,0,0.9)',
                  letterSpacing: '0.02em',
                  lineHeight: 1.1,
                }}
              >
                Welcome to
              </h1>
              <h2 className="script-title shimmer-text text-right leading-none mt-1"
                style={{
                  fontSize: 'clamp(36px, 5vw, 72px)',
                  letterSpacing: '0.03em',
                  lineHeight: 1.1,
                }}
              >
                Urmi's
              </h2>

              {/* Decorative bottom lines */}
              <div className="mt-5 flex flex-col items-end gap-1.5">
                <div className="h-px w-32 bg-gradient-to-l from-red-500 to-transparent" />
                <div className="h-px w-20 bg-gradient-to-l from-red-700/60 to-transparent" />
              </div>

              {/* Floating hearts cluster */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <span className="text-red-600/60 text-sm heartbeat">♥</span>
                <span className="text-red-500/80 text-base heartbeat" style={{ animationDelay: '0.4s' }}>♥</span>
                <span className="text-red-600/50 text-xs heartbeat" style={{ animationDelay: '0.8s' }}>♥</span>
              </div>
            </motion.div>

            {/* CENTER — Woman Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="relative z-10 flex-shrink-0"
              style={{ width: 'clamp(280px, 35vw, 500px)' }}
            >
              {/* Red glow behind image */}
              <div className="absolute inset-0 rounded-full blur-3xl opacity-40"
                style={{
                  background: 'radial-gradient(ellipse, rgba(220,38,38,0.5) 0%, transparent 70%)',
                  transform: 'scale(1.3)',
                }}
              />

              <img
                src="/home.png"
                alt="Urmi"
                className="relative z-10 w-full object-contain float-anim"
                style={{
                  maxHeight: '82vh',
                  objectPosition: 'center top',
                  filter: 'drop-shadow(0 0 30px rgba(220,38,38,0.4)) drop-shadow(0 20px 40px rgba(0,0,0,0.8))',
                }}
              />
            </motion.div>

            {/* RIGHT TEXT COLUMN */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="flex-1 flex flex-col items-start pl-6 lg:pl-10"
              style={{
                maxWidth: '340px',
                marginTop: '30%', /* align roughly with hip area */
              }}
            >
              <h1 className="script-title kingdom-text leading-none"
                style={{
                  fontSize: 'clamp(50px, 7vw, 110px)',
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                }}
              >
                Kingdom
              </h1>

              {/* Decorative lines under Kingdom */}
              <div className="mt-4 flex flex-col gap-1.5">
                <div className="h-px w-36 bg-gradient-to-r from-red-500 to-transparent" />
                <div className="h-px w-24 bg-gradient-to-r from-red-700/60 to-transparent" />
              </div>

              {/* Tagline */}
              <p className="mt-5 text-xs text-gray-500 tracking-[0.25em] uppercase">
                ✦ Exclusive &amp; Premium ✦
              </p>

              {/* Desktop Login Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                onClick={() => navigate('/login')}
                className="btn-login-sticky mt-8 relative rounded-full px-10 py-3 text-sm font-semibold tracking-widest uppercase text-white transition-all duration-300"
                style={{ letterSpacing: '0.15em' }}
              >
                Enter Now
              </motion.button>
            </motion.div>

          </div>
        </div>

        {/* Bottom ornamental bar */}
        <div className="flex items-center justify-center pb-8 px-12">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-900 to-transparent" />
          <span className="mx-4 text-red-800 text-xs">♦ ♦ ♦</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-900 to-transparent" />
        </div>

        {/* ── DESKTOP PACKAGE CARDS GRID ── */}
        {packages.length > 0 && (
          <div className="px-12 pb-16">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-800 to-red-500" />
              <div className="flex items-center gap-2">
                <span className="text-red-600 text-lg">♦</span>
                <span className="text-sm tracking-[0.4em] text-red-400 uppercase font-light">Premium Packages</span>
                <span className="text-red-600 text-lg">♦</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-red-800 to-red-500" />
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {packages.map((pkg) => (
                <PackageCard key={pkg._id || pkg.id} pkg={pkg} onSeeDemo={handleSeeDemo} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          MOBILE STICKY LOGIN BUTTON
          (only visible on mobile, md:hidden)
          ══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="md:hidden fixed bottom-0 inset-x-0 z-50 safe-bottom"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.98) 60%, transparent)',
          paddingTop: '24px',
          paddingBottom: '20px',
        }}
      >
        <div className="flex justify-center px-6">
          <button
            onClick={() => navigate('/login')}
            className="btn-login-sticky relative w-full max-w-xs rounded-full py-4 text-sm font-semibold tracking-widest uppercase text-white transition-all duration-300 active:scale-95"
            style={{ letterSpacing: '0.15em' }}
          >
            {/* Inner shine */}
            <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
            Enter Urmi's Kingdom
          </button>
        </div>
      </motion.div>

    </div>
  );
};

export default Landing;
