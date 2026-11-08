import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { ArrowLeft, Upload, Trash2, Edit2, Check, X, Lock, Eye, Image, Video } from 'lucide-react';

const MediaCard = ({ item, onDelete, onToggleType, onRename }) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);
  const isLocked = item.media_type === 'exclusive';
  const isVideo = item.file_type === 'video';

  const saveTitle = () => {
    if (newTitle.trim() !== item.title) {
      onRename(item.id, newTitle.trim());
    }
    setEditing(false);
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #1a0505, #0d0d0d)',
        border: `1px solid ${isLocked ? 'rgba(220,38,38,0.4)' : 'rgba(22,163,74,0.3)'}`
      }}
    >
      {/* Media Preview */}
      <div className="relative" style={{ aspectRatio: '4/3', background: '#000' }}>
        {isVideo ? (
          <video src={item.file_url} className="w-full h-full object-cover" />
        ) : (
          <img src={item.file_url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
        )}
        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{
              background: isLocked ? 'rgba(220,38,38,0.85)' : 'rgba(22,163,74,0.85)',
              color: '#fff'
            }}
          >
            {isLocked ? <Lock className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {isLocked ? 'Exclusive' : 'Demo'}
          </span>
        </div>
        {/* File type badge */}
        <div className="absolute top-2 right-2">
          <span className="text-xs px-2 py-0.5 rounded-full text-gray-300"
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            {isVideo ? '🎬' : '📷'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 space-y-2">
        {/* Title edit */}
        {editing ? (
          <div className="flex gap-1">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="flex-1 text-xs bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white"
              onKeyDown={e => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditing(false); }}
              autoFocus
            />
            <button onClick={saveTitle} className="p-1 rounded bg-green-800 hover:bg-green-700">
              <Check className="w-3 h-3 text-white" />
            </button>
            <button onClick={() => { setEditing(false); setNewTitle(item.title); }} className="p-1 rounded bg-gray-800 hover:bg-gray-700">
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <p className="text-xs text-gray-300 flex-1 truncate">{item.title}</p>
            <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-gray-800">
              <Edit2 className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-1">
          <button
            onClick={() => onToggleType(item.id, item.media_type === 'exclusive' ? 'demo' : 'exclusive')}
            className="flex-1 text-xs py-1 rounded-lg font-semibold transition-all"
            style={{
              background: isLocked ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)',
              border: isLocked ? '1px solid rgba(22,163,74,0.4)' : '1px solid rgba(220,38,38,0.4)',
              color: isLocked ? '#4ade80' : '#f87171'
            }}
          >
            {isLocked ? '→ Make Demo' : '→ Make Exclusive'}
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 rounded-lg transition-all hover:bg-red-900/40"
            style={{ border: '1px solid rgba(220,38,38,0.3)' }}
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPackageMedia = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [pkg, setPkg] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [uploadQueue, setUploadQueue] = useState([]); // { file, title, mediaType }
  const [defaultMediaType, setDefaultMediaType] = useState('demo');

  const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    fetchData();
  }, [packageId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pkgRes, mediaRes] = await Promise.all([
        axios.get(`/api/admin/packages`, { headers: authHeader }),
        axios.get(`/api/admin/packages/${packageId}/media`, { headers: authHeader })
      ]);
      const foundPkg = (pkgRes.data.packages || []).find(p => p._id === packageId || p.id === packageId);
      setPkg(foundPkg);
      setMedia(mediaRes.data.media || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const newItems = files.map(file => ({
      id: `${Date.now()}-${file.name}`,
      file,
      title: file.name.replace(/\.[^.]+$/, ''),
      mediaType: defaultMediaType,
      preview: URL.createObjectURL(file),
      isVideo: file.type.startsWith('video/')
    }));
    setUploadQueue(prev => [...prev, ...newItems]);
    e.target.value = '';
  };

  const removeFromQueue = (id) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  };

  const updateQueueItem = (id, field, value) => {
    setUploadQueue(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleUpload = async () => {
    if (uploadQueue.length === 0) {
      toast.error('No files selected');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      uploadQueue.forEach(item => fd.append('files', item.file));
      fd.append('titles', JSON.stringify(uploadQueue.map(item => item.title)));
      // For simplicity, use the first item's mediaType for all (or upload in batches by type)
      // We'll handle per-item type after upload via patch
      fd.append('mediaType', 'demo'); // default, we'll patch individually

      const { data } = await axios.post(`/api/admin/packages/${packageId}/media`, fd, {
        headers: { ...authHeader, 'Content-Type': 'multipart/form-data' }
      });

      // Patch mediaType individually for items that differ from 'demo'
      const uploadedMedia = data.media || [];
      await Promise.all(
        uploadedMedia.map(async (mediaItem, idx) => {
          const queueItem = uploadQueue[idx];
          if (queueItem && queueItem.mediaType !== 'demo') {
            await axios.patch(
              `/api/admin/packages/${packageId}/media/${mediaItem.id}`,
              { mediaType: queueItem.mediaType },
              { headers: authHeader }
            );
          }
        })
      );

      toast.success(`${uploadQueue.length} file(s) uploaded!`);
      setUploadQueue([]);
      fetchData();
    } catch (error) {
      toast.error('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (mediaId) => {
    if (!confirm('Delete this media item?')) return;
    try {
      await axios.delete(`/api/admin/packages/${packageId}/media/${mediaId}`, { headers: authHeader });
      toast.success('Deleted');
      setMedia(prev => prev.filter(m => m.id !== mediaId));
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleToggleType = async (mediaId, newType) => {
    try {
      await axios.patch(
        `/api/admin/packages/${packageId}/media/${mediaId}`,
        { mediaType: newType },
        { headers: authHeader }
      );
      setMedia(prev => prev.map(m => m.id === mediaId ? { ...m, media_type: newType } : m));
      toast.success(`Marked as ${newType}`);
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleRename = async (mediaId, newTitle) => {
    try {
      await axios.patch(
        `/api/admin/packages/${packageId}/media/${mediaId}`,
        { title: newTitle },
        { headers: authHeader }
      );
      setMedia(prev => prev.map(m => m.id === mediaId ? { ...m, title: newTitle } : m));
      toast.success('Renamed');
    } catch (error) {
      toast.error('Failed to rename');
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

  const demoCount = media.filter(m => m.media_type === 'demo').length;
  const exclusiveCount = media.filter(m => m.media_type === 'exclusive').length;

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/packages')}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all mt-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Media Management</p>
            <h1 className="text-2xl font-bold gradient-text">{pkg?.title || 'Package'}</h1>
            <div className="flex gap-3 mt-2">
              <span className="text-xs px-2 py-1 rounded-full text-green-400"
                style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)' }}>
                👁️ {demoCount} Demo
              </span>
              <span className="text-xs px-2 py-1 rounded-full text-red-400"
                style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)' }}>
                🔒 {exclusiveCount} Exclusive
              </span>
            </div>
          </div>
          <span className="text-2xl font-bold gradient-text">৳{pkg?.price}</span>
        </div>

        {/* Upload Section */}
        <div className="mb-8 p-5 rounded-2xl"
          style={{ background: 'linear-gradient(145deg, #1a0505, #0d0d0d)', border: '1px solid rgba(220,38,38,0.2)' }}>
          <h2 className="font-bold text-base text-red-400 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Media
          </h2>

          {/* Default type selector */}
          <div className="flex gap-3 mb-4">
            <label className="text-xs text-gray-400 self-center">Default type:</label>
            <button
              type="button"
              onClick={() => setDefaultMediaType('demo')}
              className="px-3 py-1 rounded-full text-xs font-bold transition-all"
              style={{
                background: defaultMediaType === 'demo' ? 'rgba(22,163,74,0.3)' : 'rgba(22,163,74,0.08)',
                border: '1px solid rgba(22,163,74,0.4)',
                color: '#4ade80'
              }}
            >
              👁️ Demo
            </button>
            <button
              type="button"
              onClick={() => setDefaultMediaType('exclusive')}
              className="px-3 py-1 rounded-full text-xs font-bold transition-all"
              style={{
                background: defaultMediaType === 'exclusive' ? 'rgba(220,38,38,0.3)' : 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.4)',
                color: '#f87171'
              }}
            >
              🔒 Exclusive
            </button>
          </div>

          {/* File picker */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-xl py-6 flex flex-col items-center gap-2 mb-4 transition-all"
            style={{ border: '2px dashed rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.05)' }}
          >
            <Upload className="w-8 h-8 text-red-700" />
            <span className="text-sm text-gray-400">Click to select photos / videos</span>
            <span className="text-xs text-gray-600">Multiple files supported — max 100MB each</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFilesSelect}
            className="hidden"
          />

          {/* Queue Preview */}
          {uploadQueue.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">{uploadQueue.length} file(s) ready to upload:</p>
              {uploadQueue.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900">
                    {item.isVideo
                      ? <div className="w-full h-full flex items-center justify-center"><Video className="w-5 h-5 text-gray-500" /></div>
                      : <img src={item.preview} alt="" className="w-full h-full object-cover" />
                    }
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={e => updateQueueItem(item.id, 'title', e.target.value)}
                    className="flex-1 text-xs bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white"
                    placeholder="Title"
                  />
                  <select
                    value={item.mediaType}
                    onChange={e => updateQueueItem(item.id, 'mediaType', e.target.value)}
                    className="text-xs bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white"
                  >
                    <option value="demo">Demo</option>
                    <option value="exclusive">Exclusive</option>
                  </select>
                  <button onClick={() => removeFromQueue(item.id)} className="p-1 rounded hover:bg-red-900/40">
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {uploadQueue.length > 0 && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}
            >
              {uploading
                ? <span className="flex items-center justify-center gap-2"><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" /> Uploading...</span>
                : `🚀 Upload ${uploadQueue.length} file(s)`
              }
            </button>
          )}
        </div>

        {/* Existing Media Grid */}
        {media.length === 0 ? (
          <div className="text-center py-16">
            <Image className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No media uploaded yet</p>
          </div>
        ) : (
          <>
            <h2 className="font-bold text-base text-gray-300 mb-4">
              Uploaded Media ({media.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onToggleType={handleToggleType}
                  onRename={handleRename}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPackageMedia;

