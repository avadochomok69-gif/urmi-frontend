import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Copy, Check, User, Camera, Upload, X } from 'lucide-react';
import { getMediaUrl } from '../utils/mediaUrl';

const Checkout = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef(null);

  const [package_, setPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    whatsapp: '',
    transactionId: ''
  });

  const [bkashNumber, setBkashNumber] = useState('01XXXXXXXXX');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase a package');
      navigate('/login');
      return;
    }
    fetchPackage();
    fetchSettings();
  }, [packageId, isAuthenticated]);

  useEffect(() => {
    if (user?.name) setFormData(prev => ({ ...prev, name: prev.name || user.name }));
  }, [user]);

  const fetchPackage = async () => {
    try {
      const { data } = await axios.get(`/api/packages/${packageId}`);
      setPackage(data.package);
    } catch (error) {
      toast.error('Package not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('/api/settings?category=payment');
      setBkashNumber(data.settings.bkashNumber || '01XXXXXXXXX');
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshotSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Screenshot must be under 10MB');
      return;
    }
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setScreenshotPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.transactionId.trim()) {
      toast.error('Please enter Transaction ID');
      return;
    }
    if (!screenshotFile) {
      toast.error('Please upload payment screenshot');
      return;
    }

    setSubmitting(true);
    try {
      // Build multipart form
      const fd = new FormData();
      fd.append('packageId', package_._id || package_.id);
      fd.append('customerInfo', JSON.stringify({
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: user?.email || ''
      }));
      fd.append('paymentInfo', JSON.stringify({
        method: 'bkash',
        transactionId: formData.transactionId,
        amount: package_.price
      }));
      fd.append('paymentScreenshot', screenshotFile);

      const { data } = await axios.post('/api/orders', fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Order submitted successfully!');
      navigate(`/order-confirmation/${data.order._id || data.order.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit order');
    } finally {
      setSubmitting(false);
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
    <div className="min-h-screen bg-black py-8 px-4" style={{ color: '#fff' }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.6) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1"
            style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 0 20px rgba(220,38,38,0.4)' }}>
            Checkout
          </h1>
          <p className="text-gray-500 text-sm">Complete your purchase securely</p>
        </div>

        {/* Package Summary */}
        {package_ && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 rounded-2xl"
            style={{
              background: 'linear-gradient(145deg, #1a0505, #0d0d0d)',
              border: '1px solid rgba(220,38,38,0.3)'
            }}
          >
            <div className="flex items-center gap-4">
              {package_.thumbnail && (
                <img src={getMediaUrl(package_.thumbnail)} alt={package_.title}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  style={{ border: '1px solid rgba(220,38,38,0.3)' }} />
              )}
              <div className="flex-1">
                <p className="text-xs text-red-500 uppercase tracking-widest font-semibold mb-1">Selected Package</p>
                <h2 className="text-xl font-bold">{package_.title}</h2>
                <p className="text-3xl font-bold mt-1"
                  style={{
                    background: 'linear-gradient(90deg, #ef4444, #ff6b6b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                  ৳{package_.price}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl"
            style={{ background: 'linear-gradient(145deg, #1a0505, #0d0d0d)', border: '1px solid rgba(220,38,38,0.2)' }}
          >
            <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-red-400">
              <User className="w-5 h-5" />
              Your Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">WhatsApp Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="input"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>
          </motion.div>

          {/* Payment Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl"
            style={{ background: 'linear-gradient(145deg, #1a0505, #0d0d0d)', border: '1px solid rgba(220,38,38,0.2)' }}
          >
            <h3 className="font-bold text-base mb-4 text-red-400">💳 Payment Instructions</h3>

            {/* Step list */}
            <ol className="space-y-2 text-sm text-gray-300 mb-5">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-900 text-red-300 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                Open bKash → <strong className="text-white ml-1">Send Money</strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-900 text-red-300 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                Send <strong className="text-red-400 ml-1">৳{package_?.price}</strong> to the number below
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-900 text-red-300 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                Copy the Transaction ID and take a screenshot
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-red-900 text-red-300 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                Fill the form below and submit
              </li>
            </ol>

            {/* bKash number box */}
            <div className="rounded-xl p-4 mb-5"
              style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.4)' }}>
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">bKash Send Money Number</p>
              <div className="flex items-center justify-between gap-3">
                <span className="text-2xl font-bold text-white tracking-widest">{bkashNumber}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(bkashNumber)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: copied ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)',
                    border: copied ? '1px solid rgba(22,163,74,0.5)' : '1px solid rgba(220,38,38,0.5)',
                    color: copied ? '#4ade80' : '#f87171'
                  }}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Transaction ID */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Transaction ID *</label>
              <input
                type="text"
                value={formData.transactionId}
                onChange={e => setFormData({ ...formData, transactionId: e.target.value })}
                className="input"
                placeholder="e.g. 8N4A6RXXXXX"
                required
              />
              <p className="text-xs text-gray-600 mt-1">The transaction ID from your bKash confirmation SMS</p>
            </div>

            {/* Payment Screenshot Upload */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">
                Payment Screenshot *
              </label>
              {screenshotPreview ? (
                <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid rgba(220,38,38,0.4)' }}>
                  <img src={screenshotPreview} alt="Payment screenshot" className="w-full max-h-48 object-contain bg-black" />
                  <button
                    type="button"
                    onClick={() => { setScreenshotFile(null); setScreenshotPreview(null); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(220,38,38,0.8)' }}
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl py-8 flex flex-col items-center gap-2 transition-all hover:border-red-600"
                  style={{ border: '2px dashed rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.05)' }}
                >
                  <Upload className="w-8 h-8 text-red-700" />
                  <span className="text-sm text-gray-400">Click to upload screenshot</span>
                  <span className="text-xs text-gray-600">JPG, PNG, WEBP — max 10MB</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleScreenshotSelect}
                className="hidden"
              />
            </div>
          </motion.div>

          {/* Submit */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-full font-bold text-lg tracking-wider text-white transition-all active:scale-95 disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #dc2626, #991b1b)',
              boxShadow: '0 0 24px rgba(220,38,38,0.4), 0 0 48px rgba(220,38,38,0.15)'
            }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                Submitting...
              </span>
            ) : '🚀 Submit Payment'}
          </motion.button>

          {/* Note */}
          <div className="text-center px-4">
            <p className="text-xs text-gray-600">
              After submission, your payment will be verified by admin within 1–24 hours. 
              You'll get access once approved.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
