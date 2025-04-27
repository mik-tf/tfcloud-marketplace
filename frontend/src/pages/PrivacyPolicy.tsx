import React from 'react';

const PrivacyPolicy: React.FC = () => (
  <div className="mx-auto max-w-2xl px-4">
    <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
    <p className="text-sm text-gray-500 mb-4">Last updated: April 2025</p>
    <section className="prose text-justify dark:prose-invert space-y-4">
      <p>At ThreeFold Cloud Marketplace, we are committed to protecting the privacy of our <strong>Dashboard Users</strong>, <strong>Dashboard Operators</strong>, and <strong>Node Operators</strong>. This Privacy Policy describes how we collect, use, and safeguard your information.</p>
      <h2>User Types</h2>
      <ul className="list-disc list-inside">
        <li><strong>Dashboard Users</strong>: Individuals deploying and managing cloud resources via the dashboard.</li>
        <li><strong>Dashboard Operators</strong>: Entities monitoring deployments and operational metrics.</li>
        <li><strong>Node Operators</strong>: Operators hosting and maintaining the physical infrastructure nodes.</li>
      </ul>
      <h2>Information We Collect</h2>
      <ul className="list-disc list-inside">
        <li>Account details (email, username) for authentication and support.</li>
        <li>Usage metrics (resource allocation, activity logs) to improve service quality.</li>
        <li>Node health and performance data from Node Operators for network stability.</li>
      </ul>
      <h2>How We Use Your Information</h2>
      <p>We use data to provide, maintain, and enhance our decentralized cloud platform, personalize user experience, and ensure security.</p>
      <h2>Data Sharing and Disclosure</h2>
      <p>We do not sell personal data. We share aggregated or anonymized analytics with trusted partners under strict confidentiality.</p>
      <h2>Data Security and Retention</h2>
      <p>We employ industry-standard encryption and access controls. Data is retained only as long as necessary for operational and legal purposes.</p>
      <h2>Your Rights</h2>
      <p>You may access, update, or request deletion of your personal data by contacting us.</p>
      <h2>Changes to This Policy</h2>
      <p>We may update this policy periodically. We will notify users of significant changes.</p>
      <h2>Contact Us</h2>
      <p>For privacy inquiries, email <a href="mailto:info@threefold.io" className="text-green-500 hover:underline">info@threefold.io</a>.</p>
    </section>
  </div>
);

export default PrivacyPolicy;
