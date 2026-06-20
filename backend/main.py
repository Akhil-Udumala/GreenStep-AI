"""
FastAPI application entry point for GreenStep AI.

Exposes REST endpoints for analyzing daily activity descriptions
and returning estimated carbon footprint data.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler  # pyrefly: ignore[missing-import]
from slowapi.errors import RateLimitExceeded  # pyrefly: ignore[missing-import]
from slowapi.util import get_remote_address  # pyrefly: ignore[missing-import]

from ai_service import analyze_activity
from models import AnalyzeData, AnalyzeRequest, AnalyzeResponse

# ---------------------------------------------------------------------------
# Rate limiter — prevents abuse; 10 requests/minute per IP
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address, default_limits=["10/minute"])

app = FastAPI(
    title="GreenStep AI API",
    description=(
        "Analyzes natural language descriptions of daily activities and returns "
        "estimated CO₂ equivalent emissions broken down by transportation, food, "
        "and energy, along with personalized reduction micro-goals."
    ),
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://green-step-ai-sigma.vercel.app",
    "https://green-step-ai-two.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/")
def read_root():
    """Root endpoint returning a welcome message."""
    return {"message": "GreenStep AI API is running"}


@app.get("/health")
def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy"}


@app.get("/api/analyze")
def analyze_endpoint_info():
    """Information endpoint for GET requests on /api/analyze.
    
    Returns a friendly message clarifying that this route requires a POST request.
    """
    return {
        "message": "To analyze activity, please send a POST request containing a JSON body with the 'user_input' key."
    }


@app.post("/api/analyze", response_model=AnalyzeResponse)
@limiter.limit("10/minute")
async def analyze_endpoint(request: Request, body: AnalyzeRequest):
    """Analyze a user's daily activity and return CO₂ footprint estimation.

    Args:
        request: The raw FastAPI request (required by slowapi for rate limiting).
        body: Validated request body containing the user's activity description.

    Returns:
        ``AnalyzeResponse`` with ``success=True`` and the analysis payload.

    Raises:
        HTTPException 422: If ``user_input`` is blank.
        HTTPException 500: If the AI service fails to produce a valid response.
    """
    user_input = body.user_input.strip()
    if not user_input:
        raise HTTPException(status_code=422, detail="User input cannot be empty.")

    try:
        data: AnalyzeData = await analyze_activity(user_input)
        return AnalyzeResponse(success=True, data=data)
    except Exception:
        # Intentionally do not expose internal error details to the client
        raise HTTPException(
            status_code=500,
            detail="An error occurred while analyzing your activity. Please try again.",
        )
