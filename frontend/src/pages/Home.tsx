import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// FAQ item with toggle
const FAQItem: React.FC<{question: string; answer: React.ReactNode}> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-gray-600 py-4">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center">
        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{question}</span>
        <span className="text-2xl">{open ? '-' : '+'}</span>
      </button>
      {open && <div className="mt-2 text-gray-700 dark:text-gray-400">{answer}</div>}
    </div>
  );
};

const Home: React.FC = () => (
  <>
    <section className="py-12 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold mb-2 text-gray-900 dark:text-gray-100">ThreeFold Cloud Marketplace</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">A Complete Cloud Ecosystem to Explore</p>
        <div className="flex justify-center space-x-4 mt-6">
          <Link to="/signup" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded">Get Started</Link>
          <Link to="/login" className="bg-white hover:bg-gray-100 text-green-500 border border-green-500 px-6 py-3 rounded">Log In</Link>
        </div>
      </div>
    </section>

    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-700">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">A Three-Layer Cloud Ecosystem</h2>
        <div className="flex flex-col items-center space-y-8">
          <div className="w-full flex flex-col items-center p-6 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
            <span className="text-5xl mb-4">👤</span>
            <h3 className="text-xl font-semibold mb-2">Cloud Users</h3>
            <p className="text-center">Deploy apps on the cloud marketplace seamlessly using credit/debit cards.</p>
          </div>
          <div className="w-full flex flex-col items-center p-6 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
            <span className="text-5xl mb-4">📊</span>
            <h3 className="text-xl font-semibold mb-2">Cloud Operators</h3>
            <p className="text-center">Host and orchestrate the cloud marketplace platform.</p>
          </div>
          <div className="w-full flex flex-col items-center p-6 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
            <span className="text-5xl mb-4">🖥️</span>
            <h3 className="text-xl font-semibold mb-2">Cloud Providers</h3>
            <p className="text-center">Provide nodes with compute, storage, and network resources.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="py-16 px-4 bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">FAQ</h2>
        <FAQItem question="How do Cloud Users deploy apps?" answer="Cloud Users deploy apps seamlessly using credit or debit cards, choosing between basic and advanced deployment modes, and can configure backups and QSFS for data resilience." />
        <FAQItem question="What apps can I deploy?" answer={
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-400">
            <li>Virtual Machines</li>
            <li>Kubernetes clusters</li>
            <li>Quantum Safe Storage</li>
            <li>Nextcloud</li>
            <li>Open WebUI</li>
            <li>Livekit</li>
          </ul>
        } />
        <FAQItem question="What do Cloud Operators do?" answer="Cloud Operators host and manage the marketplace interface, integrate payment gateways, and orchestrate deployments. They unlock up to 60% discounts by staking tokens." />
        <FAQItem question="What is a Cloud Provider?" answer="Cloud Providers provision and maintain TFGrid nodes, delivering compute, storage, and network resources. Earn 50% of the TFChain portion of deployment costs." />
        <FAQItem
          question="What are ThreeFold Cloud alliances?"
          answer={
            <>
              <p>Cloud Providers can partner with Cloud Operators to form <strong>Cloud alliances</strong>, strategic partnerships that combine infrastructure and interface expertise to offer specialized services tailored to different workloads.</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-400">
                <li><strong>HDD-backed QSFS Storage</strong>: cost-effective, high-capacity storage solutions for QSFS.</li>
                <li><strong>GPU-optimized AI & WebUI Workloads</strong>: Nodes with NVIDIA 4090 and other top-tier GPUs tuned for machine learning and open WebUI applications.</li>
                <li><strong>High-bandwidth LiveKit Video Conferencing</strong>: Nodes with superior network throughput and low latency for real-time video applications.</li>
              </ul>
              <p>By forming these alliances, operators can create custom service tiers, improve SLAs, and offer competitive pricing through shared resources and pooled expertise.</p>
            </>
          }
        />
        <FAQItem question="Where can I learn more?" answer={<span>You can learn more by reading the documentation <Link to="/docs/welcome" className="text-green-500 hover:underline">here</Link>.</span>} />
      </div>
    </section>
  </>
);

export default Home;
