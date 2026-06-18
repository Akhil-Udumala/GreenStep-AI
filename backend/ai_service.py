import os
from google import genai
from google.genai import types
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
from models import AnalyzeData

load_dotenv()

# Initialize client once at module load time — avoids re-creating on every request
_api_key = os.getenv("GEMINI_API_KEY")
if not _api_key:
    raise RuntimeError("GEMINI_API_KEY environment variable not set")

_client = genai.Client(api_key=_api_key)
_GENERATE_CONFIG = types.GenerateContentConfig(
    system_instruction=None,  # set per-call below
    temperature=0.0,
    response_mime_type="application/json",
)

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

async def analyze_activity(user_input: str) -> AnalyzeData:
    """Analyzes the user activity and returns the estimated CO2 breakdown.
    
    Uses the shared async Gemini client initialized at module load time for
    maximum performance — no per-request client instantiation overhead.
    """
    response = await _client.aio.models.generate_content(
        model='gemini-3.1-flash-lite',
        contents=user_input,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.0,  # Enforces deterministic math calculations
            response_mime_type="application/json",
            response_schema=AnalyzeData.model_json_schema(),
        ),
    )


    try:
        if response.parsed:
            return AnalyzeData(**response.parsed)
        import json
        data_dict = json.loads(response.text)
        return AnalyzeData(**data_dict)
    except Exception as e:
        raise RuntimeError(f"Failed to parse Gemini response: {response.text}") from e