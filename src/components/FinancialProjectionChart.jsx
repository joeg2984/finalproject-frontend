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
  if (
    !financialProjection ||
    !Array.isArray(financialProjection.monthly_revenue) ||
    !Array.isArray(financialProjection.monthly_expenses) ||
    financialProjection.monthly_revenue.length !== financialProjection.monthly_expenses.length
  ) {
    return <p>Incomplete financial projection data available.</p>;
  }

  const data = financialProjection.monthly_revenue.map((rev, index) => ({
    month: `Month ${index + 1}`,
    Revenue: rev,
    Expenses: financialProjection.monthly_expenses[index],
  }));

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
          <Line type="monotone" dataKey="Revenue" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Expenses" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialProjectionChart;
