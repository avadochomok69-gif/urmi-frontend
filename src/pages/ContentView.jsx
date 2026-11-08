import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Download, Eye } from 'lucide-react';

const ContentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [id]);

  const fetchContent = async () => {
    try {
      const { data } = await axios.get(`/api/content/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setContent(data.content);
    } catch (error) {
      toast.error(error.response?.data?.message || 'কন্টেন্ট লোড করতে ব্যর্থ হয়েছে');
      navigate('/my-content');
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

  if (!content) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/my-content')}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>ফিরে যান</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-900 rounded-2xl border border-dark-800 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {content.titleBn || content.title}
            </h1>
            {content.description && (
              <p className="text-primary-100">
                {content.descriptionBn || content.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-4 text-primary-100 text-sm">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {content.views} ভিউ
              </span>
              <span>
                {content.files?.length || 0} টি {content.type === 'video' ? 'ভিডিও' : 'ফটো'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.files?.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="card group"
                >
                  {content.type === 'video' ? (
                    <video
                      controls
                      className="w-full rounded-lg mb-4"
                      poster={file.thumbnail}
                    >
                      <source src={file.url} type={file.mimeType} />
                      আপনার ব্রাউজার ভিডিও সাপোর্ট করে না
                    </video>
                  ) : (
                    <div className="relative">
                      <img
                        src={file.url}
                        alt={`${content.title} - ${index + 1}`}
                        className="w-full rounded-lg mb-4 cursor-pointer group-hover:scale-105 transition-transform"
                        onClick={() => window.open(file.url, '_blank')}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      ফাইল #{index + 1}
                    </span>
                    <a
                      href={file.url}
                      download
                      className="flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      ডাউনলোড
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {(!content.files || content.files.length === 0) && (
              <div className="text-center py-12">
                <p className="text-gray-400">কোনো ফাইল পাওয়া যায়নি</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContentView;
