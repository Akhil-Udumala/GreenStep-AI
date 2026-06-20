"""
AI service module for GreenStep AI.

Manages the Gemini API client lifecycle and provides the core
`analyze_activity` coroutine used by the FastAPI endpoint.
The client is initialized once at module load time to avoid
per-request overhead.
"""

import json
import os

# pyrefly: ignore[missing-import]
from dotenv import load_dotenv
from google import genai
from google.genai import types

from models import AnalyzeData

load_dotenv()

# ---------------------------------------------------------------------------
# Client & configuration — initialized once at module load time
# ---------------------------------------------------------------------------
_api_key = os.getenv("GEMINI_API_KEY")
if not _api_key:
    raise RuntimeError("GEMINI_API_KEY environment variable not set")

_client = genai.Client(api_key=_api_key)

# ---------------------------------------------------------------------------
# System prompt
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """You are an expert environmental data analyst specializing in carbon accounting. Your task is to analyze the user's natural language description of their daily activities, estimate their carbon footprint, and provide strategic reduction goals.

INSTRUCTIONS:
1. Identify all activities related to transportation, diet, and energy use.
2. Estimate the CO2 equivalent emissions in kilograms (kg) for each category based on standard environmental benchmarks. 
3. Generate personalized environmental insights and matching, highly actionable daily tasks.

CRITICAL PRIORITY RULE FOR THE MICRO-GOALS (PROPORTIONAL WEIGHT & LENGTH):
- You MUST analyze the calculated weights of the categories.
- STRICT 0.0 KG EXCLUSION FILTER: Do NOT generate an object for any category that calculates to exactly 0.0 kg. If a category is 0.0 kg, skip it entirely.
- For remaining categories greater than 0.0 kg, the detail of the text MUST be strictly proportional to its emissions impact:
    * HIGHEST emitting category: Provide a highly detailed, comprehensive insight explaining the systemic impact (2 sentences) and a concrete, immediate task.
    * MEDIUM emitting category: Provide a moderately sized, practical insight (1 sentence) and a simple task.
    * LOWEST emitting category: Provide a very brief, single-phrase insight and a quick-win task.

FORMAT RESTRICTION:
- You must respond ONLY with a raw, valid JSON object. 
- Do NOT wrap the response in markdown code blocks, backticks (e.g., do not use ```json), or include any conversational prefaces or suffixes. 

JSON SCHEMA:
{
  "total_co2_kg": float,
  "category_breakdown": {
    "transportation": float,
    "food": float,
    "energy": float
  },
  "action_plan": [
    {
      "category": "string (transportation, food, or energy)",
      "suggestion": "string (the educational insight)",
      "todo_item": "string (the short, concrete task to complete)"
    }
  ]
}"""

# Maximum tokens to prevent runaway API responses
_MAX_OUTPUT_TOKENS = 1024

# Single model — confirmed working in production
_MODEL = "gemini-3.1-flash-lite"


async def analyze_activity(user_input: str) -> AnalyzeData:
    """Analyze the user's daily activity and return an estimated CO2 breakdown.

    Uses the shared async Gemini client initialized at module load time for
    maximum performance — no per-request client instantiation overhead.

    Args:
        user_input: A plain-text description of the user's daily activities.

    Returns:
        An ``AnalyzeData`` instance containing the total CO2 estimate,
        per-category breakdown, and an action plan.

    Raises:
        ValueError: If ``user_input`` is empty after stripping whitespace.
        RuntimeError: If the Gemini response cannot be parsed into the expected schema.
    """
    if not user_input or not user_input.strip():
        raise ValueError("user_input must not be empty.")

    _generate_config = types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        temperature=0.0,  # Enforces deterministic math calculations
        response_mime_type="application/json",
        response_schema=AnalyzeData.model_json_schema(),
        max_output_tokens=_MAX_OUTPUT_TOKENS,
    )

    response = await _client.aio.models.generate_content(
        model=_MODEL,
        contents=user_input,
        config=_generate_config,
    )

    try:
        if response.parsed:
            return AnalyzeData.model_validate(response.parsed)
        data_dict = json.loads(response.text)
        return AnalyzeData(**data_dict)
    except Exception as e:
        raise RuntimeError(
            f"Failed to parse Gemini response: {response.text}"
        ) from e