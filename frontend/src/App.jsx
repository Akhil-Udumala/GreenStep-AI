import React, { useState, useCallback, useRef } from 'react';
import LogActivityForm from './components/LogActivityForm';
import InsightsDashboard from './components/InsightsDashboard';
import { analyzeActivity } from './api/analyze';
import { Leaf } from 'lucide-react';

const slowSmoothScrollTo = (element, duration = 1200) => {
  if (!element) return;
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 48; // offset matching scroll-mt-12
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetPosition);
    }
  };

  requestAnimationFrame(animation);
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [insightsData, setInsightsData] = useState(null);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

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
      // Silently ignore aborted requests (user re-submitted before previous finished)
      if (err.name === 'AbortError') return;
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      // Wait for React to finish rendering the results component
      setTimeout(() => {
        if (resultsRef.current) {
          slowSmoothScrollTo(resultsRef.current, 1200);
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-green-200">

      {/* 1. The Hero Section (Above the Fold) */}
      <header className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm border border-green-50 mb-8 transform hover:scale-105 transition-transform">
          <Leaf className="text-green-600 mr-2" size={50} />
          <span className="text-3xl font-extrabold tracking-tight text-gray-900">
            GreenStep <span className="text-green-500">AI</span>
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
          Track your daily activities, <br className="hidden md:block" />
          understand your impact, <br className="hidden md:block" />
          and <span className="text-green-600">reduce your carbon footprint</span> with AI.
        </h1>
        <p className="text-lg md:text-xl text-gray-500 font-medium">
          Simply type in what you did today. We handle the math.
        </p>
      </header>

      {/* 2. The Interactive Core (The Hook) */}
      <main className="max-w-3xl mx-auto flex flex-col items-center">
        <section className="w-full relative z-10" aria-label="Log Daily Activity">
          <LogActivityForm onSubmit={handleLogSubmit} isLoading={isLoading} />
        </section>

        {error && (
          <div className="w-full max-w-2xl mt-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* 3 & 4. The Dynamic Results (Scroll/Reveal) and Actionable Takeaways */}
        <section ref={resultsRef} className="w-full mt-6 relative z-0 scroll-mt-12" aria-label="Carbon Footprint Results">
          {(isLoading || insightsData) && (
            <InsightsDashboard data={insightsData} isLoading={isLoading} />
          )}
        </section>
      </main>

    </div>
  );
}

export default App;
