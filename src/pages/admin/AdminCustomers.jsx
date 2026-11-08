import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { Users, Mail, Phone } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get('/api/admin/customers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCustomers(data.customers);
    } catch (error) {
      toast.error('Failed to fetch customers');
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

  return (
    <AdminLayout>
      <div className="p-3 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-1 sm:mb-2">Customers</h1>
          <p className="text-gray-400 text-xs sm:text-sm">View and manage customer accounts</p>
        </div>

        {/* Desktop Table View - hidden on mobile */}
        <div className="hidden lg:block bg-dark-900 rounded-xl border border-dark-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Orders</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{customer.name}</p>
                        {customer.email && (
                          <p className="text-sm text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      {customer.phone && (
                        <p className="text-gray-300 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </p>
                      )}
                      {customer.whatsapp && (
                        <p className="text-gray-400">WhatsApp: {customer.whatsapp}</p>
                      )}
                      {customer.telegram && (
                        <p className="text-gray-400">Telegram: {customer.telegram}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-sm font-semibold">
                      {customer.purchases?.length || 0} orders
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {customers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No customers found</p>
            </div>
          )}
        </div>

        {/* Mobile Card View - visible only on mobile */}
        <div className="lg:hidden space-y-3">
          {customers.map((customer) => (
            <div key={customer._id} className="bg-dark-900 rounded-lg border border-dark-800 p-3 sm:p-4">
              {/* Customer Info */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm sm:text-base truncate">{customer.name}</p>
                  {customer.email && (
                    <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </p>
                  )}
                </div>
                <span className="px-2 py-0.5 bg-primary-600/20 text-primary-400 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                  {customer.purchases?.length || 0} orders
                </span>
              </div>

              {/* Contact Details */}
              {(customer.phone || customer.whatsapp || customer.telegram) && (
                <div className="space-y-1 mb-3 text-xs sm:text-sm pb-3 border-b border-dark-800">
                  {customer.phone && (
                    <p className="text-gray-300 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      <span>{customer.phone}</span>
                    </p>
                  )}
                  {customer.whatsapp && (
                    <p className="text-gray-400 pl-4">WhatsApp: {customer.whatsapp}</p>
                  )}
                  {customer.telegram && (
                    <p className="text-gray-400 pl-4">Telegram: {customer.telegram}</p>
                  )}
                </div>
              )}

              {/* Join Date */}
              <p className="text-xs text-gray-500">
                Joined: {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}

          {customers.length === 0 && (
            <div className="text-center py-8 sm:py-12 bg-dark-900 rounded-lg border border-dark-800">
              <p className="text-gray-400 text-sm sm:text-base">No customers found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
