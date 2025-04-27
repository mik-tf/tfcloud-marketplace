import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-8">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-center md:space-x-32 space-y-8 md:space-y-0 max-w-4xl mx-auto">
        <div>
          <h4 className="text-sm font-semibold mb-2 dark:text-gray-200">Menu</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
            <li><Link to="/signup" className="hover:underline">Sign Up</Link></li>
            <li><Link to="/docs" className="hover:underline">Docs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 dark:text-gray-200">Legal</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="hover:underline">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 dark:text-gray-200">Resources</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="https://github.com/mik-tf/tfcloud-marketplace" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a></li>
            <li><a href="https://threefold.io" target="_blank" rel="noopener noreferrer" className="hover:underline">ThreeFold.io</a></li>
          </ul>
        </div>
      </div>
      <p className="text-center text-sm mt-6 dark:text-gray-200">
        ThreeFold Cloud Marketplace | &copy; 2025 ThreeFold
      </p>
    </div>
  </footer>
);

export default Footer;
