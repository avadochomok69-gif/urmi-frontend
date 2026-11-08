import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Packages from './pages/Packages';
import PackageDemo from './pages/PackageDemo';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import MyContent from './pages/MyContent';
import ContentView from './pages/ContentView';
import OrderConfirmation from './pages/OrderConfirmation';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPackages from './pages/admin/AdminPackages';
import AdminPackageMedia from './pages/admin/AdminPackageMedia';
import AdminContent from './pages/admin/AdminContent';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminSettings from './pages/admin/AdminSettings';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f1f1f',
            color: '#fff',
            borderRadius: '10px',
            border: '1px solid #ef4444',
          },
        }}
      />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/package-demo/:packageId" element={<PackageDemo />} />

        {/* Protected Customer Routes */}
        <Route path="/checkout/:packageId" element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/my-content" element={
          <PrivateRoute>
            <MyContent />
          </PrivateRoute>
        } />
        <Route path="/content/:id" element={
          <PrivateRoute>
            <ContentView />
          </PrivateRoute>
        } />
        <Route path="/order-confirmation/:orderId" element={
          <PrivateRoute>
            <OrderConfirmation />
          </PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        } />
        <Route path="/admin/packages" element={
          <AdminRoute>
            <AdminPackages />
          </AdminRoute>
        } />
        <Route path="/admin/packages/:packageId/media" element={
          <AdminRoute>
            <AdminPackageMedia />
          </AdminRoute>
        } />
        <Route path="/admin/content" element={
          <AdminRoute>
            <AdminContent />
          </AdminRoute>
        } />
        <Route path="/admin/customers" element={
          <AdminRoute>
            <AdminCustomers />
          </AdminRoute>
        } />
        <Route path="/admin/settings" element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
