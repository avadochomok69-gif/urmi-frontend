import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Image as ImageIcon, Upload, X, Eye } from 'lucide-react';

const TAB_LIST = 'list';
const TAB_ADD = 'add';

const AdminPackages = () => {
  const navigate = useNavigate();
  const thumbnailRef = useRef(null);

  const [tab, setTab] = useState(TAB_LIST);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const emptyForm = {
    title: '',
    price: '',
    isActive: true,
    thumbnailFile: null,
    thumbnailPreview: null,
  };
  const [formData, setFormData] = useState(emptyForm);

  const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/admin/packages', { headers: authHeader });
      setPackages(data.packages || []);
    } catch (error) {
      toast.error('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData(prev => ({ ...prev, thumbnailFile: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setFormData(prev => ({ ...prev, thumbnailPreview: ev.target.result }));
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const startEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title || '',
      price: pkg.price || '',
      isActive: pkg.isActive !== false,
      thumbnailFile: null,
      thumbnailPreview: pkg.thumbnail || null
    });
    setTab(TAB_ADD);
  };

  const resetForm = () => {
    setEditingPackage(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error('Title is required'); return; }
    if (!formData.price || isNaN(Number(formData.price))) { toast.error('Valid price is required'); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title.trim());
      fd.append('titleBn', formData.title.trim());
      fd.append('description', formData.title.trim()); // minimal defaults
      fd.append('descriptionBn', formData.title.trim());
      fd.append('category', 'photo');
      fd.append('price', String(Number(formData.price)));
      fd.append('isActive', String(formData.isActive));
      if (formData.thumbnailFile) {
        fd.append('thumbnail', formData.thumbnailFile);
      }

      if (editingPackage) {
        await axios.put(`/api/admin/packages/${editingPackage._id || editingPackage.id}`, fd, {
          headers: { ...authHeader, 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Package updated!');
      } else {
        await axios.post('/api/admin/packages', fd, {
          headers: { ...authHeader, 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Package created!');
      }

      resetForm();
      setTab(TAB_LIST);
      fetchPackages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this package? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/admin/packages/${id}`, { headers: authHeader });
      toast.success('Package deleted');
      fetchPackages();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <AdminLayout>
      <div className="p-3 sm:p-6">
        {/* Page header */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-1">Packages</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Create and manage premium packages</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6"
          style={{ borderBottom: '1px solid rgba(220,38,38,0.2)', paddingBottom: '0' }}>
          <button
            onClick={() => { setTab(TAB_LIST); resetForm(); }}
            className="px-3 sm:px-5 py-2 sm:py-2.5 font-semibold text-xs sm:text-sm transition-all"
            style={{
              borderBottom: tab === TAB_LIST ? '2px solid #dc2626' : '2px solid transparent',
              color: tab === TAB_LIST ? '#f87171' : '#6b7280'
            }}
          >
            All ({packages.length})
          </button>
          <button
            onClick={() => { resetForm(); setTab(TAB_ADD); }}
            className="px-3 sm:px-5 py-2 sm:py-2.5 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2"
            style={{
              borderBottom: tab === TAB_ADD ? '2px solid #dc2626' : '2px solid transparent',
              color: tab === TAB_ADD ? '#f87171' : '#6b7280'
            }}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{editingPackage ? 'Edit Package' : 'Add Package'}</span>
            <span className="sm:hidden">{editingPackage ? 'Edit' : 'Add'}</span>
          </button>
        </div>

        {/* ── ADD / EDIT TAB ── */}
        {tab === TAB_ADD && (
          <div className="w-full lg:max-w-lg">
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl"
              style={{ background: 'linear-gradient(145deg, #1a0505, #0d0d0d)', border: '1px solid rgba(220,38,38,0.2)' }}>
              <h2 className="font-bold text-base sm:text-lg mb-4 sm:mb-5 gradient-text">
                {editingPackage ? '✏️ Edit Package' : '➕ Add New Package'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Featured Photo */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">
                    Featured Photo
                  </label>
                  {formData.thumbnailPreview ? (
                    <div className="relative rounded-xl overflow-hidden mb-2"
                      style={{ border: '1px solid rgba(220,38,38,0.4)', aspectRatio: '16/7' }}>
                      <img
                        src={formData.thumbnailPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, thumbnailFile: null, thumbnailPreview: null }))}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(220,38,38,0.8)' }}
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => thumbnailRef.current?.click()}
                      className="w-full rounded-xl py-6 flex flex-col items-center gap-2 transition-all"
                      style={{ border: '2px dashed rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.05)' }}
                    >
                      <ImageIcon className="w-8 h-8 text-red-800" />
                      <span className="text-sm text-gray-400">Upload featured photo</span>
                      <span className="text-xs text-gray-600">JPG, PNG, WEBP</span>
                    </button>
                  )}
                  <input
                    ref={thumbnailRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    className="hidden"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Package Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    placeholder="e.g. Premium Photo Bundle"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Price (৳) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="input"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className="relative w-10 h-6 rounded-full transition-all"
                    style={{ background: formData.isActive ? '#dc2626' : '#374151' }}
                  >
                    <span
                      className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow"
                      style={{ left: formData.isActive ? '1.25rem' : '0.25rem' }}
                    />
                  </button>
                  <span className="text-sm text-gray-300">
                    {formData.isActive ? 'Active (visible to users)' : 'Inactive (hidden)'}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-white transition-all disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}
                  >
                    {saving
                      ? <span className="flex items-center justify-center gap-2"><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" /> Saving...</span>
                      : editingPackage ? 'Update Package' : 'Create Package'
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => { resetForm(); setTab(TAB_LIST); }}
                    className="btn-secondary px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── LIST TAB ── */}
        {tab === TAB_LIST && (
          <>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600" />
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-16 rounded-2xl"
                style={{ background: 'linear-gradient(145deg, #1a0505, #0d0d0d)', border: '1px solid rgba(220,38,38,0.1)' }}>
                <ImageIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400">No packages yet. Create your first one!</p>
                <button
                  onClick={() => setTab(TAB_ADD)}
                  className="mt-4 btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Package
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {packages.map(pkg => (
                  <div
                    key={pkg._id || pkg.id}
                    className="rounded-xl sm:rounded-2xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(145deg, #1a0505, #0d0d0d)',
                      border: `1px solid ${pkg.isActive ? 'rgba(220,38,38,0.3)' : 'rgba(100,100,100,0.2)'}`
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="relative" style={{ aspectRatio: '16/7', background: '#0a0000' }}>
                      {pkg.thumbnail ? (
                        <img src={pkg.thumbnail} alt={pkg.title}
                          className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-900" />
                        </div>
                      )}
                      {/* Status badge */}
                      <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2">
                        <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full"
                          style={{
                            background: pkg.isActive ? 'rgba(22,163,74,0.85)' : 'rgba(100,100,100,0.85)',
                            color: '#fff'
                          }}>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4">
                      <h3 className="font-bold text-white text-sm sm:text-base mb-1 truncate">{pkg.title}</h3>
                      <p className="text-xl sm:text-2xl font-bold gradient-text mb-3 sm:mb-4">৳{pkg.price}</p>

                      {/* Actions */}
                      <div className="flex gap-1.5 sm:gap-2">
                        <button
                          onClick={() => navigate(`/admin/packages/${pkg._id || pkg.id}/media`)}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold transition-all"
                          style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)', color: '#f87171' }}
                        >
                          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">Manage Media</span>
                          <span className="sm:hidden">Media</span>
                        </button>
                        <button
                          onClick={() => startEdit(pkg)}
                          className="p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all hover:bg-blue-900/40"
                          style={{ border: '1px solid rgba(59,130,246,0.3)' }}
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg._id || pkg.id)}
                          className="p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all hover:bg-red-900/40"
                          style={{ border: '1px solid rgba(220,38,38,0.3)' }}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPackages;
