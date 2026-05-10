package data

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type FetchGetBusinessDataInput struct {
	Location          string
	RequestedDataType []string
	Year              *string
}

func FetchGetBusinessData(input FetchGetBusinessDataInput) (interface{}, error) {
	viewType := "admin"
	if len(input.RequestedDataType) > 0 && input.RequestedDataType[0] != "" {
		viewType = strings.ToLower(input.RequestedDataType[0])
	}

	currentYear := time.Now().Year()
	var yearString string
	if input.Year != nil && *input.Year != "" {
		y, err := strconv.Atoi(*input.Year)
		if err == nil {
			yearString = fmt.Sprintf("%d-%d", y, y+1)
		} else {
			yearString = fmt.Sprintf("%d-%d", currentYear-1, currentYear)
		}
	} else {
		yearString = fmt.Sprintf("%d-%d", currentYear-1, currentYear)
	}

	payload := map[string]interface{}{
		"parentLocName":      "INDIA",
		"locname":            "INDIA",
		"loctype":            "COUNTRY",
		"view":               viewType,
		"locuuid":            "ffce954d-24e1-494b-ba7e-0931d8ad6085",
		"year":               yearString,
		"computationType":    "normal",
		"component":          "recharge",
		"period":             "annual",
		"category":           "safe",
		"mapOnClickParams":   "false",
		"verificationStatus": 1,
		"approvalLevel":      1,
		"parentuuid":         "ffce954d-24e1-494b-ba7e-0931d8ad6085",
		"stateuuid":          nil,
	}

	fmt.Printf("📡 Fetching %s data for %s (%s)...\n", strings.ToUpper(viewType), input.Location, yearString)

	payloadBytes, _ := json.Marshal(payload)
	resp, err := http.Post("https://ingres.iith.ac.in/api/gec/getBusinessDataForUserOpen", "application/json", bytes.NewReader(payloadBytes))
	if err != nil {
		return nil, fmt.Errorf("failed to fetch business data: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("bad status code: %d", resp.StatusCode)
	}

	var dataList []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&dataList); err != nil {
		return nil, fmt.Errorf("failed to decode response: %v", err)
	}

	searchLoc := strings.ToLower(strings.TrimSpace(input.Location))
	for _, item := range dataList {
		locName, ok := item["locationName"].(string)
		if ok && strings.ToLower(locName) == searchLoc {
			return item, nil
		}
	}

	fmt.Printf("⚠️ No matching location found for \"%s\"\n", input.Location)
	return map[string]interface{}{
		"message": fmt.Sprintf("No data found for %s", input.Location),
		"data":    nil,
	}, nil
}
