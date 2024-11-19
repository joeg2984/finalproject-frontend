import React, { useState } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Legend, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Target } from 'lucide-react';

const RiskAssessment = ({ risks }) => {
  const [selectedRisk, setSelectedRisk] = useState(null);

  if (!risks || risks.length === 0) {
    return <div className="mb-6"><p>No risks identified.</p></div>;
  }


   const riskCategories = {
    high: risks.filter(r => r.risk_score >= 15).length,
    medium: risks.filter(r => r.risk_score >= 8 && r.risk_score < 15).length,
    low: risks.filter(r => r.risk_score < 8).length
  };

  const pieData = [
    { name: 'High Risk', value: riskCategories.high, color: '#ef4444' },
    { name: 'Medium Risk', value: riskCategories.medium, color: '#f59e0b' },
    { name: 'Low Risk', value: riskCategories.low, color: '#10b981' }
  ];

  const radarData = risks.map(risk => ({
    risk: risk.risk,
    'Likelihood': risk.likelihood,
    'Impact': risk.impact,
  }));

  const maxScore = Math.max(...risks.map(r => Math.max(r.likelihood, r.impact)));

  const getRiskLevel = (score) => {
    if (score >= 15) return { level: 'High', color: 'text-red-500' };
    if (score >= 8) return { level: 'Medium', color: 'text-yellow-500' };
    return { level: 'Low', color: 'text-green-500' };
  };

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h4 className="text-lg font-semibold mb-4">Risk Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h4 className="text-lg font-semibold mb-4">Risk Impact Analysis</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="risk" />
                <PolarRadiusAxis angle={30} domain={[0, maxScore + 2]} />
                <Radar
                  name="Likelihood"
                  dataKey="Likelihood"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Impact"
                  dataKey="Impact"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      <div className="space-y-4">
        {risks.map((risk, index) => (
          <div
            key={index}
            className={`p-4 bg-white rounded-xl shadow-lg transition-all duration-200 
              ${selectedRisk === index ? 'ring-2 ring-indigo-500' : 'hover:shadow-xl'}`}
            onClick={() => setSelectedRisk(selectedRisk === index ? null : index)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className={getRiskLevel(risk.risk_score).color} />
                  <h4 className="text-lg font-medium">{risk.risk}</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Risk Score: {risk.risk_score} ({getRiskLevel(risk.risk_score).level})
                </p>
              </div>
              <div className="flex space-x-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Likelihood</p>
                  <p className="text-lg font-semibold">{risk.likelihood}/5</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Impact</p>
                  <p className="text-lg font-semibold">{risk.impact}/5</p>
                </div>
              </div>
            </div>

            {selectedRisk === index && (
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="text-indigo-500" />
                      <h5 className="font-medium">Trend</h5>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {risk.likelihood > 3 ? 'Increasing Risk' : 'Stable Risk'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Target className="text-indigo-500" />
                      <h5 className="font-medium">Priority</h5>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {risk.risk_score >= 15 ? 'Immediate Action Required' : 
                       risk.risk_score >= 8 ? 'Monitor Closely' : 'Regular Review'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskAssessment;