import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Input } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = ({ onSignup, onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await login(formData);
      // Log the full login response
      if (result.success && result.response) {
        console.log('Login response:', result.response);
        if (result.response.token) {
          localStorage.setItem('token', result.response.token);
        }
        if (result.response.user) {
          localStorage.setItem('user', JSON.stringify(result.response.user));
        }
        if (onClose) onClose(); // Close the modal after successful login
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 sm:px-0 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-4">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <span
              className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              onClick={onSignup}
            >
              create a new account
            </span>
          </p>
        </div>
        <Card className="rounded-2xl shadow-2xl border border-gray-100 bg-white/90 backdrop-blur-md animate-fade-in">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10 w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                </div>
                <div className="text-sm">
                  {/* You can add forgot password modal logic here if needed */}
                  <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">Forgot your password?</span>
                </div>
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full rounded-xl shadow-lg text-lg py-2"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <span
              className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              onClick={onSignup}
            >
              Sign up for free
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
