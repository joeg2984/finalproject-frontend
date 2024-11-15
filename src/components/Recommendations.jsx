// frontend/src/components/Recommendations.js
import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

const Recommendations = ({ result }) => {
  const recommendations = [];
  const nextSteps = [];

  // Recommendations based on Financial Projections
  if (result.financial_projection && result.financial_projection.net_profit < 0) {
    recommendations.push('Revise your pricing strategy to improve profitability.');
    nextSteps.push('Analyze your pricing model and compare it with industry standards.');
    nextSteps.push('Consider offering discounts or value-added services.');
  }

  // Recommendations based on Risks
  if (result.risks && result.risks.length > 0) {
    recommendations.push('Implement strategies to mitigate identified risks.');
    nextSteps.push('Develop a comprehensive risk management plan.');
    nextSteps.push('Allocate resources to address high-impact risks.');
  }

  // Recommendations based on Competitors
  if (result.competitors && result.competitors.length > 5) {
    recommendations.push('Differentiate your business to stand out in a competitive market.');
    nextSteps.push('Identify unique value propositions that set your business apart.');
    nextSteps.push('Enhance your marketing strategy to highlight your strengths.');
  }

  // Additional Recommendations
  // Add more conditions and recommendations as needed

  return (
    <div className="mt-6">
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md mb-4">
        <h3 className="text-xl font-medium mb-2 flex items-center">
          <FaLightbulb className="mr-2 text-yellow-500" /> Recommendations
        </h3>
        {recommendations.length === 0 ? (
          <p className="text-green-600">Your business idea is on a strong path! Keep up the great work.</p>
        ) : (
          <ul className="list-disc list-inside space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-gray-700">
                {rec}
              </li>
            ))}
          </ul>
        )}
      </div>

      {nextSteps.length > 0 && (
        <div className="p-4 bg-blue-100 border border-blue-300 rounded-md">
          <h3 className="text-xl font-medium mb-2 flex items-center">
            <FaLightbulb className="mr-2 text-blue-500" /> Next Steps
          </h3>
          <ol className="list-decimal list-inside space-y-2">
            {nextSteps.map((step, index) => (
              <li key={index} className="text-gray-700">
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
