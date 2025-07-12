import { Link, useLocation } from 'react-router-dom';
import { Search, Plus, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Avatar, Input } from '../ui';

const Navbar = ({ openLogin, openSignup }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200 rounded-b-xl sticky top-0 z-40 animate-fade-in">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-2 md:py-0 gap-2 md:gap-0">
            {/* Logo */}
            <div className="flex items-center w-full md:w-auto justify-center md:justify-start mb-2 md:mb-0">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg tracking-wide">S</span>
                </div>
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight gradient-text">StackIt</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`transition-all text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-base font-medium ${location.pathname === '/' ? 'text-blue-600 bg-blue-50 shadow' : ''}`}
              >
                Questions
              </Link>
              <Link
                to="/tags"
                className={`transition-all text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-base font-medium ${location.pathname === '/tags' ? 'text-blue-600 bg-blue-50 shadow' : ''}`}
              >
                Tags
              </Link>
              <Link
                to="/users"
                className={`transition-all text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-base font-medium ${location.pathname === '/users' ? 'text-blue-600 bg-blue-50 shadow' : ''}`}
              >
                Users
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block md:flex-1 max-w-lg mx-0 md:mx-4 mb-2 md:mb-0">

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search questions..."
                  className="pl-10 pr-4 rounded-lg border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm w-full"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="hidden md:flex md:w-auto items-center justify-end space-x-4 mb-2 md:mb-0">
              {isAuthenticated ? (
                <>
                  <Button
                    as={Link}
                    to="/ask"
                    variant="primary"
                    size="sm"
                    className="flex items-center space-x-2 shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Ask Question</span>
                  </Button>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                      <Avatar name={user?.name} src={user?.avatar} size="sm" />
                      <span className="hidden sm:inline text-base font-semibold">
                        {user?.name}
                      </span>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-52 bg-white/90 border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-base text-gray-700 hover:bg-blue-50 rounded-lg"
                        >
                          <User className="inline-block w-4 h-4 mr-2" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-blue-50 rounded-lg"
                        >
                          <LogOut className="inline-block w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg shadow-sm"
                    onClick={openLogin}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-lg shadow-md"
                    onClick={openSignup}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors shadow"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2 rounded-b-xl bg-white/90 shadow-xl animate-fade-in">
              <div className="flex flex-col space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                >
                  Questions
                </Link>
                <Link
                  to="/tags"
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                >
                  Tags
                </Link>
                <Link
                  to="/users"
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                >
                  Users
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 border-t border-gray-200 shadow-lg flex justify-around items-center px-2 py-2 animate-fade-in">
        <Link to="/" className={`flex flex-col items-center text-xs ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Search className="h-6 w-6 mb-1" />
          Home
        </Link>
        <Link to="/ask" className="flex flex-col items-center text-xs text-gray-500">
          <Plus className="h-6 w-6 mb-1" />
          Ask
        </Link>
        <Link to="/tags" className={`flex flex-col items-center text-xs ${location.pathname === '/tags' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Menu className="h-6 w-6 mb-1" />
          Tags
        </Link>
        <Link to="/users" className={`flex flex-col items-center text-xs ${location.pathname === '/users' ? 'text-blue-600' : 'text-gray-500'}`}>
          <User className="h-6 w-6 mb-1" />
          Users
        </Link>
      </div>

      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, #2563eb 0%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default Navbar;
