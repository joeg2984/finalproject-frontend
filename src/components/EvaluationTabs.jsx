import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, Award, ChevronUp, ChevronDown, Target 
} from 'lucide-react';
import { useTabAnimation, AnimatedTab, AnimatedContent } from './AnimatedTabs';
import { AnimatePresence } from 'framer-motion';
import RiskAssessment from './RiskAssessment';
import OpenAI from 'openai';  
import Recommendations from './Recommendations';


const ProgressBar = ({ label, value, max }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClass = percentage > 60 ? 'progress-error' : 'progress-warning'; 


  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">
          {value}/{max}
        </span>
      </div>
      <progress className={`progress ${colorClass}`} value={value} max={max}></progress>
    </div>
  );
};

ProgressBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const EvaluationTabs = ({ result = {} }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [timeframe] = useState('yearly');
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const { direction, animate } = useTabAnimation();
  const [generatedRisks, setGeneratedRisks] = useState([]);
  const [isLoadingRisks, setIsLoadingRisks] = useState(false);

  const sampleRisks = [
    {
      risk: "Market Competition",
      likelihood: 4,
      impact: 5,
      risk_score: 20
    },
    {
      risk: "Regulatory Changes",
      likelihood: 3,
      impact: 4,
      risk_score: 12
    },
    {
      risk: "Economic Downturn",
      likelihood: 3,
      impact: 5,
      risk_score: 15
    }
  ];


  useEffect(() => {
    setTimeout(() => setAnimationComplete(true), 500);
  }, []);
  


  const tabs = {
    summary: 'Summary',
    competition: 'Competition',
    financial: 'Financial',
    risks: 'Risks & Strategies',
    actionPlan: 'Action Plan',
  };

  const formatCurrency = (number) => {
    if (typeof number !== 'number') return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const {
    economic_indicator = 0,
    financial_projection = {},
    competitors = [],
    rating = 'N/A',
    explanation = '',
    risks = [],
    mitigation_strategies = [],
  } = result;
  
  const { revenue = 0 } = financial_projection;
  const { steps = [], timeline = [] } = typeof result.action_plan === 'string' ? {} : result.action_plan || {};

  const validCompetitors = Array.isArray(competitors) ? competitors : [];

  const marketStats = {
    averageRating: validCompetitors.length > 0
      ? validCompetitors.reduce((acc, curr) => acc + (curr.rating || 0), 0) / validCompetitors.length
      : 0,
    totalReviews: validCompetitors.reduce((acc, curr) => acc + (curr.user_ratings_total || 0), 0),
    topRating: validCompetitors.length > 0
      ? Math.max(...validCompetitors.map(c => c.rating || 0))
      : 0,
    marketLeader: validCompetitors.length > 0
      ? validCompetitors.reduce((prev, curr) =>
          (prev.user_ratings_total || 0) > (curr.user_ratings_total || 0) ? prev : curr, {})
      : {},
    competitorCount: validCompetitors.length,
  };

  
  const validRisks = generatedRisks.length > 0 ? generatedRisks : sampleRisks;


  const riskData = validRisks.map((risk) => ({
    risk: risk.risk || 'Unnamed Risk',
    risk_score: risk.risk_score || 0,
  }));

  const getRisks = async (businessIdea, location) => {
    console.log("Starting getRisks");
    setIsLoadingRisks(true);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Analyze this business: "${businessIdea}" in ${location}. Return ONLY a JSON array of 3-5 business risks in this exact format:
        [
        {
      "risk": "risk name",
      "likelihood": <number 1-5>,
      "impact": <number 1-5>,
      "risk_score": <likelihood times impact>,
      "mitigation_strategy": "detailed strategy to mitigate this risk"
        },
          ]`
            
        }],
        temperature: 0.7,
      });
      console.log("OpenAI Response:", response)
      ;


      const risksData = JSON.parse(response.choices[0].message.content);
      setGeneratedRisks(risksData);
      return risksData;
    } catch (error) {
      console.error("Error generating risks:", error);
      return sampleRisks;
    } finally {
      setIsLoadingRisks(false);
    }
  };

  useEffect(() => {
    console.log("Result:", result);
    console.log("Business Idea:", result.business_idea);
    console.log("Location:", result.location);
    if (result.business_idea && result.location) {
      getRisks(result.business_idea, result.location);
    }
  }, [result.business_idea, result.location]);



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

  const competitiveData = {
    ratings: validCompetitors.map(c => ({
      name: (c.name && c.name.length > 20) ? c.name.substring(0, 20) + '...' : (c.name || 'Unnamed'),
      rating: c.rating || 0,
      reviews: c.user_ratings_total || 0
    })).sort((a, b) => b.rating - a.rating),

    marketShare: validCompetitors.map(c => ({
      name: (c.name && c.name.length > 15) ? c.name.substring(0, 15) + '...' : (c.name || 'Unnamed'),
      value: c.user_ratings_total || 0
    }))
  };

  const generateProjections = (timeframe) => {
    const months = timeframe === 'yearly' ? 12 : 24;
    const growthRate = timeframe === 'yearly' ? 0.01 : 0.005; 
    const monthlyRevenue = revenue ? revenue / 12 : 0;
    return Array.from({ length: months }, (_, i) => ({
      name: `Month ${i + 1}`,
      revenue: monthlyRevenue * (1 + (i * growthRate)),
      expenses: (monthlyRevenue * 0.4) * (1 + (i * growthRate)),
      profit: (monthlyRevenue * (1 + (i * growthRate))) - ((monthlyRevenue * 0.4) * (1 + (i * growthRate))),
    }));
  };
  

  const radarData = [
    { subject: 'Market Position', A: economic_indicator * 100, B: 60 },
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
            value: `${(economic_indicator * 100).toFixed(0)}%`,
            subtext: 'Economic Strength',
            icon: TrendingUp,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          {
            title: 'Competitive Standing',
            value: `${((marketStats.averageRating / 5) * 100).toFixed(0)}%`,
            subtext: `${marketStats.competitorCount} Direct Competitors`,
            icon: Award,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          },
          {
            title: 'Market Potential',
            value: formatCurrency(revenue),
            subtext: 'Projected Annual Revenue',
            icon: Target,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
          }
        ].map((stat, index) => (
          <div 
            key={index}
            className={`card shadow-lg compact bg-base-100 ${stat.bgColor} transform transition-all duration-500 hover:scale-105 cursor-pointer`}
            style={{
              opacity: animationComplete ? 1 : 0,
              transform: `translateY(${animationComplete ? 0 : '20px'})`,
              transition: `all 0.5s ease-out ${index * 0.1}s`
            }}
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="card-title text-sm">{stat.title}</h2>
                  <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card shadow-lg bg-base-100 p-4">
          <h3 className="card-title text-lg font-medium mb-4">Market Position</h3>
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

        <div className="card shadow-lg bg-base-100 p-4">
          <h3 className="card-title text-lg font-medium mb-4">Financial Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generateProjections('yearly')}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
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
            <div className="card shadow-lg bg-base-100 p-6 rounded-lg">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">
                  Overall Rating: 
                  <span className={`ml-2 badge ${
                    rating === 'Great' ? 'badge-success' :
                    rating === 'Good' ? 'badge-primary' : 'badge-warning'
                  }`}>
                    {rating}
                  </span>
                </h3>
                <p className="text-lg text-gray-700">{explanation}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Market Overview</h4>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Economic Indicator</span>
                      <span className="font-medium">{(economic_indicator * 100).toFixed(0)}%</span>
                    </div>
                    <progress className="progress progress-primary w-full" value={economic_indicator * 100} max="100"></progress>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Key Statistics</h4>
                  <div className="bg-base-200 p-4 rounded-lg space-y-3">
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
                      <span className="font-medium">{marketStats.marketLeader.name || 'N/A'}</span>
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
            <div className="card shadow-lg bg-base-100 p-6 rounded-lg">
              <h3 className="card-title text-xl font-semibold mb-6">Competitive Analysis</h3>
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
                {validCompetitors.map((competitor, index) => (
                  <div 
                    key={index}
                    className="border rounded-lg p-4 bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
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
          <div className="card shadow-lg bg-base-100 p-6 rounded-lg">
            <h3 className="card-title text-xl font-semibold mb-4">Financial Projections</h3>
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
              <div className="card shadow-lg bg-base-100 p-6 rounded-lg">
                <h3 className="card-title text-xl font-semibold mb-4">Risks & Strategies</h3>
        
                <RiskAssessment risks={validRisks} />
        
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
        
                <div>
                  <h4 className="font-medium text-lg mb-2">Detailed Risk Analysis</h4>
                  {validRisks.length > 0 ? (
                    validRisks.map((risk, index) => (
                      <div key={index} className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-semibold text-gray-800">{risk.risk}</p>
                          <span className={`badge ${
                            risk.risk_score >= 20 ? 'badge-error' :
                            risk.risk_score >= 10 ? 'badge-warning' : 'badge-success'
                          }`}>
                            Score: {risk.risk_score}
                          </span>
                        </div>
                        <ProgressBar label="Likelihood" value={risk.likelihood} max={5} />
                        <ProgressBar label="Impact" value={risk.impact} max={5} />
                        <ProgressBar label="Risk Score" value={risk.risk_score} max={25} />
                        <div className="mt-2">
                          <p className="font-medium text-gray-700">Mitigation Strategy:</p>
                          <p>{mitigation_strategies[index] || 'No strategy provided.'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="alert alert-info shadow-lg">
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>No significant risks identified.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );

        case 'actionPlan':
            return (
              <div className="space-y-6">
                <div className="card shadow-lg bg-base-100 p-6 rounded-lg">
                  <h3 className="card-title text-xl font-semibold mb-4">Strategic Action Plan</h3>
                  {Array.isArray(steps) && steps.length > 0 ? (
                    <div className="grid gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-lg mb-2">Key Implementation Steps</h4>
                        <div className="grid gap-4">
                          {steps.map((step, index) => (
                            <div key={index} className="bg-base-200 p-4 rounded-lg">
                              <div className="flex items-start">
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                                  {index + 1}
                                </span>
                                <div className="ml-4">
                                  <p className="text-gray-700">{step}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Recommendations result={result} />
                  )}
                </div>
              </div>
            );

      case 'insights':
        return (
          <div className="card shadow-lg bg-base-100 p-6 rounded-lg">
            <h3 className="card-title text-xl font-semibold mb-4">Market Insights</h3>
            {getMarketInsights().length > 0 ? (
              getMarketInsights().map((insight, index) => (
                <div 
                  key={index} 
                  className={`alert ${
                    insight.type === 'warning' ? 'alert-warning' : 'alert-info'
                  } shadow-lg mb-4`}
                >
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-lg">{insight.title}</h4>
                      <p>{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-info shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>No market insights available at this time.</span>
                </div>
                <Recommendations result={result} />

              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative flex space-x-1 p-1 bg-gray-100 rounded-lg">
        {Object.entries(tabs).map(([key, label], index) => (
          <AnimatedTab
            key={key}
            isActive={activeTab === key}
            onClick={() => {
              setActiveTab(key);
              animate(index);
            }}
          >
            {label}
          </AnimatedTab>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <AnimatedContent direction={direction}>
          {renderContent()}
        </AnimatedContent>
      </AnimatePresence>
    </div>
  );
};

EvaluationTabs.propTypes = {
  result: PropTypes.shape({
    economic_indicator: PropTypes.number,
    financial_projection: PropTypes.shape({
      revenue: PropTypes.number,
    }),
    competitors: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        rating: PropTypes.number,
        user_ratings_total: PropTypes.number,
        vicinity: PropTypes.string,
      })
    ),
    rating: PropTypes.string,
    explanation: PropTypes.string,
    risks: PropTypes.arrayOf(
      PropTypes.shape({
        risk: PropTypes.string,
        likelihood: PropTypes.number,
        impact: PropTypes.number,
        risk_score: PropTypes.number,
      })
    ),
    mitigation_strategies: PropTypes.arrayOf(PropTypes.string),
    action_plan: PropTypes.shape({
      steps: PropTypes.arrayOf(PropTypes.string),
      timeline: PropTypes.arrayOf(
        PropTypes.shape({
          month: PropTypes.string,
          progress: PropTypes.number,
        })
      ),
    }),
  }),
};

export default EvaluationTabs;
