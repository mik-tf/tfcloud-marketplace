import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth0Provider from './auth/Auth0Provider';
import ProtectedRoute from './auth/ProtectedRoute';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Profile from './components/Profile';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import NewDeployment from './pages/NewDeployment';
import DeploymentDetail from './pages/DeploymentDetail';
import DocPage from './pages/docs/DocPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ScrollToTop from './components/ScrollToTop';
import OperatorDetail from './pages/OperatorDetail';
import Nodes from './pages/Nodes';
import Ops from './pages/Ops';

const App: React.FC = () => (
  <Auth0Provider>
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <ScrollToTop />
      <NavBar />
      <main className="flex-grow container mx-auto p-4 text-gray-900 dark:text-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="new" element={<NewDeployment />} />
            <Route path="new/:appType" element={<NewDeployment />} />
            <Route path="operator" element={
              <ProtectedRoute requiredRole="cloud-operator">
                <Ops />
              </ProtectedRoute>
            } />
            <Route path="provider" element={
              <ProtectedRoute requiredRole="cloud-provider">
                <Nodes />
              </ProtectedRoute>
            } />
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
  </Auth0Provider>
);

export default App;
