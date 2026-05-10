package handler

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/ingres/ingres-agent-go/internal/apierr"
	"github.com/ingres/ingres-agent-go/internal/cache"
	"github.com/ingres/ingres-agent-go/internal/llm"
	"github.com/ingres/ingres-agent-go/internal/types"
	"github.com/ingres/ingres-agent-go/internal/validator"
)

func HandleAgentChat(cacheStore cache.Store) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req types.AgentRequest
		if err := c.BodyParser(&req); err != nil {
			return apierr.New(400, "Invalid payload", err)
		}

		// Validation step
		if err := validator.Validate.Struct(req); err != nil {
			return apierr.New(400, validator.FormatValidationError(err), err)
		}

		// Cache Lookup
		cacheKey := "ai_resp:" + req.Question
		if cached, err := cacheStore.Get(c.Context(), cacheKey); err == nil {
			return c.JSON(types.AgentResponse{
				Reply:  cached,
				Answer: cached,
				State:  true,
			})
		}

		// Convert agent message history to chat format for LLM
		chatHistory := make([]types.ChatMessage, 0, len(req.Messages))
		for _, msg := range req.Messages {
			role := "user"
			if msg.Sender == "BOT" {
				role = "assistant"
			}
			chatHistory = append(chatHistory, types.ChatMessage{
				Role:    role,
				Content: msg.Content,
			})
		}

		// Call LLM with full orchestration
		p := llm.GetProvider()
		answer, state, err := p.HandleUserQuery(c.Context(), req.Question, chatHistory)
		if err != nil {
			return apierr.New(502, "AI Agent processing failed", err)
		}

		// Store in cache for 1 hour
		_ = cacheStore.Set(c.Context(), cacheKey, answer, 1*time.Hour)

		return c.JSON(types.AgentResponse{
			Reply:  answer,
			Answer: answer,
			State:  state,
		})
	}
}
