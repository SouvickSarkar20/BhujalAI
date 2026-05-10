package llm

import (
	"encoding/json"
	"fmt"
)

type ToolDefinition struct {
	Type     string `json:"type"`
	Function struct {
		Name        string          `json:"name"`
		Description string          `json:"description,omitempty"`
		Parameters  json.RawMessage `json:"parameters,omitempty"`
	} `json:"function"`
}

func GetToolsSchema() []ToolDefinition {
	return []ToolDefinition{
		{
			Type: "function",
			Function: struct {
				Name        string          `json:"name"`
				Description string          `json:"description,omitempty"`
				Parameters  json.RawMessage `json:"parameters,omitempty"`
			}{
				Name:        "research",
				Description: "Do research for a specific location if a new location is mentioned.",
				Parameters: json.RawMessage(`{
					"type": "object",
					"properties": {
						"location": { "type": "string" },
						"state": { "type": "boolean" },
						"previousChats": { 
							"type": "array", 
							"items": { "type": "string" }
						},
						"userQuery": { "type": "string" }
					},
					"required": ["location", "state", "previousChats", "userQuery"]
				}`),
			},
		},
	}
}

func GetGeminiToolsSchema() []GeminiTool {
	params := map[string]interface{}{
		"type": "OBJECT",
		"properties": map[string]interface{}{
			"location":      map[string]interface{}{"type": "STRING"},
			"state":         map[string]interface{}{"type": "BOOLEAN"},
			"previousChats": map[string]interface{}{"type": "ARRAY", "items": map[string]interface{}{"type": "STRING"}},
			"userQuery":     map[string]interface{}{"type": "STRING"},
		},
	}
	paramsJSON, _ := json.Marshal(params)

	return []GeminiTool{
		{
			FunctionDeclarations: []GeminiFunctionDeclaration{
				{
					Name:        "research",
					Description: "Do research for a specific location if a new location is mentioned.",
					Parameters:  paramsJSON,
				},
			},
		},
	}
}

func ExecuteTool(name string, arguments string) (string, error) {
	return "", fmt.Errorf("tool not found: %s", name)
}
