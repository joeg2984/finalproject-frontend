import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { MapPin, TrendingUp, AlertTriangle, Award, Users, DollarSign, 
         ChevronUp, ChevronDown, Activity, Target } from 'lucide-react';

const EvaluationTabs = ({ result }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [timeframe, setTimeframe] = useState('yearly');
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);

  useEffect(() => {
    setTimeout(() => setAnimationComplete(true), 500);
  }, []);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const tabs = {
    summary: 'Summary',
    competition: 'Competition',
    financial: 'Financial',
    risks: 'Risks & Strategies',
    actionPlan: 'Action Plan',
    insights: 'Market Insights'
  };

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };


 

  // Calculate market statistics
  const marketStats = {
    averageRating: result.competitors.reduce((acc, curr) => acc + curr.rating, 0) / result.competitors.length,
    totalReviews: result.competitors.reduce((acc, curr) => acc + curr.user_ratings_total, 0),
    topRating: Math.max(...result.competitors.map(c => c.rating)),
    marketLeader: result.competitors.reduce((prev, curr) => 
      prev.user_ratings_total > curr.user_ratings_total ? prev : curr
    ),
    competitorCount: result.competitors.length
  };

  const riskData = result.risks.map((risk) => ({
    risk: risk.risk,
    risk_score: risk.risk_score,
  }));
 
  const ProgressBar = ({ label, value, max }) => {
    const percentage = (value / max) * 100;
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-700">
            {value}/{max}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              percentage > 60 ? 'bg-red-600' : 'bg-yellow-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };
  const getMarketInsights = () => {
    const avgRating = marketStats.averageRating;
    const insights = [];
    
    if (avgRating > 4.3) {
      insights.push({
        type: 'warning',
        title: 'High Quality Market',
        description: 'Competitors maintain very high standards. Focus on premium service offerings.'
      });
    }

    if (marketStats.totalReviews > 700) {
      insights.push({
        type: 'info',
        title: 'Established Market',
        description: 'Strong existing customer base. Focus on differentiation strategy.'
      });
    }

    return insights;
  };

  // Generate competitive analysis data
  const competitiveData = {
    ratings: result.competitors.map(c => ({
      name: c.name.length > 20 ? c.name.substring(0, 20) + '...' : c.name,
      rating: c.rating,
      reviews: c.user_ratings_total
    })).sort((a, b) => b.rating - a.rating),

    marketShare: result.competitors.map(c => ({
      name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
      value: c.user_ratings_total
    }))
  };

  // Generate financial projections
  const generateProjections = (timeframe) => {
    const months = timeframe === 'yearly' ? 12 : 24;
    const monthlyRevenue = result.financial_projection.revenue / 12;
    return Array.from({ length: months }, (_, i) => ({
      name: `Month ${i + 1}`,
      revenue: monthlyRevenue * (1 + (i * 0.015)),
      expenses: (monthlyRevenue * 0.4) * (1 + (i * 0.01)),
      profit: (monthlyRevenue * (1 + (i * 0.015))) - ((monthlyRevenue * 0.4) * (1 + (i * 0.01)))
    }));
  };

  // Market Position Radar Data
  const radarData = [
    { subject: 'Market Position', A: (result.economic_indicator * 100), B: 60 },
    { subject: 'Revenue Potential', A: 85, B: 70 },
    { subject: 'Location Score', A: 90, B: 65 },
    { subject: 'Competition Level', A: 75, B: 80 },
    { subject: 'Growth Potential', A: 80, B: 70 }
  ];

  const renderDashboard = () => (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Market Position',
            value: `${(result.economic_indicator * 100).toFixed(0)}%`,
            subtext: 'Economic Strength',
            icon: TrendingUp,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Competitive Standing',
            value: `${((marketStats.averageRating / 5) * 100).toFixed(0)}%`,
            subtext: `${marketStats.competitorCount} Direct Competitors`,
            icon: Award,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Market Potential',
            value: formatCurrency(result.financial_projection.revenue),
            subtext: 'Projected Annual Revenue',
            icon: Target,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          }
        ].map((stat, index) => (
          <div 
            key={index}
            className={`p-6 rounded-lg ${stat.bgColor} transform transition-all duration-500 hover:scale-105 cursor-pointer`}
            style={{
              opacity: animationComplete ? 1 : 0,
              transform: `translateY(${animationComplete ? 0 : '20px'})`,
              transition: `all 0.5s ease-out ${index * 0.1}s`
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Market Position</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Your Business"
                  dataKey="A"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Industry Average"
                  dataKey="B"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Financial Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generateProjections('yearly')}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.6}
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                  name="Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div className="space-y-6">
            {renderDashboard()}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">
                  Overall Rating: 
                  <span className={`ml-2 ${
                    result.rating === 'Great' ? 'text-green-600' :
                    result.rating === 'Good' ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {result.rating}
                  </span>
                </h3>
                <p className="text-lg text-gray-700">{result.explanation}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Market Overview</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Economic Indicator</span>
                      <span className="font-medium">{(result.economic_indicator * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${result.economic_indicator * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Key Statistics</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Market Rating</span>
                      <span className="font-medium">{marketStats.averageRating.toFixed(1)}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Market Reviews</span>
                      <span className="font-medium">{marketStats.totalReviews.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Leader</span>
                      <span className="font-medium">{marketStats.marketLeader.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'competition':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-6">Competitive Analysis</h3>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={competitiveData.ratings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="rating" fill="#4F46E5">
                      {competitiveData.ratings.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.rating >= 4.5 ? '#10B981' : '#4F46E5'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid gap-4">
                {result.competitors.map((competitor, index) => (
                  <div 
                    key={index}
                    className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedCompetitor(selectedCompetitor === index ? null : index)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-lg">{competitor.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{competitor.rating}/5 ({competitor.user_ratings_total} reviews)</span>
                          <span>|</span>
                          <span>{competitor.vicinity}</span>
                        </div>
                      </div>
                      {selectedCompetitor === index ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    
                    {selectedCompetitor === index && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Rating Breakdown</p>
                            <div className="flex items-center mt-1">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${(competitor.rating / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className="font-medium">{((competitor.rating / 5) * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Financial Projections</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={generateProjections(timeframe)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="revenue" stroke="#4F46E5" />
                <Line type="monotone" dataKey="profit" stroke="#10B981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
        case 'risks':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Risks & Strategies</h3>

              {/* Risk Score Bar Chart */}
              <div className="mb-6">
                <h4 className="font-medium text-lg mb-2">Risk Scores Overview</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 25]} />
                      <YAxis dataKey="risk" type="category" width={200} />
                      <Tooltip />
                      <Bar dataKey="risk_score" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Individual Risks with Progress Bars */}
              <div>
                <h4 className="font-medium text-lg mb-2">Detailed Risk Analysis</h4>
                {result.risks && result.risks.length > 0 ? (
                  result.risks.map((risk, index) => (
                    <div key={index} className="mb-6 border-b pb-4">
                      <p className="font-semibold text-gray-800 mb-2">{risk.risk}</p>
                      <ProgressBar label="Likelihood" value={risk.likelihood} max={5} />
                      <ProgressBar label="Impact" value={risk.impact} max={5} />
                      <ProgressBar label="Risk Score" value={risk.risk_score} max={25} />
                      <div className="mt-2">
                        <p className="font-medium text-gray-700">Mitigation Strategy:</p>
                        <p>{result.mitigation_strategies[index]}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No significant risks identified.</p>
                )}
              </div>
            </div>
          </div>
        );

        case 'actionPlan':
          return (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
              {result.action_plan ? (
                <div className="space-y-4">
                  {result.action_plan.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p>No action plan available at this time.</p>
              )}
            </div>
          );
        
      case 'insights':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Market Insights</h3>
            {getMarketInsights().map((insight, index) => (
              <div key={index} className={`border-l-4 pl-4 mb-4 ${insight.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'}`}>
                <h4 className="font-medium text-lg">{insight.title}</h4>
                <p>{insight.description}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b pb-4">
        {Object.keys(tabs).map((key) => (
          <button
            key={key}
            className={`px-4 py-2 font-medium ${
              activeTab === key ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(key)}
          >
            {tabs[key]}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default EvaluationTabs;
