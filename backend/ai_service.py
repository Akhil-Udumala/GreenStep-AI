import os
import json
from google import genai
from google.genai import types
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
from models import AnalyzeData

load_dotenv()

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
- Do NOT generate a bullet point or tip for any category that calculates to 0.0 kg. Only address the categories explicitly logged by the user.

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
    """Analyzes the user activity and returns the estimated CO2 breakdown."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set")

    client = genai.Client(api_key=api_key)
    
    # We use generate_content_async to not block
    response = await client.aio.models.generate_content(
        model='gemini-3.1-flash-lite',
        contents=user_input,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.0,  # Enforces deterministic math calculations
            response_mime_type="application/json",
            # We enforce structure using response_schema
            response_schema=AnalyzeData.model_json_schema()
        ),
    )
    
    # Parse the response text as JSON
    try:
        data_dict = json.loads(response.text)
        return AnalyzeData(**data_dict)
    except Exception as e:
        raise RuntimeError(f"Failed to parse Gemini response: {response.text}") from e