import React, { useState } from 'react';
import { Leaf, Loader2 } from 'lucide-react';

const LogActivityForm = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && input.length <= 500) {
      onSubmit(input);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-100 max-w-2xl w-full mx-auto transform transition-all hover:shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-green-100 rounded-full text-green-600">
          <Leaf size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Log Your Day</h2>
          <p className="text-sm text-gray-500">Describe your meals, commute, and energy usage.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I took a 20-minute hot shower, drove 10 miles to work in a gas car, and had a chicken salad for lunch..."
          className="w-full h-32 p-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none transition-all"
          maxLength={500}
          aria-label="Daily activity description"
          disabled={isLoading}
        />
        
        <div className="flex items-center justify-between">
          <span className={`text-xs ${input.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
            {input.length}/500
          </span>
          
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
            aria-label="Calculate Footprint"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              'Calculate Footprint'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogActivityForm;
