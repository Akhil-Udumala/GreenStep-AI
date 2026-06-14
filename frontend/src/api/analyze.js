let activeController = null;

export const analyzeActivity = async (userInput) => {
  // Cancel any in-flight request before starting a new one
  if (activeController) {
    activeController.abort();
  }
  activeController = new AbortController();

  try {
    const response = await fetch("http://localhost:8000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_input: userInput }),
      signal: activeController.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to analyze activity.");
    }

    return response.json();
  } finally {
    // Clear the active controller once the request settles
    activeController = null;
  }
};
