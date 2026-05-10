package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/ingres/ingres-agent-go/internal/prompts"
	apitypes "github.com/ingres/ingres-agent-go/internal/types"
)

func (p *GroqProvider) GetBusinessDataInterpretation(ctx context.Context, userQuery string) (*apitypes.GetBusinessDataResult, error) {
	if p.apiKey == "" {
		return nil, fmt.Errorf("groq api key not set")
	}

	fullURL := p.baseURL + "/chat/completions"
	reqBody := map[string]interface{}{
		"model": p.model,
		"messages": []map[string]string{
			{"role": "user", "content": prompts.GetBusinessDataPrompt + "\n\nUser Query: " + userQuery},
		},
		"response_format": map[string]string{"type": "json_object"},
	}

	body, _ := json.Marshal(reqBody)
	httpReq, _ := http.NewRequest("POST", fullURL, bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+p.apiKey)

	client := http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	var gResp GroqResponse
	if err := json.Unmarshal(respBody, &gResp); err != nil {
		return nil, err
	}

	if len(gResp.Choices) == 0 {
		return nil, fmt.Errorf("no choice returned from groq")
	}

	outputText := gResp.Choices[0].Message.Content
	var interpretation apitypes.GetBusinessDataInterpretation
	if err := json.Unmarshal([]byte(outputText), &interpretation); err != nil {
		return nil, fmt.Errorf("failed to parse groq response: %w", err)
	}

	return &apitypes.GetBusinessDataResult{
		Interpretation: interpretation,
		Data:           nil,
	}, nil
}

func (p *GroqProvider) GetMapBusinessDataInterpretation(ctx context.Context, userQuery string) (*apitypes.GetMapBusinessDataInterpretation, error) {
	if p.apiKey == "" {
		return nil, fmt.Errorf("groq api key not set")
	}

	fullURL := p.baseURL + "/chat/completions"
	reqBody := map[string]interface{}{
		"model": p.model,
		"messages": []map[string]string{
			{"role": "user", "content": prompts.MapBusinessDataPrompt + "\n\nUser Query: \"" + userQuery + "\"\n\nReturn only the JSON response as per the format."},
		},
		"response_format": map[string]string{"type": "json_object"},
	}

	body, _ := json.Marshal(reqBody)
	httpReq, _ := http.NewRequest("POST", fullURL, bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+p.apiKey)

	client := http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	var gResp GroqResponse
	if err := json.Unmarshal(respBody, &gResp); err != nil {
		return nil, err
	}

	if len(gResp.Choices) == 0 {
		return nil, fmt.Errorf("no choice returned from groq")
	}

	outputText := gResp.Choices[0].Message.Content
	var interpretation apitypes.GetMapBusinessDataInterpretation
	if err := json.Unmarshal([]byte(outputText), &interpretation); err != nil {
		return nil, fmt.Errorf("failed to parse map interpretation json: %w", err)
	}

	return &interpretation, nil
}
