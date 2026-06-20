"""
Tests for the GreenStep AI FastAPI backend.

Covers input validation, edge cases, mocked success paths,
and infrastructure endpoints.
"""

from unittest.mock import AsyncMock, patch

import pytest


# ---------------------------------------------------------------------------
# Infrastructure endpoints
# ---------------------------------------------------------------------------


def test_root_endpoint(client):
    """GET / should return a 200 OK with a welcome message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "GreenStep AI API is running"}


def test_health_check(client):
    """GET /health should return 200 OK with status=healthy."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


# ---------------------------------------------------------------------------
# Input validation — /api/analyze
# ---------------------------------------------------------------------------


def test_analyze_endpoint_empty_string(client):
    """POST /api/analyze with an empty string should return 422."""
    response = client.post("/api/analyze", json={"user_input": ""})
    assert response.status_code == 422


def test_analyze_endpoint_whitespace_only(client):
    """POST /api/analyze with whitespace-only input should return 422."""
    response = client.post("/api/analyze", json={"user_input": "   "})
    assert response.status_code == 422


def test_analyze_endpoint_exceeds_length(client):
    """POST /api/analyze with input > 500 chars should return 422."""
    long_input = "a" * 501
    response = client.post("/api/analyze", json={"user_input": long_input})
    assert response.status_code == 422


def test_analyze_endpoint_missing_field(client):
    """POST /api/analyze with missing user_input field should return 422."""
    response = client.post("/api/analyze", json={})
    assert response.status_code == 422


# ---------------------------------------------------------------------------
# Happy path — mocked AI service
# ---------------------------------------------------------------------------


@patch("main.analyze_activity", new_callable=AsyncMock)
def test_analyze_endpoint_success(mock_analyze, client, mock_analyze_data):
    """POST /api/analyze with valid input and a mocked AI service should return 200."""
    mock_analyze.return_value = mock_analyze_data

    response = client.post(
        "/api/analyze", json={"user_input": "I drove to work and had a salad."}
    )
    assert response.status_code == 200

    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["total_co2_kg"] == pytest.approx(4.5)
    assert json_data["data"]["category_breakdown"]["transportation"] == pytest.approx(2.1)
    assert len(json_data["data"]["action_plan"]) == 1
    assert json_data["data"]["action_plan"][0]["category"] == "transportation"


@patch("main.analyze_activity", new_callable=AsyncMock)
def test_analyze_endpoint_ai_failure_returns_500(mock_analyze, client):
    """POST /api/analyze should return 500 without leaking internal error details."""
    mock_analyze.side_effect = RuntimeError("Gemini API timed out")

    response = client.post(
        "/api/analyze", json={"user_input": "I drove 10 miles to work."}
    )
    assert response.status_code == 500
    # Internal error message must NOT be exposed
    assert "Gemini" not in response.json().get("detail", "")


def test_analyze_endpoint_get(client):
    """GET /api/analyze should return a friendly response informing user to use POST."""
    response = client.get("/api/analyze")
    assert response.status_code == 200
    assert "POST" in response.json()["message"]
