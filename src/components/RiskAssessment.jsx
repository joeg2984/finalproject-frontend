// frontend/src/components/RiskAssessment.js
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip, ResponsiveContainer,
} from 'recharts';

const RiskAssessment = ({ risks }) => {
  if (!risks || risks.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Risk Assessment</h3>
        <p>No risks identified.</p>
      </div>
    );
  }

  // Prepare data for RadarChart
  const data = risks.map(risk => ({
    risk: risk.risk,
    'Likelihood': risk.likelihood,
    'Impact': risk.impact,
  }));

  const maxScore = Math.max(...risks.map(r => Math.max(r.likelihood, r.impact)));

  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium mb-2">Risk Assessment</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="risk" />
          <PolarRadiusAxis angle={30} domain={[0, maxScore + 10]} />
          <Tooltip />
          <Legend />
          <Radar name="Likelihood" dataKey="Likelihood" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Radar name="Impact" dataKey="Impact" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskAssessment;
