import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

const SignupPage = ({ onLogin }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    console.log('Signup data sent:', form);
    const result = await register(form);
    console.log('Signup response:', result);
    if (result.success && result.token) {
      setSuccess(true);
      alert('Signup successful!');
      if (onLogin) onLogin();
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      </div>
      <form onSubmit={handleSignup} className="space-y-4">
        <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" className="w-full px-4 py-2 border rounded" required />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-2 border rounded" required />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full px-4 py-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Sign Up</button>
      </form>
      {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      <div className="mt-4 text-center">
        Already have an account?{' '}
        <span className="text-blue-500 cursor-pointer" onClick={onLogin}>Login</span>
      </div>
    </div>
  );
};

export default SignupPage;
