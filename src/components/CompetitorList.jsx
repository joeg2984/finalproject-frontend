import React from 'react';
import { FaStore } from 'react-icons/fa';

const CompetitorList = ({ competitors }) => {
  if (!competitors || competitors.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Competitors</h3>
        <p>No competitors found in the vicinity.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium mb-2">Competitors</h3>
      <ul className="space-y-4">
        {competitors.map((competitor, index) => (
          <li key={index} className="flex items-center space-x-4 p-4 border rounded-md hover:bg-gray-50 transition duration-200">
            <FaStore className="text-indigo-500 text-3xl" />
            <div>
              <p className="font-semibold text-lg">{competitor.name}</p>
              <p className="text-sm text-gray-600">{competitor.vicinity}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-600">Rating:</span>
                <span className="text-sm text-gray-800">{competitor.rating || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-600">Reviews:</span>
                <span className="text-sm text-gray-800">{competitor.user_ratings_total || 0}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompetitorList;
