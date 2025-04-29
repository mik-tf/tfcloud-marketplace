import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import RequireRole from '@components/RequireRole';
import NavBar from '@components/NavBar';
import Footer from '@components/Footer';
import DashboardLayout from '@components/DashboardLayout';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Signup from '@pages/Signup';
import Settings from '@pages/Settings';
import Dashboard from '@pages/Dashboard';
import NewDeployment from '@pages/NewDeployment';
import DeploymentDetail from '@pages/DeploymentDetail';
import DocPage from '@pages/docs/DocPage';
import PrivacyPolicy from '@pages/PrivacyPolicy';
import TermsOfService from '@pages/TermsOfService';
import ScrollToTop from '@components/ScrollToTop';
import OperatorDetail from '@pages/OperatorDetail';
import Nodes from '@pages/Nodes';
import Ops from '@pages/Ops';

const App: React.FC = () => (
  <AuthProvider>
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <ScrollToTop />
      <NavBar />
      <main className="flex-grow container mx-auto p-4 text-gray-900 dark:text-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/*" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="new" element={<NewDeployment />} />
            <Route path="new/:appType" element={<NewDeployment />} />
            <Route path="ops" element={<RequireRole role="admin"><Ops /></RequireRole>} />
            <Route path="nodes" element={<RequireRole role="node-operator"><Nodes /></RequireRole>} />
            <Route path="settings" element={<Settings />} />
            <Route path=":id" element={<DeploymentDetail />} />
          </Route>
          <Route path="/docs" element={<DocPage />} />
          <Route path="/docs/:slug" element={<DocPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </AuthProvider>
);

export default App;
