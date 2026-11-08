import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, Package } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#0a0000]/90 backdrop-blur-md border-b border-red-900/30 px-4 md:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: URMI Branding */}
        <Link to="/" className="flex items-center gap-2 group">
          <span 
            className="text-2xl md:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            URMI
          </span>
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
        </Link>

        {/* Right Side: Navigation & Login Button */}
        <div className="flex items-center gap-2 md:gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                to="/my-packages"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-md shadow-red-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Package className="w-3.5 h-3.5" />
                <span>My Packages</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold text-gray-300 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-md shadow-red-900/40 hover:shadow-red-700/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

