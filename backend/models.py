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
    suggestions: list[str] = Field(..., description="A list of 1-3 broad personalized educational suggestions/insights based on the activity logs.")
    todo_list: list[str] = Field(..., description="A list of 1-3 highly actionable, concrete, short daily to-do items/tasks for tomorrow.")

class AnalyzeResponse(BaseModel):
    """Response model for a successful analysis."""
    success: bool
    data: AnalyzeData
