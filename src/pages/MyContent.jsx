import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Image as ImageIcon, Video, Eye, Package } from 'lucide-react';

const MyContent = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data } = await axios.get('/api/content/my-content', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setContent(data.content);
    } catch (error) {
      toast.error('কন্টেন্ট লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

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
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>ড্যাশবোর্ডে ফিরে যান</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">
            আমার প্রিমিয়াম কন্টেন্ট
          </h1>
          <p className="text-gray-400">আপনার কেনা এক্সক্লুসিভ কন্টেন্ট</p>
        </motion.div>

        {content.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-4">
              এখনো কোনো কন্টেন্ট নেই
            </h2>
            <p className="text-gray-500 mb-6">
              প্যাকেজ কিনে প্রিমিয়াম কন্টেন্ট আনলক করুন
            </p>
            <button
              onClick={() => navigate('/packages')}
              className="btn-primary"
            >
              প্যাকেজ দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item, index) => {
              const Icon = item.content.type === 'video' ? Video : ImageIcon;
              
              return (
                <motion.div
                  key={item.content._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/content/${item.content._id}`)}
                  className="card group hover:scale-105 cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative h-56 mb-4 rounded-lg overflow-hidden bg-dark-800">
                    {item.content.thumbnail ? (
                      <img
                        src={item.content.thumbnail}
                        alt={item.content.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="w-16 h-16 text-primary-500/50" />
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-primary-600 rounded-full flex items-center gap-1">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-semibold">
                        {item.content.type === 'video' ? 'ভিডিও' : 'ফটো'}
                      </span>
                    </div>

                    {/* View Count */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-dark-900/80 backdrop-blur-sm rounded-full flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span className="text-xs">{item.content.views}</span>
                    </div>
                  </div>

                  {/* Content Info */}
                  <h3 className="text-lg font-bold mb-2">
                    {item.content.titleBn || item.content.title}
                  </h3>

                  {item.content.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {item.content.descriptionBn || item.content.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-dark-800">
                    <span className="text-xs text-gray-500">
                      {item.content.files?.length || 0} টি ফাইল
                    </span>
                    <button className="btn-primary py-1 px-4 text-sm">
                      দেখুন
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

export default MyContent;
