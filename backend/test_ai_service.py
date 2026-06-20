"""
Tests for ai_service.py.

Verifies the analysis of activities, proper parsing of gemini API results, 
and correct error handling when user input is invalid or the API fails.
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from models import AnalyzeData
from ai_service import analyze_activity, _response_cache


@pytest.fixture(autouse=True)
def clear_cache():
    """Clear the response cache before every test."""
    _response_cache.clear()


@pytest.fixture
def mock_gemini_response():
    """Fixture returning a properly mocked Gemini API response."""
    mock_resp = MagicMock()
    mock_resp.parsed = {
        "total_co2_kg": 4.5,
        "category_breakdown": {
            "transportation": 2.1,
            "food": 1.4,
            "energy": 1.0
        },
        "action_plan": [
            {
                "category": "transportation",
                "suggestion": "Reduce driving.",
                "todo_item": "Walk to work."
            }
        ]
    }
    return mock_resp


@pytest.mark.asyncio
async def test_analyze_activity_empty_input():
    """Test that analyze_activity raises ValueError on empty input."""
    with pytest.raises(ValueError, match="user_input must not be empty"):
        await analyze_activity("   ")


@pytest.mark.asyncio
@patch("ai_service._client.aio.models.generate_content", new_callable=AsyncMock)
async def test_analyze_activity_success(mock_generate, mock_gemini_response):
    """Test the happy path where AI correctly analyzes the data."""
    mock_generate.return_value = mock_gemini_response

    result = await analyze_activity("I drove my car today.")
    
    assert isinstance(result, AnalyzeData)
    assert result.total_co2_kg == 4.5
    assert result.category_breakdown.transportation == 2.1
    assert len(result.action_plan) == 1
    mock_generate.assert_called_once()


@pytest.mark.asyncio
@patch("ai_service._client.aio.models.generate_content", new_callable=AsyncMock)
async def test_analyze_activity_caching(mock_generate, mock_gemini_response):
    """Test that subsequent identical requests return cached results without calling the API."""
    mock_generate.return_value = mock_gemini_response

    input_text = "I rode my bike."
    result1 = await analyze_activity(input_text)
    result2 = await analyze_activity(input_text.upper())  # Should hit cache

    assert result1 == result2
    # The API should only have been called once despite two function calls
    mock_generate.assert_called_once()


@pytest.mark.asyncio
@patch("ai_service._client.aio.models.generate_content", new_callable=AsyncMock)
async def test_analyze_activity_api_failure(mock_generate):
    """Test that an API failure raises a RuntimeError."""
    mock_generate.side_effect = Exception("API connection error")

    with pytest.raises(RuntimeError, match="Failed to communicate with the Gemini API"):
        await analyze_activity("test input")


@pytest.mark.asyncio
@patch("ai_service._client.aio.models.generate_content", new_callable=AsyncMock)
async def test_analyze_activity_invalid_json_fallback(mock_generate):
    """Test fallback to JSON parsing when 'parsed' object is empty."""
    mock_resp = MagicMock()
    mock_resp.parsed = None
    mock_resp.text = '{"total_co2_kg": 1.0, "category_breakdown": {"transportation": 1.0, "food": 0.0, "energy": 0.0}, "action_plan": []}'
    mock_generate.return_value = mock_resp

    result = await analyze_activity("test input")
    assert result.total_co2_kg == 1.0
