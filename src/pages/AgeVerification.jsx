import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AgeVerification = () => {
  const { verifyAge } = useAuth();
  const [accepted, setAccepted] = useState(false);

  const handleVerify = () => {
    if (accepted) {
      verifyAge(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-dark-900 rounded-2xl border border-primary-600 p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary-600/20 rounded-full">
            <AlertTriangle className="w-12 h-12 text-primary-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-4 gradient-text">
          ১৮+ বয়স যাচাইকরণ
        </h1>

        <p className="text-center text-gray-300 mb-6">
          এই ওয়েবসাইটে প্রবেশ করতে আপনার বয়স অবশ্যই ১৮ বছর বা তার বেশি হতে হবে।
        </p>

        <div className="bg-dark-800 rounded-lg p-6 mb-6 border border-dark-700">
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <span>এই ওয়েবসাইটে শুধুমাত্র প্রাপ্তবয়স্ক কন্টেন্ট রয়েছে</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <span>১৮ বছরের কম বয়সীদের জন্য নিষিদ্ধ</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <span>প্রবেশ করে আপনি নিশ্চিত করছেন যে আপনি আইনত প্রাপ্তবয়স্ক</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="age-confirm"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-5 h-5 text-primary-600 bg-dark-800 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
          />
          <label htmlFor="age-confirm" className="ml-3 text-sm text-gray-300">
            আমি নিশ্চিত করছি যে আমার বয়স ১৮ বছর বা তার বেশি এবং আমি শর্তাবলীতে সম্মত
          </label>
        </div>

        <button
          onClick={handleVerify}
          disabled={!accepted}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            accepted
              ? 'btn-primary'
              : 'bg-dark-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          প্রবেশ করুন
        </button>

        <p className="text-center text-xs text-gray-500 mt-6">
          এই ওয়েবসাইট ব্যবহার করে, আপনি আমাদের শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত হচ্ছেন
        </p>
      </motion.div>
    </div>
  );
};

export default AgeVerification;
