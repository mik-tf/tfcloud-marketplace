import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await signup(name, email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Failed to create account');
      }
    } catch (err) {
      setError('An error occurred during signup');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </>
          ) : (
            'Sign Up'
          )}
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
