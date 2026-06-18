from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app

client = TestClient(app)

def test_analyze_endpoint_empty_payload():
    """Test that the API returns 422 for empty payload."""
    response = client.post("/api/analyze", json={"user_input": ""})
    assert response.status_code == 422

def test_analyze_endpoint_exceeds_length():
    """Test that the API returns 422 for exceeding char limit."""
    long_input = "a" * 501
    response = client.post("/api/analyze", json={"user_input": long_input})
    assert response.status_code == 422

@patch("main.analyze_activity")
def test_analyze_endpoint_success(mock_analyze):
    """Test successful API mock."""
    from models import AnalyzeData, CategoryBreakdown
    
    mock_data = AnalyzeData(
        total_co2_kg=4.5,
        category_breakdown=CategoryBreakdown(
            transportation=2.1,
            food=1.5,
            energy=0.9
        ),
        suggestions=["Consider using public transit to lower your emissions."],
        todo_list=["Take the bus to work tomorrow."]
    )
    mock_analyze.return_value = mock_data
    
    response = client.post("/api/analyze", json={"user_input": "I drove to work and had a salad."})
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["total_co2_kg"] == 4.5
