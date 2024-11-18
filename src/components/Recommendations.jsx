import React, { useState, useEffect } from 'react';
import { FaLightbulb, FaChartLine, FaShieldAlt, FaUsers, FaRocket } from 'react-icons/fa';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const Recommendations = ({ result }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateRecommendations();
  }, [result]);

  const generateRecommendations = async () => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Analyze this business data and provide strategic recommendations for entrepreneurship, and what the entrepreneur should do regarding funding, marketing, and operations:
          Business: ${result.business_idea}
          Location: ${result.location}
          Competition Level: ${result.competitors?.length || 0} competitors
          Economic Indicator: ${result.economic_indicator}
          
          Return ONLY a JSON array in this format:
          {
            "market_strategy": [
              {
                "title": "strategy title",
                "description": "detailed strategy",
                "timeline": "immediate/30-days/60-days/90-days",
                "priority": "high/medium/low",
                "category": "market/financial/operational/risk"
              }
            ],
            "financial_steps": [...],
            "operational_tasks": [...],
            "risk_mitigation": [...]
          }`
        }],
        temperature: 0.7,
      });

      const recommendationData = JSON.parse(response.choices[0].message.content);
      setRecommendations(recommendationData);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const CategoryIcon = ({ category }) => {
    switch (category) {
      case 'market': return <FaUsers className="text-blue-500" />;
      case 'financial': return <FaChartLine className="text-green-500" />;
      case 'operational': return <FaRocket className="text-purple-500" />;
      case 'risk': return <FaShieldAlt className="text-red-500" />;
      default: return <FaLightbulb className="text-yellow-500" />;
    }
  };

  const TimelineBadge = ({ timeline }) => (
    <span className={`px-2 py-1 text-xs rounded-full ${
      timeline === 'immediate' ? 'bg-red-100 text-red-800' :
      timeline === '30-days' ? 'bg-yellow-100 text-yellow-800' :
      timeline === '60-days' ? 'bg-green-100 text-green-800' :
      'bg-blue-100 text-blue-800'
    }`}>
      {timeline}
    </span>
  );

  if (isLoading) {
    return <div className="animate-pulse">Loading recommendations...</div>;
  }

  return (
    <div className="space-y-6">
      {Object.entries(recommendations).map(([category, items]) => (
        <div key={category} className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CategoryIcon category={category.split('_')[0]} />
            {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </h3>
          <div className="grid gap-4">
            {items.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-lg">{item.title}</h4>
                  <TimelineBadge timeline={item.timeline} />
                </div>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    item.priority === 'high' ? 'text-red-600' :
                    item.priority === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    Priority: {item.priority}
                  </span>
                  <CategoryIcon category={item.category} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;