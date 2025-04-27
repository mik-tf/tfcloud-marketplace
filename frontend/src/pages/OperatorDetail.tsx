import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Operator {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

const OperatorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [operator, setOperator] = useState<Operator | null>(null);

  useEffect(() => {
    // TODO: fetch real operator details by id
    setOperator({ id: id || '', name: `Operator #${id}`, status: 'Active', createdAt: '2025-04-26' });
  }, [id]);

  if (!operator) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4">{operator.name} Details</h1>
      <p className="mb-2"><strong>ID:</strong> {operator.id}</p>
      <p className="mb-2"><strong>Status:</strong> {operator.status}</p>
      <p className="mb-2"><strong>Created At:</strong> {operator.createdAt}</p>
      {/* Additional operator details and metrics can be added here */}
    </div>
  );
};

export default OperatorDetail;
