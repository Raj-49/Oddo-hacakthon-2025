import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardContent, Input, Button } from '../components/ui';

const SignupPage = ({ onLogin }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Signup data sent:', form);
    const result = await register(form);
    console.log('Signup response:', result);
    if (result.success && result.token) {
      alert('Signup successful!');
      if (onLogin) onLogin();
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 sm:px-0 py-8">
      <div className="w-full max-w-md mx-auto">
        <Card className="rounded-2xl shadow-2xl border border-gray-100 bg-white/90 backdrop-blur-md animate-fade-in">
          <CardHeader className="text-center pb-2">
            <h2 className="text-3xl font-extrabold text-gray-900 gradient-text">Sign Up</h2>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6">
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <Input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm text-base w-full" required />
              </div>
              <div>
                <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm text-base w-full" required />
              </div>
              <div>
                <Input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm text-base w-full" required />
              </div>
              <Button type="submit" className="w-full rounded-xl shadow-lg text-lg py-2" variant="primary">Sign Up</Button>
            </form>
            {error && <div className="text-red-500 text-center mt-2">{error}</div>}
            <div className="mt-4 text-center">
              Already have an account?{' '}
              <span className="text-blue-500 cursor-pointer font-semibold" onClick={onLogin}>Login</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, #2563eb 0%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
