import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Video, Image, Phone, ArrowLeft, ShoppingCart, Crown } from 'lucide-react';
import { getMediaUrl } from '../utils/mediaUrl';

const categoryIcons = {
  calling: Phone,
  photo: Image,
  video: Video
};

const categoryTitles = {
  calling: 'কলিং প্যাকেজ',
  photo: 'প্রিমিয়াম ফটো প্যাকেজ',
  video: 'প্রিমিয়াম ভিডিও প্যাকেজ'
};

const Packages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data } = await axios.get('/api/packages');
      setPackages(data.packages);
    } catch (error) {
      toast.error('প্যাকেজ লোড করতে ব্যর্থ হয়েছে');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = selectedCategory === 'all'
    ? packages
    : packages.filter(pkg => pkg.category === selectedCategory);

  const categories = ['all', 'calling', 'photo', 'video'];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>হোম এ ফিরে যান</span>
          </button>

          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <Crown className="w-10 h-10 text-primary-500" />
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                প্রিমিয়াম প্যাকেজ
              </h1>
            </motion.div>
            <p className="text-gray-400 text-lg">
              আপনার পছন্দের প্যাকেজ বেছে নিন
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                }`}
              >
                {category === 'all' ? 'সব প্যাকেজ' : categoryTitles[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">কোনো প্যাকেজ পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg, index) => {
              const Icon = categoryIcons[pkg.category] || ShoppingCart;
              
              return (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card group hover:scale-105 cursor-pointer"
                  onClick={() => navigate(`/checkout/${pkg._id}`)}
                >
                  {/* Thumbnail */}
                  {pkg.thumbnail ? (
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                      <img
                        src={getMediaUrl(pkg.thumbnail)}
                        alt={pkg.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 mb-4 bg-dark-800 rounded-lg flex items-center justify-center">
                      <Icon className="w-20 h-20 text-primary-500/50" />
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-primary-500" />
                    <span className="text-sm font-semibold text-primary-400">
                      {categoryTitles[pkg.category]}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {pkg.titleBn || pkg.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {pkg.descriptionBn || pkg.description}
                  </p>

                  {/* Duration (for calling packages) */}
                  {pkg.duration && (
                    <p className="text-primary-400 text-sm font-semibold mb-3">
                      ⏱️ {pkg.duration}
                    </p>
                  )}

                  {/* Item Count */}
                  {pkg.itemCount > 0 && (
                    <p className="text-gray-400 text-sm mb-3">
                      📦 {pkg.itemCount} টি আইটেম
                    </p>
                  )}

                  {/* Features */}
                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {pkg.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-400 flex items-start">
                          <span className="text-primary-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-dark-800">
                    <div>
                      <p className="text-3xl font-bold gradient-text">
                        ৳{pkg.price}
                      </p>
                    </div>
                    <button className="btn-primary py-2 px-4 text-sm">
                      কিনুন
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
