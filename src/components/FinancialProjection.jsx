import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const FinancialProjectionChart = ({ financialProjection }) => {
  // Sample data structure; adjust based on actual data
  const data = [
    { month: 'Jan', revenue: financialProjection.revenue, expenses: financialProjection.operational_expenses },
    { month: 'Feb', revenue: financialProjection.revenue * 1.05, expenses: financialProjection.operational_expenses * 1.02 },
    // Add more months as needed
  ];

  return (
    <div className="mt-6">
      <h3 className="text-xl font-medium mb-2">Financial Projections</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
          <Line type="monotone" dataKey="expenses" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialProjectionChart;
