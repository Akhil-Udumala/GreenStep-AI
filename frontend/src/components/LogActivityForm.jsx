import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Loader2, Send } from 'lucide-react';

/** Unique ID for the character-count hint, linked to the textarea via aria-describedby. */
const CHAR_COUNT_ID = 'activity-input-char-count';

/**
 * A controlled textarea form that lets users describe their daily activities
 * in natural language and submit them for carbon footprint analysis.
 *
 * @param {Object}   props
 * @param {Function} props.onSubmit  - Callback invoked with the trimmed input string on submit.
 * @param {boolean}  props.isLoading - When true, disables the form while the API request is in-flight.
 */
const LogActivityForm = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed && trimmed.length <= 500) {
      onSubmit(trimmed);
    }
  };

  const isOverLimit = input.length >= 500;

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl shadow-green-900/5 border border-green-50 w-full mx-auto transform transition-all">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <label htmlFor="activity-input" className="sr-only">
          Describe your day
        </label>
        <textarea
          id="activity-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I took a 20-minute hot shower, drove 10 miles to work in a gas car, and had a chicken salad for lunch..."
          className="w-full h-40 p-5 text-gray-700 bg-gray-50/50 border border-gray-200/60 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none transition-all text-lg leading-relaxed placeholder:text-gray-400"
          maxLength={500}
          aria-label="Daily activity description"
          aria-describedby={CHAR_COUNT_ID}
          aria-invalid={isOverLimit}
          disabled={isLoading}
        />

        <div className="flex items-center justify-between mt-2">
          <span
            id={CHAR_COUNT_ID}
            className={`text-sm font-medium ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}
            aria-live="polite"
          >
            {input.length}/500 characters
          </span>

          <button
            id="calculate-footprint-btn"
            type="submit"
            disabled={isLoading || !input.trim()}
            className="group flex items-center justify-center gap-2 px-8 py-4 font-bold text-white bg-green-600 rounded-2xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-green-600/30 hover:shadow-green-600/40 text-lg"
            aria-label={isLoading ? 'Analyzing your activity, please wait' : 'Calculate carbon footprint'}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={22} className="animate-spin" aria-hidden="true" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Calculate Footprint</span>
                <Send size={20} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

LogActivityForm.propTypes = {
  /** Called with the user's trimmed activity string when the form is submitted. */
  onSubmit: PropTypes.func.isRequired,
  /** Disables the form while an API request is in-flight. */
  isLoading: PropTypes.bool.isRequired,
};

export default React.memo(LogActivityForm);
