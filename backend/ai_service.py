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
3. Generate personalized educational suggestions/insights in the `suggestions` array.
4. Generate highly actionable, concrete, short daily to-do items/tasks in the `todo_list` array.

CRITICAL PRIORITY RULE FOR THE MICRO-GOALS (PROPORTIONAL LENGTH):
- You MUST analyze the calculated weights of the categories.
- Create suggestions and to-do tasks addressing the categories logged by the user.
- The LENGTH and DETAIL of each suggestion and to-do task MUST be strictly proportional to its emissions impact:
    * HIGHEST emitting category: Write a longer, detailed suggestion explaining the impact/systemic change (1-2 sentences), and a clear task.
    * MEDIUM emitting category (if applicable): Write a moderately sized suggestion and task.
    * LOWEST emitting category: Write a very brief, single-phrase or short single-sentence suggestion and task (quick win).
- STRICT 0.0 KG EXCLUSION FILTER: Do NOT generate a suggestion or task for any category that calculates to exactly 0.0 kg. If a category is 0.0 kg, act as if it does not exist for the micro-goals.

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
  "suggestions": ["string"],
  "todo_list": ["string"]
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