import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrder(data.order);
    } catch (error) {
      console.error('Failed to fetch order:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-dark-900 rounded-2xl border border-dark-800 p-8"
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-500/20 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-4 gradient-text">
          আপনার পেমেন্ট তথ্য সফলভাবে জমা হয়েছে!
        </h1>

        {/* Message */}
        <div className="bg-dark-800 rounded-lg p-6 mb-6 border border-primary-600/30">
          <p className="text-center text-lg text-gray-300 mb-4">
            অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন। আপনার পেমেন্ট যাচাই করার পর আমাদের পক্ষ থেকে আপনার সাথে যোগাযোগ করা হবে।
          </p>
          <p className="text-center text-sm text-gray-400">
            সাধারণত এই প্রক্রিয়ায় ১-২৪ ঘন্টা সময় লাগে
          </p>
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-dark-800 rounded-lg p-6 mb-6 space-y-3">
            <h2 className="font-bold text-lg mb-4 text-primary-400">অর্ডার বিবরণ:</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">অর্ডার আইডি</p>
                <p className="font-semibold text-white">{order._id.substring(0, 10)}...</p>
              </div>
              <div>
                <p className="text-gray-400">প্যাকেজ</p>
                <p className="font-semibold text-white">{order.package?.titleBn || order.package?.title}</p>
              </div>
              <div>
                <p className="text-gray-400">মূল্য</p>
                <p className="font-semibold text-primary-400">৳{order.paymentInfo.amount}</p>
              </div>
              <div>
                <p className="text-gray-400">পেমেন্ট মাধ্যম</p>
                <p className="font-semibold text-white">{order.paymentInfo.method.toUpperCase()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400">ট্রানজেকশন আইডি</p>
                <p className="font-semibold text-white">{order.paymentInfo.transactionId}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Info */}
        {order?.customerInfo.whatsapp || order?.customerInfo.telegram ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-200 text-center">
              পেমেন্ট যাচাই হলে আমরা আপনার{' '}
              {order.customerInfo.whatsapp && 'WhatsApp'}
              {order.customerInfo.whatsapp && order.customerInfo.telegram && ' অথবা '}
              {order.customerInfo.telegram && 'Telegram'}
              {' '}এ যোগাযোগ করব
            </p>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            <span>ড্যাশবোর্ডে যান</span>
          </button>
          <button
            onClick={() => navigate('/packages')}
            className="flex-1 btn-secondary flex items-center justify-center gap-2"
          >
            <span>আরও প্যাকেজ দেখুন</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;
