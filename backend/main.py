from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import AnalyzeRequest, AnalyzeResponse, AnalyzeData
from ai_service import analyze_activity

app = FastAPI(title="GreenStep AI Backend")

# Allow requests from local React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    """
    Simple health check endpoint.
    """
    return {"status": "healthy"}

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_endpoint(request: AnalyzeRequest):
    """
    Analyzes user input and returns CO2 footprint estimation.
    """
    user_input = request.user_input.strip()
    if not user_input:
        raise HTTPException(status_code=422, detail="User input cannot be empty.")
        
    try:
        data: AnalyzeData = await analyze_activity(user_input)
        return AnalyzeResponse(success=True, data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
