import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { Save, DollarSign } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    bkashNumber: '',
    nagadNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('/api/settings?category=payment');
      setSettings(data.settings);
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.post('/api/settings/bulk', 
        { settings },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-3 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-1 sm:mb-2">Settings</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Configure platform settings</p>
        </div>

        <div className="w-full lg:max-w-2xl">
          <form onSubmit={handleSubmit} className="bg-dark-900 rounded-lg sm:rounded-xl border border-dark-800 p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
                Payment Settings
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    bKash Number
                  </label>
                  <input
                    type="text"
                    value={settings.bkashNumber || ''}
                    onChange={(e) => setSettings({...settings, bkashNumber: e.target.value})}
                    className="input text-sm sm:text-base"
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    Nagad Number
                  </label>
                  <input
                    type="text"
                    value={settings.nagadNumber || ''}
                    onChange={(e) => setSettings({...settings, nagadNumber: e.target.value})}
                    className="input text-sm sm:text-base"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 sm:py-3 text-sm sm:text-base"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
