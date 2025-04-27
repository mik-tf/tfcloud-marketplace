import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords don't match");
      return;
    }
    console.log({ name, email, password });
    navigate('/dashboard');
    // TODO: integrate signup API
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
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
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Confirm Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="••••••••"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white px-3 py-2 rounded">
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-green-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
