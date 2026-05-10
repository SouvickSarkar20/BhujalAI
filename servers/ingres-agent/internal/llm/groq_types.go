package llm

type GroqMessage struct {
	Role      string          `json:"role"`
	Content   string          `json:"content,omitempty"`
	ToolCalls []GroqToolCall  `json:"tool_calls,omitempty"`
	ToolID    string          `json:"tool_call_id,omitempty"`
}

type GroqToolCall struct {
	ID       string `json:"id"`
	Type     string `json:"type"`
	Function struct {
		Name      string `json:"name"`
		Arguments string `json:"arguments"`
	} `json:"function"`
}

type GroqRequest struct {
	Model    string         `json:"model"`
	Messages []GroqMessage  `json:"messages"`
	Tools    []ToolDefinition `json:"tools,omitempty"`
}

type GroqResponse struct {
	Choices []struct {
		Message      GroqMessage `json:"message"`
		FinishReason string      `json:"finish_reason"`
	} `json:"choices"`
}
