import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { Users, ShoppingBag, DollarSign, Package, Clock, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
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

  const statCards = [
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Total Revenue',
      value: `৳${stats?.totalRevenue || 0}`,
      icon: DollarSign,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Active Packages',
      value: stats?.activePackages || 0,
      icon: Package,
      color: 'from-orange-600 to-orange-700'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'from-yellow-600 to-yellow-700'
    },
    {
      title: 'Approved Orders',
      value: stats?.approvedOrders || 0,
      icon: CheckCircle,
      color: 'from-primary-600 to-primary-700'
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-400">Overview of your platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-900 rounded-xl border border-dark-800 p-4 md:p-6 hover:border-primary-600 transition-all"
              >
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className={`p-2 md:p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-400 text-xs md:text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
