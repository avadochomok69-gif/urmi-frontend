import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { Check, X, Clock, Eye, Shield, Image } from 'lucide-react';

const statusColors = {
  pending: { bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.4)', text: '#fbbf24' },
  approved: { bg: 'rgba(22,163,74,0.15)', border: 'rgba(22,163,74,0.4)', text: '#4ade80' },
  rejected: { bg: 'rgba(220,38,38,0.15)', border: 'rgba(220,38,38,0.4)', text: '#f87171' }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [screenshotModal, setScreenshotModal] = useState(null); // URL string

  const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/api/admin/orders' : `/api/admin/orders?status=${filter}`;
      const { data } = await axios.get(url, { headers: authHeader });
      setOrders(data.orders || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAccess = async (orderId) => {
    try {
      await axios.patch(`/api/admin/orders/${orderId}/grant-access`, {}, { headers: authHeader });
      toast.success('✅ Access granted!');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to grant access');
    }
  };

  const handleReject = async (orderId) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return; // cancelled
    try {
      await axios.patch(
        `/api/admin/orders/${orderId}/reject`,
        { adminNotes: reason || null },
        { headers: authHeader }
      );
      toast.success('Order rejected');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to reject order');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">Orders</h1>
          <p className="text-gray-400 text-xs md:text-sm">Review payments and grant access to customers</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 md:mb-6 flex-wrap">
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all"
              style={{
                background: filter === status ? '#dc2626' : 'rgba(220,38,38,0.1)',
                border: filter === status ? '1px solid #dc2626' : '1px solid rgba(220,38,38,0.2)',
                color: filter === status ? '#fff' : '#9ca3af'
              }}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="text-center py-12 md:py-16 rounded-2xl"
            style={{ background: 'linear-gradient(145deg, #1a0505, #0d0d0d)', border: '1px solid rgba(220,38,38,0.1)' }}>
            <Clock className="w-8 h-8 md:w-10 md:h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-sm md:text-base text-gray-400">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {orders.map((order, idx) => {
              const sc = statusColors[order.status] || statusColors.pending;
              const rawScreenshot = order.paymentInfo?.screenshotUrl || order.payment_info?.screenshotUrl;
              const screenshotUrl = rawScreenshot 
                ? (rawScreenshot.startsWith('http') ? rawScreenshot : rawScreenshot)
                : null;

              return (
                <motion.div
                  key={order._id || order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="rounded-xl md:rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #1a0505, #0d0d0d)',
                    border: '1px solid rgba(220,38,38,0.2)'
                  }}
                >
                  {/* Order header */}
                  <div className="flex items-center justify-between px-3 md:px-5 py-2 md:py-3"
                    style={{ borderBottom: '1px solid rgba(220,38,38,0.1)', background: 'rgba(220,38,38,0.05)' }}>
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                      <span className="text-xs font-mono text-gray-500">
                        #{(order._id || order.id || '').slice(-8).toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt || order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span
                      className="text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full whitespace-nowrap"
                      style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}
                    >
                      {order.status?.toUpperCase()}
                    </span>
                  </div>

                  {/* Order body */}
                  <div className="p-3 md:p-5">
                    <div className="flex flex-col gap-4 md:gap-5">
                      {/* Package info */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Package</p>
                        <p className="text-sm md:text-base text-white font-bold">{order.package?.title || order.package?.titleBn || 'N/A'}</p>
                      </div>

                      {/* Customer + Payment grid */}
                      <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Customer</p>
                          <p className="text-white font-semibold text-sm">{order.customerInfo?.name || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Amount</p>
                          <p className="text-red-400 font-bold text-base md:text-lg">৳{order.paymentInfo?.amount || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Method</p>
                          <p className="text-white font-semibold text-sm">{(order.paymentInfo?.method || '').toUpperCase() || 'bKash'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Transaction</p>
                          <p className="font-mono text-yellow-400 text-xs break-all">{order.paymentInfo?.transactionId || '—'}</p>
                        </div>
                      </div>

                      {/* Contact info */}
                      {order.customerInfo?.whatsapp && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">WhatsApp</p>
                          <p className="text-gray-300 text-sm">{order.customerInfo.whatsapp}</p>
                        </div>
                      )}

                      {/* Admin notes if rejected */}
                      {order.status === 'rejected' && order.adminNotes && (
                        <div className="p-3 rounded-lg"
                          style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)' }}>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Rejection Reason</p>
                          <p className="text-red-300 text-sm">{order.adminNotes}</p>
                        </div>
                      )}

                      {/* Payment Screenshot */}
                      {screenshotUrl ? (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Payment Screenshot</p>
                          <button
                            onClick={() => setScreenshotModal(screenshotUrl)}
                            className="w-full rounded-xl overflow-hidden relative group max-w-sm"
                            style={{ border: '1px solid rgba(220,38,38,0.4)', aspectRatio: '4/3' }}
                          >
                            <img
                              src={screenshotUrl}
                              alt="Payment screenshot"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ background: 'rgba(0,0,0,0.6)' }}>
                              <Eye className="w-6 h-6 text-white" />
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="rounded-xl flex items-center justify-center max-w-sm"
                          style={{ border: '1px dashed rgba(100,100,100,0.3)', aspectRatio: '4/3' }}>
                          <div className="text-center">
                            <Image className="w-8 h-8 text-gray-700 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">No screenshot</p>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      {order.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                          <button
                            onClick={() => handleGrantAccess(order._id || order.id)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                          >
                            <Shield className="w-4 h-4" />
                            Grant Access
                          </button>
                          <button
                            onClick={() => handleReject(order._id || order.id)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 rounded-xl font-semibold text-sm transition-all hover:bg-red-900/40"
                            style={{ border: '1px solid rgba(220,38,38,0.4)', color: '#f87171' }}
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}

                      {order.status === 'approved' && (
                        <div className="flex items-center justify-center gap-2 py-2 md:py-3 rounded-xl"
                          style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)' }}>
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-xs md:text-sm text-green-400 font-bold">Access Granted</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Screenshot Modal */}
      {screenshotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.9)' }}
          onClick={() => setScreenshotModal(null)}
        >
          <div className="relative max-w-2xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setScreenshotModal(null)}
              className="absolute -top-10 right-0 text-gray-400 hover:text-white text-sm"
            >
              ✕ Close
            </button>
            <img
              src={screenshotModal}
              alt="Payment screenshot"
              className="w-full max-h-[85vh] object-contain rounded-xl"
              style={{ border: '1px solid rgba(220,38,38,0.4)' }}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
