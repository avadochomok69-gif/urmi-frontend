import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Lock, Crown, Eye, Play } from 'lucide-react';

/* ─────────────────────────────────────────────
   Media Item Component
───────────────────────────────────────────── */
const MediaItem = ({ item, index }) => {
  const isLocked = item.locked || (item.media_type === 'exclusive' && !item.file_url);
  const isVideo = item.file_type === 'video';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="relative overflow-hidden rounded-xl"
      style={{
        background: 'linear-gradient(145deg, #1a0505, #0d0d0d)',
        border: isLocked ? '1px solid rgba(220,38,38,0.2)' : '1px solid rgba(220,38,38,0.35)',
        boxShadow: isLocked ? 'none' : '0 4px 20px rgba(220,38,38,0.1)'
      }}
    >
      {/* Media Content */}
      <div className="relative" style={{ aspectRatio: '4/3' }}>
        {isLocked ? (
          /* Locked / Blurred Exclusive Content */
          <div className="w-full h-full relative">
            {/* Blurred placeholder */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #2d0000, #1a0000, #0d0d0d)',
                filter: 'blur(0px)'
              }}
            >
              {/* Blurred icon suggestion */}
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #dc2626 0, #dc2626 1px, transparent 0, transparent 50%)', backgroundSize: '8px 8px' }} />
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.6)' }}>
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl opacity-50"
                  style={{ background: 'rgba(220,38,38,0.4)', transform: 'scale(1.5)' }} />
                <div className="relative bg-gradient-to-br from-red-600 to-red-900 rounded-full p-3 shadow-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-red-400">Exclusive</span>
            </div>
          </div>
        ) : isVideo ? (
          /* Video Player */
          <video
            src={item.file_url}
            controls
            className="w-full h-full object-cover"
            style={{ background: '#000' }}
            poster=""
          >
            Your browser does not support video.
          </video>
        ) : (
          /* Photo */
          <img
            src={item.file_url}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {/* Demo badge */}
        {!isLocked && item.media_type === 'demo' && (
          <div className="absolute top-2 left-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(22,163,74,0.85)', color: '#fff' }}>
              {isVideo ? '▶ Demo' : '📷 Demo'}
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="px-3 py-2">
        <p className={`text-sm font-medium ${isLocked ? 'text-gray-600' : 'text-gray-200'}`}>
          {item.title || (isLocked ? 'Exclusive Content' : 'Untitled')}
        </p>
        {isLocked && (
          <p className="text-xs text-red-700 mt-0.5">🔒 Purchase to unlock</p>
        )}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Main PackageDemo Page
───────────────────────────────────────────── */
const PackageDemo = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, [packageId]);

  const fetchData = async () => {
    try {
      const [pkgRes, mediaRes] = await Promise.all([
        axios.get(`/api/packages/${packageId}`),
        axios.get(`/api/packages/${packageId}/media`, {
          headers: localStorage.getItem('token')
            ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
            : {}
        })
      ]);
      setPkg(pkgRes.data.package);
      setMedia(mediaRes.data.media || []);
      setHasAccess(mediaRes.data.hasAccess || false);
    } catch (error) {
      toast.error('Failed to load package content');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600" />
      </div>
    );
  }

  const demoMedia = media.filter(m => m.media_type === 'demo');
  const exclusiveMedia = media.filter(m => m.media_type === 'exclusive');
  const totalExclusive = exclusiveMedia.length;

  return (
    <div className="min-h-screen bg-black" style={{ color: '#fff' }}>
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.6) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>

        {/* Package Header */}
        {pkg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(145deg, #1a0505, #0d0d0d)',
              border: '1px solid rgba(220,38,38,0.3)',
              boxShadow: '0 8px 32px rgba(220,38,38,0.1)'
            }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Package thumbnail */}
              {pkg.thumbnail && (
                <img
                  src={pkg.thumbnail}
                  alt={pkg.title}
                  className="w-full md:w-40 h-40 object-cover rounded-xl flex-shrink-0"
                  style={{ border: '1px solid rgba(220,38,38,0.3)' }}
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-red-500" />
                  <span className="text-xs tracking-widest uppercase text-red-500 font-semibold">Premium Package</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    textShadow: '0 0 20px rgba(220,38,38,0.4)'
                  }}>
                  {pkg.title}
                </h1>
                {pkg.description && (
                  <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                )}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Package Price</span>
                    <span className="text-3xl font-bold"
                      style={{
                        background: 'linear-gradient(90deg, #ef4444, #ff6b6b)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                      ৳{pkg.price}
                    </span>
                  </div>

                  {!hasAccess && (
                    <button
                      onClick={() => navigate(`/checkout/${packageId}`)}
                      className="relative overflow-hidden rounded-full px-8 py-3 font-bold tracking-wider text-white active:scale-95 transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                        boxShadow: '0 0 20px rgba(220,38,38,0.5), 0 0 40px rgba(220,38,38,0.2)'
                      }}
                    >
                      🛒 Buy This Package
                    </button>
                  )}

                  {hasAccess && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{ background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.5)' }}>
                      <span className="text-green-400 font-bold text-sm">✓ Access Granted</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Media Stats */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="px-4 py-2 rounded-full text-sm"
            style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)', color: '#4ade80' }}>
            👁️ {demoMedia.length} Free Demo
          </div>
          <div className="px-4 py-2 rounded-full text-sm"
            style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171' }}>
            🔒 {totalExclusive} Exclusive
          </div>
        </div>

        {/* Demo Section */}
        {demoMedia.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-bold text-green-400">Free Demo Content</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-green-800/50 to-transparent" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {demoMedia.map((item, idx) => (
                <MediaItem key={item.id} item={item} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Exclusive Section */}
        {exclusiveMedia.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-red-400">
                {hasAccess ? 'Exclusive Content (Unlocked)' : 'Exclusive Content (Locked)'}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-red-800/50 to-transparent" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {exclusiveMedia.map((item, idx) => (
                <MediaItem key={item.id} item={item} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {media.length === 0 && (
          <div className="text-center py-16">
            <Crown className="w-12 h-12 text-red-800 mx-auto mb-4" />
            <p className="text-gray-500">No content available for this package yet.</p>
          </div>
        )}

        {/* CTA at bottom */}
        {!hasAccess && pkg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 rounded-2xl text-center"
            style={{
              background: 'linear-gradient(145deg, #1a0505, #0d0d0d)',
              border: '1px solid rgba(220,38,38,0.3)',
              boxShadow: '0 0 40px rgba(220,38,38,0.08)'
            }}
          >
            <Lock className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Unlock All Exclusive Content
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Purchase this package to get full access to {totalExclusive} exclusive item{totalExclusive !== 1 ? 's' : ''}.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <span className="text-3xl font-bold"
                style={{
                  background: 'linear-gradient(90deg, #ef4444, #ff6b6b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                ৳{pkg.price}
              </span>
              <button
                onClick={() => navigate(`/checkout/${packageId}`)}
                className="relative rounded-full px-10 py-3 font-bold tracking-wider text-white active:scale-95 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                  boxShadow: '0 0 20px rgba(220,38,38,0.5), 0 0 40px rgba(220,38,38,0.2)'
                }}
              >
                🛒 Buy This Package
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PackageDemo;

