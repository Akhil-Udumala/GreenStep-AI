"""
Shared pytest fixtures for the GreenStep AI test suite.
"""

import pytest
from fastapi.testclient import TestClient

from main import app
from models import ActionPlanItem, AnalyzeData, CategoryBreakdown


@pytest.fixture
def client():
    """Return a synchronous FastAPI TestClient."""
    return TestClient(app)


@pytest.fixture
def mock_analyze_data():
    """Return a valid AnalyzeData instance for use in mocked tests."""
    return AnalyzeData(
        total_co2_kg=4.5,
        category_breakdown=CategoryBreakdown(
            transportation=2.1,
            food=1.5,
            energy=0.9,
        ),
        action_plan=[
            ActionPlanItem(
                category="transportation",
                suggestion="Consider using public transit to lower your emissions.",
                todo_item="Take the bus to work tomorrow.",
            ),
        ],
    )
