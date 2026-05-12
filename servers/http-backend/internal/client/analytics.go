package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ingres/http-backend-go/internal/config"
	"github.com/ingres/http-backend-go/internal/httpclient"
)

type AnalyticsRequest struct {
	Location string `json:"location" validate:"required"`
	Year     string `json:"year,omitempty"`
	View     string `json:"view,omitempty"`
	LocUUID  string `json:"locuuid,omitempty"`
}

func CallAnalyticsService(cfg config.Config, path string, req AnalyticsRequest) (map[string]interface{}, error) {
	payload, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("%s/analyze/%s", cfg.AnalyticsServiceURL, path)
	httpReq, err := http.NewRequest("POST", url, bytes.NewReader(payload))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := httpclient.Default.Do(httpReq)
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

func FetchLocations(cfg config.Config) (map[string]interface{}, error) {
	url := fmt.Sprintf("%s/analyze/locations", cfg.AnalyticsServiceURL)
	resp, err := httpclient.Default.Get(url)
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
