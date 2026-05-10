package handler

import (
	"context"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/ingres/ingres-agent-go/internal/llm"
	"github.com/ingres/ingres-agent-go/internal/types"
)

func HandleAgentChat(c *fiber.Ctx) error {
	var req types.AgentRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid payload"})
	}

	if req.Question == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "question missing"})
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
	ctx := context.Background()
	p := llm.GetProvider()
	answer, state, err := p.HandleUserQuery(ctx, req.Question, chatHistory)
	if err != nil {

		fmt.Printf("error from llm: %v\n", err)
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"error": "agent processing failed", "details": err.Error()})
	}

	return c.JSON(types.AgentResponse{
		Reply:  answer,
		Answer: answer,
		State:  state,
	})
}
