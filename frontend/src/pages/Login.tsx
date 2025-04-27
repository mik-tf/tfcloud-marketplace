import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password });
    // TODO: integrate login API
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-10 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded">
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <Link to="/signup" className="text-green-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
