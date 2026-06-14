import React, { useState, useCallback } from 'react';
import LogActivityForm from './components/LogActivityForm';
import InsightsDashboard from './components/InsightsDashboard';
import { analyzeActivity } from './api/analyze';
import { Leaf } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [insightsData, setInsightsData] = useState(null);
  const [error, setError] = useState(null);

  const handleLogSubmit = useCallback(async (input) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeActivity(input);
      if (result.success && result.data) {
        setInsightsData(result.data);
      } else {
        throw new Error("Invalid response format from server.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-6">
          <Leaf className="text-green-500 mr-2" size={32} />
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            GreenStep <span className="text-green-500">AI</span>
          </h1>
        </div>
        <p className="text-lg text-gray-600">
          Track your daily activities, understand your impact, and reduce your carbon footprint with AI.
        </p>
      </div>

      <main>
        <LogActivityForm onSubmit={handleLogSubmit} isLoading={isLoading} />
        
        {error && (
          <div className="max-w-2xl mx-auto mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {insightsData && !isLoading && (
          <InsightsDashboard data={insightsData} />
        )}
      </main>
    </div>
  );
}

export default App;
