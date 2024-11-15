// frontend/src/components/MitigationStrategies.js
import React from 'react';

const MitigationStrategies = ({ strategies }) => {
  if (!strategies || strategies.length === 0) {
    return null; // No need to render if no strategies
  }

  return (
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-2">Mitigation Strategies</h4>
      <ul className="list-disc list-inside">
        {strategies.map((strategy, index) => (
          <li key={index}>{strategy}</li>
        ))}
      </ul>
    </div>
  );
};

export default MitigationStrategies;
