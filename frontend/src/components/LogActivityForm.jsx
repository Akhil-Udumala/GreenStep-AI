import React, { useState } from 'react';
import { Leaf, Loader2, Send } from 'lucide-react';

const LogActivityForm = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && input.length <= 500) {
      onSubmit(input);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl shadow-green-900/5 border border-green-50 w-full mx-auto transform transition-all">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="activity-input" className="sr-only">Describe your day</label>
        <textarea
          id="activity-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I took a 20-minute hot shower, drove 10 miles to work in a gas car, and had a chicken salad for lunch..."
          className="w-full h-40 p-5 text-gray-700 bg-gray-50/50 border border-gray-200/60 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none transition-all text-lg leading-relaxed placeholder:text-gray-400"
          maxLength={500}
          aria-label="Daily activity description"
          disabled={isLoading}
        />
        
        <div className="flex items-center justify-between mt-2">
          <span className={`text-sm font-medium ${input.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
            {input.length}/500
          </span>
          
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="group flex items-center justify-center gap-2 px-8 py-4 font-bold text-white bg-green-600 rounded-2xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-green-600/30 hover:shadow-green-600/40 text-lg"
            aria-label="Calculate Footprint"
          >
            {isLoading ? (
              <>
                <Loader2 size={22} className="animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Calculate Footprint</span>
                <Send size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogActivityForm;
