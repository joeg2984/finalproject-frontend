import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import Autocomplete from './Autocomplete';
import EvaluationTabs from './EvaluationTabs';
import SuccessAnimation from './SuccessAnimation';

const Evaluation = () => {
  const [businessIdea, setBusinessIdea] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [knownLocations, setKnownLocations] = useState([]);
  const [knownBusinessIdeas, setKnownBusinessIdeas] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const [showSuccess, setShowSuccess] = useState(false);


  useEffect(() => {
    console.log("API URL:", API_URL);

    const fetchData = async () => {
      console.log("Fetching initial data...");
      try {
        const [locationsRes, ideasRes] = await Promise.all([
          axios.get(`${API_URL}/locations`),
          axios.get(`${API_URL}/business-ideas`),
        ]);
        console.log("Locations response:", locationsRes.data);
        console.log("Business Ideas response:", ideasRes.data);
        setKnownLocations(Array.isArray(locationsRes.data) ? locationsRes.data : []);
        setKnownBusinessIdeas(Array.isArray(ideasRes.data) ? ideasRes.data : []);
      } catch (err) {
        console.error("Error Details:", {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          config: err.config,
        });
        let errorMessage;
    if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please try again.';
    } else if (!err.response) {
      errorMessage = 'Network error. Please check your connection.';
    } else {
      switch (err.response.status) {
        case 400:
          errorMessage = 'Invalid request. Please check your inputs.';
          break;
        case 404:
          errorMessage = 'Service not found. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = err.response?.data?.detail || 'Something went wrong. Please try again.';
      }
    }
    }
  };

    fetchData();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Business Idea:", businessIdea);
    console.log("Location:", location);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Sending POST request to evaluate");
      console.log("Request payload:", {
        business_idea: businessIdea,
        location: location,
      });
            const response = await axios.post(`${API_URL}/evaluate`, {
        business_idea: businessIdea,
        location: location,
      });
      console.log("Evaluation response:", response.data);
      setResult(response.data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error("Error during evaluation:", err);
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      console.log("Loading state:", loading);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-md w-full p-6 bg-white shadow-xl rounded-lg">
        <div className="mb-6 flex justify-center">
          <img 
            src="/src/assets/logo.png" 
            alt="Company Logo" 
            className="w-[500px] h-[188px] object-contain"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="businessIdea" className="block text-sm font-medium text-gray-700">
            Business Idea:
          </label>
          <Autocomplete
            inputProps={{
              id: 'businessIdea',
              name: 'businessIdea',
              required: true,
              className: `
                mt-1 block w-full p-3 
                border-2 border-transparent 
                bg-gradient-to-br from-purple-50 to-indigo-50 
                rounded-xl shadow-lg 
                focus:outline-none 
                focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 
                transition-all duration-300 ease-in-out 
                hover:shadow-xl hover:scale-[1.02]
                text-gray-800 
                placeholder-gray-500 
                placeholder-opacity-70
              `,
              placeholder: 'Enter your business idea',
            }}
            items={knownBusinessIdeas}
            value={businessIdea}
            onSelect={(val) => {
              console.log("Selected Business Idea:", val);
              setBusinessIdea(val);
            }}
          />
        </div>
      
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location:
          </label>
          <Autocomplete
            inputProps={{
              id: 'location',
              name: 'location',
              required: true,
              className: `
                mt-1 block w-full p-3 
                border-2 border-transparent 
                bg-gradient-to-br from-blue-50 to-teal-50 
                rounded-xl shadow-lg 
                focus:outline-none 
                focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 
                transition-all duration-300 ease-in-out 
                hover:shadow-xl hover:scale-[1.02]
                text-gray-800 
                placeholder-gray-500 
                placeholder-opacity-70
              `,
              placeholder: 'Enter a location',
            }}
            items={knownLocations}
            value={location}
            onSelect={(val) => {
              console.log("Selected Location:", val);
              setLocation(val);
            }}
          />
        </div>
      
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Evaluating...
              </>
            ) : (
              'Evaluate'
            )}
          </button>
        </div>
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
        <SuccessAnimation show={showSuccess} />

      </div>
  );
};

export default Evaluation;
