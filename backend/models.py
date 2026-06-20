"""
Pydantic data models for the GreenStep AI API.

Defines request/response schemas with strict validation to ensure
data integrity and prevent invalid or malicious payloads.
"""

from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    """Request model for analyzing user activity input."""

    user_input: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="User's natural language description of their day (1–500 chars).",
    )


class CategoryBreakdown(BaseModel):
    """Breakdown of CO2 emissions by category."""

    transportation: float = Field(
        ..., ge=0, description="Estimated CO2 from transportation (kg)"
    )
    food: float = Field(..., ge=0, description="Estimated CO2 from food (kg)")
    energy: float = Field(..., ge=0, description="Estimated CO2 from energy use (kg)")


class ActionPlanItem(BaseModel):
    """A single item in the AI-generated action plan."""

    category: str = Field(
        ..., description="The emission category (transportation, food, or energy)"
    )
    suggestion: str = Field(..., description="An educational insight for the category")
    todo_item: str = Field(
        ..., description="A short, concrete daily task to reduce emissions"
    )


class AnalyzeData(BaseModel):
    """The data payload of a successful analysis response."""

    total_co2_kg: float = Field(
        ..., ge=0, description="Total estimated CO2 equivalent emissions in kilograms"
    )
    category_breakdown: CategoryBreakdown
    suggestions: list[str] = Field(
        ...,
        description="A list of 1–3 broad personalized educational suggestions based on the activity logs.",
    )
    todo_list: list[str] = Field(
        ...,
        description="A list of 1–3 highly actionable, concrete, short daily to-do items for tomorrow.",
    )


class AnalyzeResponse(BaseModel):
    """Response model for a successful analysis."""

    success: bool
    data: AnalyzeData
