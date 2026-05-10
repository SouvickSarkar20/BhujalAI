package llm

import (
	"context"
	"os"

	apitypes "github.com/ingres/ingres-agent-go/internal/types"
)

type Provider interface {
	HandleUserQuery(ctx context.Context, userQuery string, previousChats []apitypes.ChatMessage) (string, bool, error)
	GetBusinessDataInterpretation(ctx context.Context, userQuery string) (*apitypes.GetBusinessDataResult, error)
	GetMapBusinessDataInterpretation(ctx context.Context, userQuery string) (*apitypes.GetMapBusinessDataInterpretation, error)
}

var currentProvider Provider

func GetProvider() Provider {
	if currentProvider != nil {
		return currentProvider
	}

	providerType := os.Getenv("LLM_PROVIDER")
	if providerType == "" {
		providerType = "gemini"
	}

	switch providerType {
	case "groq":
		currentProvider = NewGroqProvider()
	default:
		currentProvider = NewGeminiProvider()
	}
	return currentProvider
}
