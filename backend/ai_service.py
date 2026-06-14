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
3. Generate personalized actionable tips formatted as a single string containing bullet points.

CRITICAL PRIORITY RULE FOR THE MICRO-GOALS (PROPORTIONAL LENGTH):
- You MUST analyze the calculated weights of the categories.
- Create a bulleted list addressing the categories logged by the user.
- The LENGTH and DETAIL of each bullet point MUST be strictly proportional to its emissions impact:
    * HIGHEST emitting category: Write a long, detailed, multi-sentence bullet point explaining the impact and providing a comprehensive reduction strategy (e.g., offset strategies, systemic changes).
    * MEDIUM emitting category (if applicable): Write a moderately sized, 1-2 sentence bullet point with a practical swap or tip.
    * LOWEST emitting category: Write a very brief, single-phrase or short single-sentence tip (a quick win).
- Format this list into a single string using newline characters and dashes (e.g., "- First long tip\n- Second short tip").
- STRICT 0.0 KG EXCLUSION FILTER: Do NOT generate a bullet point, tip, or praise for any category that calculates to exactly 0.0 kg. If a category is 0.0 kg, act as if it does not exist for the micro-goals.

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
  "personalized_actionable_tip": "string"
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