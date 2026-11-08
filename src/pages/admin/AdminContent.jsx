import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Image as ImageIcon, Video } from 'lucide-react';

const AdminContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data } = await axios.get('/api/admin/content', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setContent(data.content);
    } catch (error) {
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      await axios.delete(`/api/admin/content/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Content deleted successfully');
      fetchContent();
    } catch (error) {
      toast.error('Failed to delete content');
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
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-1 sm:mb-2">Content Management</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Manage premium photos and videos</p>
          </div>
          <button className="btn-primary flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base py-2 sm:py-2.5 px-3 sm:px-4">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Upload Content</span>
            <span className="sm:hidden">Upload</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {content.map((item) => {
            const Icon = item.type === 'video' ? Video : ImageIcon;
            
            return (
              <div key={item._id} className="bg-dark-900 rounded-lg sm:rounded-xl border border-dark-800 overflow-hidden">
                <div className="relative h-36 sm:h-44 lg:h-48 bg-dark-800">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 bg-primary-600 rounded-full flex items-center gap-1">
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-[10px] sm:text-xs font-semibold">{item.type}</span>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2 truncate">{item.titleBn || item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                    {item.descriptionBn || item.description}
                  </p>

                  <div className="flex items-center justify-between mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500">
                    <span>{item.files?.length || 0} files</span>
                    <span>{item.views} views</span>
                  </div>

                  <div className="flex gap-1.5 sm:gap-2">
                    <button className="flex-1 btn-secondary py-1.5 sm:py-2 text-xs sm:text-sm">
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 rounded-md sm:rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {content.length === 0 && (
          <div className="text-center py-8 sm:py-12 bg-dark-900 rounded-lg sm:rounded-xl">
            <p className="text-gray-400 text-sm sm:text-base">No content found. Upload your first content!</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
