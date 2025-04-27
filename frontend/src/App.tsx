import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from '@components/NavBar';
import Footer from '@components/Footer';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Signup from '@pages/Signup';
import Dashboard from '@pages/Dashboard';
import NewDeployment from '@pages/NewDeployment';
import DeploymentDetail from '@pages/DeploymentDetail';
import DocPage from '@pages/docs/DocPage';
import Ops from '@pages/Ops'; // Dashboard Ops page
import Nodes from '@pages/Nodes';
import NodeDetail from '@pages/NodeDetail'; // Added import statement for NodeDetail
import PrivacyPolicy from '@pages/PrivacyPolicy';
import TermsOfService from '@pages/TermsOfService';
import ScrollToTop from '@components/ScrollToTop';
import OperatorDetail from '@pages/OperatorDetail'; // Added import statement for OperatorDetail

const App: React.FC = () => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
    <ScrollToTop />
    <NavBar />
    <main className="container mx-auto p-4 text-gray-900 dark:text-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/new" element={<NewDeployment />} />
        <Route path="/dashboard/new/:appType" element={<NewDeployment />} />
        <Route path="/dashboard/:id" element={<DeploymentDetail />} />
        <Route path="/dashboard-ops" element={<Ops />} />
        <Route path="/dashboard-ops/:id" element={<OperatorDetail />} />
        <Route path="/node-ops" element={<Nodes />} />
        <Route path="/node-ops/:id" element={<NodeDetail />} />
        <Route path="/docs" element={<DocPage />} />
        <Route path="/docs/:slug" element={<DocPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;
