import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Package, ArrowRight, Sparkles, FolderOpen, ArrowLeft } from 'lucide-react';
import { getMediaUrl } from '../utils/mediaUrl';

const MyPackages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPackages();
  }, []);

  const fetchMyPackages = async () => {
    try {
      const { data } = await axios.get('/api/orders/my-packages/list');
      setPackages(data.packages || []);
    } catch (error) {
      toast.error('Failed to load your packages');
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

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 md:py-12">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 bg-red-600" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent">
                My Purchased Packages
              </span>
              <Sparkles className="w-7 h-7 text-red-500" />
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              আপনার অনুমোদিত প্যাকেজগুলোর সমস্ত এক্সক্লুসিভ ফটো ও ভিডিও নিচে প্রদর্শিত হচ্ছে
            </p>
          </div>
        </div>

        {/* Package Grid */}
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, idx) => (
              <motion.div
                key={pkg.id || pkg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => navigate(`/package-demo/${pkg.id || pkg._id}`)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-b from-[#1a0505] to-[#0d0d0d] border border-red-900/40 hover:border-red-600/80 shadow-lg shadow-black/80 hover:shadow-red-900/20 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-48 bg-black/60 flex items-center justify-center overflow-hidden">
                  {pkg.thumbnail ? (
                    <img
                      src={getMediaUrl(pkg.thumbnail)}
                      alt={pkg.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <FolderOpen className="w-16 h-16 text-red-800" />
                  )}
                  <div className="absolute top-3 left-3 bg-green-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    ✓ Unlocked & Active
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-100 group-hover:text-red-400 transition-colors line-clamp-1">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {pkg.description || 'Access all premium photos and videos inside.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-red-950/50 flex items-center justify-between">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      Paid: ৳{pkg.price}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400 group-hover:translate-x-1 transition-transform">
                      <span>View Content</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 bg-gradient-to-b from-[#150303] to-[#0a0000] rounded-2xl border border-red-950/60 max-w-xl mx-auto">
            <Package className="w-16 h-16 text-red-800 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-200 mb-2">কোনো কেনা প্যাকেজ পাওয়া যায়নি</h3>
            <p className="text-gray-400 text-sm mb-6">
              আপনি এখনো কোনো প্যাকেজ ক্রয় করেননি অথবা আপনার পেমেন্ট অ্যাডমিন রিভিউতে আছে। অ্যাডমিন অনুমোদন করার সাথে সাথে এখানে দেখা যাবে।
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 shadow-md shadow-red-900/40"
            >
              <span>Explore Packages</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPackages;
