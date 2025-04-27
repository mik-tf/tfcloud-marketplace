import React from 'react';
import { useParams, Link } from 'react-router-dom';

const DeploymentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Deployment #{id}</h1>
      <p>Details for deployment {id} coming soon.</p>
      <Link to="/dashboard" className="text-green-500 hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default DeploymentDetail;
