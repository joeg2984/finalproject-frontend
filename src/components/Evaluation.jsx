import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import Autocomplete from './Autocomplete';
import EvaluationTabs from './EvaluationTabs';

const Evaluation = () => {
  const [businessIdea, setBusinessIdea] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [knownLocations, setKnownLocations] = useState([]);
  const [knownBusinessIdeas, setKnownBusinessIdeas] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    console.log("API URL:", API_URL);

  const fetchData = async () => {
      try {
        const [locationsRes, ideasRes] = await Promise.all([
          axios.get(`${API_URL}/locations`),
          axios.get(`${API_URL}/business-ideas`),
        ]);
        setKnownLocations(Array.isArray(locationsRes.data) ? locationsRes.data : []);
        setKnownBusinessIdeas(Array.isArray(ideasRes.data) ? ideasRes.data : []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to fetch initial data. Please try again later.");
      }
    };

    fetchData();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/evaluate`, {
        business_idea: businessIdea,
        location: location,
      });
      console.log('Response received:', response.data);
      setResult(response.data);
    } catch (err) {
      console.error('Error during evaluation:', err);
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Business Idea Evaluator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="businessIdea" className="block text-sm font-medium text-gray-700">
            Business Idea:
          </label>
          <Autocomplete
            inputProps={{
              id: 'businessIdea',
              name: 'businessIdea',
              required: true,
              className:
                'mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
              placeholder: 'Enter your business idea',
            }}
            items={knownBusinessIdeas}
            value={businessIdea}
            onSelect={(val) => setBusinessIdea(val)}
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location:
          </label>
          <Autocomplete
            inputProps={{
              id: 'location',
              name: 'location',
              required: true,
              className:
                'mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
              placeholder: 'Enter a location',
            }}
            items={knownLocations}
            value={location}
            onSelect={(val) => setLocation(val)}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
          disabled={loading}>
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Evaluating...
            </>
          ) : (
            'Evaluate'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
          <button
            onClick={handleSubmit}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            Retry
          </button>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 border border-gray-200 rounded-md shadow-sm bg-white">
          <EvaluationTabs result={result} />
        </div>
      )}
    </div>
  );
};

export default Evaluation;


