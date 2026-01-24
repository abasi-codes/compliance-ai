def test_health_endpoint(client):
    """Test that the health endpoint returns a healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "healthy"


def test_health_endpoint_response_format(client):
    """Test that the health endpoint returns the expected fields."""
    response = client.get("/health")
    data = response.json()
    assert "status" in data
    assert "database" in data
