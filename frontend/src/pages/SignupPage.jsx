import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = ({ onLogin }) => {
  const handleSignup = (e) => {
    e.preventDefault();
    // Add signup logic here
    alert('Signup successful!');
    if (onLogin) onLogin();
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      </div>
      <form onSubmit={handleSignup} className="space-y-4">
        <input type="text" placeholder="Username" className="w-full px-4 py-2 border rounded" required />
        <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded" required />
        <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Sign Up</button>
      </form>
      <div className="mt-4 text-center">
        Already have an account?{' '}
        <span className="text-blue-500 cursor-pointer" onClick={onLogin}>Login</span>
      </div>
    </div>
  );
};

export default SignupPage;
