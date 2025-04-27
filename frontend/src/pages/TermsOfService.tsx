import React from 'react';

const TermsOfService: React.FC = () => (
  <div className="mx-auto max-w-2xl px-4">
    <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
    <p className="text-sm text-gray-500 mb-4">Last updated: April 2025</p>
    <section className="prose text-justify dark:prose-invert space-y-4">
      <p>Welcome to the ThreeFold Cloud Marketplace. These Terms of Service govern your use of our platform whether you are a <strong>Dashboard User</strong>, <strong>Dashboard Operator</strong>, or <strong>Node Operator</strong>.</p>
      <h2>User Types</h2>
      <ul className="list-disc list-inside">
        <li><strong>Dashboard Users</strong>: Entities deploying and managing cloud resources via the dashboard.</li>
        <li><strong>Dashboard Operators</strong>: Entities monitoring and maintaining operational deployments.</li>
        <li><strong>Node Operators</strong>: Operators providing and maintaining physical infrastructure nodes.</li>
      </ul>
      <h2>Use of Service</h2>
      <p>Use the platform in compliance with applicable law and these Terms. You are responsible for all actions and data associated with your account.</p>
      <h2>Account Responsibilities</h2>
      <p>Maintain confidentiality of your credentials. You are responsible for all activities under your account.</p>
      <h2>Fees and Payments</h2>
      <p>Certain features may incur fees. You agree to pay all applicable charges and taxes.</p>
      <h2>Intellectual Property</h2>
      <p>All content and software are the property of ThreeFold or its licensors. Unauthorized use is prohibited.</p>
      <h2>Termination</h2>
      <p>We may suspend or terminate access for violations of these Terms or applicable laws.</p>
      <h2>Disclaimer of Warranties</h2>
      <p>The platform is provided "as is" without warranties of any kind.</p>
      <h2>Limitation of Liability</h2>
      <p>In no event shall ThreeFold be liable for indirect, incidental, or punitive damages.</p>
      <h2>Governing Law</h2>
      <p>These Terms are governed by the laws of your jurisdiction.</p>
      <h2>Changes to Terms</h2>
      <p>We may update these Terms. We will notify users of significant changes.</p>
      <h2>Contact Us</h2>
      <p>For questions, email <a href="mailto:info@threefold.io" className="text-green-500 hover:underline">info@threefold.io</a>.</p>
    </section>
  </div>
);

export default TermsOfService;
