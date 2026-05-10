package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/ingres/ingres-agent-go/internal/prompts"
	apitypes "github.com/ingres/ingres-agent-go/internal/types"
	"github.com/ingres/ingres-agent-go/internal/utils"
)

type GroqProvider struct {
	apiKey  string
	model   string
	baseURL string
}

func NewGroqProvider() *GroqProvider {
	model := os.Getenv("GROQ_MODEL")
	if model == "" {
		model = "openai/gpt-oss-120b"
	}
	baseURL := os.Getenv("GROQ_BASE_URL")
	if baseURL == "" {
		baseURL = "https://api.groq.com/openai/v1"
	}
	return &GroqProvider{
		apiKey:  os.Getenv("GROQ_API_KEY"),
		model:   model,
		baseURL: baseURL,
	}
}

func (p *GroqProvider) HandleUserQuery(ctx context.Context, userQuery string, previousChats []apitypes.ChatMessage) (string, bool, error) {
	if p.apiKey == "" {
		return "Groq API key not set", false, nil
	}

	messages := []GroqMessage{
		{Role: "system", Content: prompts.SystemInstruction},
	}

	for _, m := range previousChats {
		role := m.Role
		if role == "BOT" || role == "model" || role == "assistant" {
			role = "assistant"
		} else {
			role = "user"
		}
		messages = append(messages, GroqMessage{Role: role, Content: m.Content})
	}
	messages = append(messages, GroqMessage{Role: "user", Content: userQuery})

	return p.callWithTools(ctx, userQuery, messages)
}

func (p *GroqProvider) callWithTools(ctx context.Context, userQuery string, messages []GroqMessage) (string, bool, error) {
	fullURL := p.baseURL + "/chat/completions"
	
	for i := 0; i < 5; i++ { // Max 5 iterations for tool calls
		reqBody := GroqRequest{
			Model:    p.model,
			Messages: messages,
			Tools:    GetToolsSchema(),
		}

		body, _ := json.Marshal(reqBody)
		httpReq, _ := http.NewRequest("POST", fullURL, bytes.NewReader(body))
		httpReq.Header.Set("Content-Type", "application/json")
		httpReq.Header.Set("Authorization", "Bearer "+p.apiKey)

		client := http.Client{Timeout: 60 * time.Second}
		resp, err := client.Do(httpReq)
		if err != nil {
			return "", false, err
		}
		
		respBody, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			fmt.Printf("Groq API error (status %d): %s\n", resp.StatusCode, string(respBody))
			return "", false, fmt.Errorf("groq api error: %s", string(respBody))
		}

		var gResp GroqResponse
		if err := json.Unmarshal(respBody, &gResp); err != nil {
			fmt.Printf("Groq parse error: %v\nResponse: %s\n", err, string(respBody))
			return "", false, fmt.Errorf("failed to parse groq response: %s", string(respBody))
		}


		if len(gResp.Choices) == 0 {
			return "", false, fmt.Errorf("no choice returned from groq")
		}

		msg := gResp.Choices[0].Message
		messages = append(messages, msg)

		if gResp.Choices[0].FinishReason == "tool_calls" {
			for _, tc := range msg.ToolCalls {
				var resultStr string
				if tc.Function.Name == "research" {
					var args map[string]interface{}
					json.Unmarshal([]byte(tc.Function.Arguments), &args)
					loc, _ := args["location"].(string)
					state := utils.IsIndianState(loc)

					fmt.Printf("🔍 Groq requested research with args: %v\n", tc.Function.Arguments)
					researchResult, err := ExecuteResearchFlow(ctx, p, userQuery, loc, state)
					if err != nil {
						resultStr = fmt.Sprintf("Error: %v", err)
					} else {
						resultBytes, _ := json.Marshal(researchResult)
						resultStr = string(resultBytes)
					}
				} else {
					result, err := ExecuteTool(tc.Function.Name, tc.Function.Arguments)
					if err != nil {
						resultStr = fmt.Sprintf("Error: %v", err)
					} else {
						resultStr = result
					}
				}

				messages = append(messages, GroqMessage{
					Role:    "tool",
					ToolID:  tc.ID,
					Content: resultStr,
				})
			}
			continue // Go for another round
		}

		return msg.Content, false, nil
	}

	return "", false, fmt.Errorf("too many tool calls")
}
