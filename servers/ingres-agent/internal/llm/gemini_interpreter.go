package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/ingres/ingres-agent-go/internal/prompts"
	apitypes "github.com/ingres/ingres-agent-go/internal/types"
)

func (p *GeminiProvider) GetBusinessDataInterpretation(ctx context.Context, userQuery string) (*apitypes.GetBusinessDataResult, error) {
	if p.apiKey == "" {
		return nil, fmt.Errorf("gemini api key not set")
	}

	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=%s", p.apiKey)

	req := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"role": "user",
				"parts": []map[string]string{
					{"text": prompts.GetBusinessDataPrompt + "\n\nUser Query: " + userQuery},
				},
			},
		},
		"generationConfig": map[string]string{
			"responseMimeType": "application/json",
		},
	}

	body, _ := json.Marshal(req)
	httpReq, _ := http.NewRequest("POST", url, bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")

	client := http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	var gResp GeminiResponse
	if err := json.Unmarshal(respBody, &gResp); err != nil {
		return nil, err
	}

	outputText := ""
	if len(gResp.Candidates) > 0 && len(gResp.Candidates[0].Content.Parts) > 0 {
		outputText = gResp.Candidates[0].Content.Parts[0].Text
	}

	outputText = strings.TrimPrefix(outputText, "```json\n")
	outputText = strings.TrimSuffix(outputText, "\n```")

	var interpretation apitypes.GetBusinessDataInterpretation
	if err := json.Unmarshal([]byte(outputText), &interpretation); err != nil {
		return nil, fmt.Errorf("failed to parse gemini response: %w", err)
	}

	return &apitypes.GetBusinessDataResult{
		Interpretation: interpretation,
		Data:           nil,
	}, nil
}

func (p *GeminiProvider) GetMapBusinessDataInterpretation(ctx context.Context, userQuery string) (*apitypes.GetMapBusinessDataInterpretation, error) {
	if p.apiKey == "" {
		return nil, fmt.Errorf("gemini api key not set")
	}

	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=%s", p.apiKey)

	req := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"role": "user",
				"parts": []map[string]string{
					{"text": prompts.MapBusinessDataPrompt + "\n\nUser Query: \"" + userQuery + "\"\n\nReturn only the JSON response as per the format."},
				},
			},
		},
		"generationConfig": map[string]string{
			"responseMimeType": "application/json",
		},
	}

	body, _ := json.Marshal(req)
	httpReq, _ := http.NewRequest("POST", url, bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")

	client := http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	var gResp GeminiResponse
	if err := json.Unmarshal(respBody, &gResp); err != nil {
		return nil, err
	}

	outputText := ""
	if len(gResp.Candidates) > 0 && len(gResp.Candidates[0].Content.Parts) > 0 {
		outputText = gResp.Candidates[0].Content.Parts[0].Text
	}

	outputText = strings.TrimPrefix(outputText, "```json\n")
	outputText = strings.TrimSuffix(outputText, "\n```")

	var interpretation apitypes.GetMapBusinessDataInterpretation
	if err := json.Unmarshal([]byte(outputText), &interpretation); err != nil {
		return nil, fmt.Errorf("failed to parse map interpretation json: %w", err)
	}

	return &interpretation, nil
}
