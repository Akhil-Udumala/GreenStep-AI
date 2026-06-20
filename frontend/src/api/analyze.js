/**
 * API client for the GreenStep AI backend.
 *
 * Wraps the `/api/analyze` endpoint with automatic in-flight request
 * cancellation (via `AbortController`) and a hard 30-second timeout
 * to prevent the UI from hanging indefinitely on slow responses.
 *
 * @module analyze
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.API_BASE_URL ||
  'http://localhost:8000';

/** Timeout in milliseconds before a pending request is aborted. */
const REQUEST_TIMEOUT_MS = 30_000;

/** Tracks the most recently issued AbortController so stale requests can be cancelled. */
let activeController = null;

/**
 * Send a user's activity description to the backend for CO₂ analysis.
 *
 * If a previous request is still in-flight when this function is called,
 * it is aborted before the new request is issued.
 *
 * @param {string} userInput - Plain-text description of the user's daily activities.
 * @returns {Promise<{success: boolean, data: object}>} The parsed JSON response from the backend.
 * @throws {Error} If the network request fails, the server returns a non-2xx status,
 *                 or the request exceeds `REQUEST_TIMEOUT_MS`.
 */
export const analyzeActivity = async (userInput) => {
  // Cancel any in-flight request before starting a new one
  if (activeController) {
    activeController.abort();
  }

  activeController = new AbortController();
  const { signal } = activeController;

  // Attach a hard timeout so the UI never hangs indefinitely
  const timeoutId = setTimeout(() => activeController.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_input: userInput }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to analyze activity.');
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
    // Clear the active controller once the request settles
    activeController = null;
  }
};
