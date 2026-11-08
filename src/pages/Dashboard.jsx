import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle, XCircle, LogOut, Image as ImageIcon } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrders(data.orders);
    } catch (error) {
      toast.error('অর্ডার লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'যাচাইকরণ চলছে';
      case 'approved':
        return 'অনুমোদিত';
      case 'rejected':
        return 'প্রত্যাখ্যাত';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-900 rounded-2xl border border-dark-800 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                স্বাগতম, {user?.name}!
              </h1>
              <p className="text-gray-400">আপনার ড্যাশবোর্ডে আপনাকে স্বাগতম</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/my-content')}
                className="btn-primary flex items-center gap-2"
              >
                <ImageIcon className="w-5 h-5" />
                <span>আমার কন্টেন্ট</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn-secondary flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/packages')}
            className="card hover:scale-105 transition-transform text-left"
          >
            <Package className="w-10 h-10 text-primary-500 mb-3" />
            <h3 className="text-xl font-bold mb-2">নতুন প্যাকেজ কিনুন</h3>
            <p className="text-gray-400">আরও প্রিমিয়াম কন্টেন্ট দেখুন</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/my-content')}
            className="card hover:scale-105 transition-transform text-left"
          >
            <ImageIcon className="w-10 h-10 text-primary-500 mb-3" />
            <h3 className="text-xl font-bold mb-2">আমার কন্টেন্ট</h3>
            <p className="text-gray-400">কেনা কন্টেন্ট দেখুন</p>
          </motion.button>
        </div>

        {/* Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-900 rounded-2xl border border-dark-800 p-6"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-primary-500" />
            আমার অর্ডার সমূহ
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">এখনো কোনো অর্ডার নেই</p>
              <button
                onClick={() => navigate('/packages')}
                className="btn-primary"
              >
                প্যাকেজ দেখুন
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="card hover:border-primary-600 transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold">
                          {order.package?.titleBn || order.package?.title}
                        </h3>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="text-sm font-semibold">
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3">
                        {order.package?.descriptionBn || order.package?.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span>
                          <strong className="text-white">পেমেন্ট:</strong> {order.paymentInfo.method.toUpperCase()}
                        </span>
                        <span>
                          <strong className="text-white">ট্রানজেকশন ID:</strong> {order.paymentInfo.transactionId}
                        </span>
                        <span>
                          <strong className="text-white">তারিখ:</strong>{' '}
                          {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <p className="text-2xl font-bold gradient-text">
                        ৳{order.paymentInfo.amount}
                      </p>
                      {order.status === 'approved' && order.package?.category !== 'calling' && (
                        <button
                          onClick={() => navigate('/my-content')}
                          className="btn-primary mt-3"
                        >
                          কন্টেন্ট দেখুন
                        </button>
                      )}
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t border-dark-800">
                      <p className="text-sm text-yellow-400">
                        ⏳ আপনার পেমেন্ট যাচাই করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।
                      </p>
                    </div>
                  )}

                  {order.status === 'rejected' && order.adminNotes && (
                    <div className="mt-4 pt-4 border-t border-dark-800">
                      <p className="text-sm text-red-400">
                        <strong>কারণ:</strong> {order.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
