package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

)

type AnalyticsRequest struct {
	Location string `json:"location"`
	Year     string `json:"year,omitempty"`
	View     string `json:"view,omitempty"`
	LocUUID  string `json:"locuuid,omitempty"`
}

func CallAnalyticsService(path string, req AnalyticsRequest) (map[string]interface{}, error) {
	payload, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	// Assuming Python service runs on localhost:8000
	url := fmt.Sprintf("http://localhost:8000/analyze/%s", path)
	httpReq, err := http.NewRequest("POST", url, bytes.NewReader(payload))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")

	client := http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("analytics service returned %d", resp.StatusCode)
	}

	var ar map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&ar); err != nil {
		return nil, err
	}
	return ar, nil
}

func FetchLocations() (map[string]interface{}, error) {
	url := "http://localhost:8000/analyze/locations"
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("analytics service returned %d", resp.StatusCode)
	}

	var ar map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&ar); err != nil {
		return nil, err
	}
	return ar, nil
}
