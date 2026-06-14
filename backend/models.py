from pydantic import BaseModel, Field

class AnalyzeRequest(BaseModel):
    """Request model for analyzing user activity input."""
    user_input: str = Field(..., max_length=500, description="User's natural language description of their day (max 500 chars).")

class CategoryBreakdown(BaseModel):
    """Breakdown of CO2 emissions by category."""
    transportation: float = Field(..., description="Estimated CO2 from transportation (kg)")
    food: float = Field(..., description="Estimated CO2 from food (kg)")
    energy: float = Field(..., description="Estimated CO2 from energy use (kg)")

class AnalyzeData(BaseModel):
    """The data payload of a successful analysis response."""
    total_co2_kg: float = Field(..., description="Total estimated CO2 equivalent emissions in kilograms")
    category_breakdown: CategoryBreakdown
    personalized_actionable_tip: str = Field(..., description="One highly personalized, actionable micro-goal to reduce footprint tomorrow based ONLY on logged data.")

class AnalyzeResponse(BaseModel):
    """Response model for a successful analysis."""
    success: bool
    data: AnalyzeData
