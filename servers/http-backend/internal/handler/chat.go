package handler

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/ingres/http-backend-go/internal/client"
	"github.com/ingres/http-backend-go/internal/config"
	"github.com/ingres/http-backend-go/internal/models"
)

type chatWithAgentRequest struct {
	ChatID   string `json:"chatId"`
	Question string `json:"question"`
}

func GetAllChats(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("userID").(string)
		var chats []models.Chat
		if err := db.Where("user_id = ?", userID).Order("updated_at desc").Find(&chats).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch chats"})
		}
		return c.JSON(chats)
	}
}

func GetMessages(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("userID").(string)
		chatID := c.Params("chatId")

		var chat models.Chat
		if err := db.Where("id = ? AND user_id = ?", chatID, userID).First(&chat).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "chat not found or access denied"})
		}

		var messages []models.Message
		if err := db.Where("chat_id = ?", chatID).Order("created_at asc").Find(&messages).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch messages"})
		}
		return c.JSON(messages)
	}
}

func ChatWithAgent(db *gorm.DB, cfg config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("userID").(string)
		var req chatWithAgentRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid payload"})
		}
		if req.Question == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "question required"})
		}

		title := req.Question
		if len(title) > 50 {
			title = title[:47] + "..."
		}

		chat := models.Chat{UserID: userID, Title: title}
		if req.ChatID != "" {
			if err := db.Where("id = ? AND user_id = ?", req.ChatID, userID).First(&chat).Error; err != nil {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "chat not found"})
			}
		} else {
			if err := db.Create(&chat).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to create chat"})
			}
		}

		// create user message
		userMsg := models.Message{ChatID: chat.ID, Content: req.Question, Sender: models.SenderUser}
		if err := db.Create(&userMsg).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to save user message"})
		}

		// load last messages
		var history []models.Message
		db.Where("chat_id = ?", chat.ID).Order("created_at asc").Find(&history)

		agentReq := client.AgentRequest{
			UserID:   userID,
			ChatID:   chat.ID,
			Question: req.Question,
			Messages: func() []client.AgentMessage {
				arr := make([]client.AgentMessage, 0, len(history))
				for _, m := range history {
					arr = append(arr, client.AgentMessage{Sender: m.Sender, Content: m.Content})
				}
				return arr
			}(),
		}

		agentResp, err := client.CallAgentService(cfg, agentReq)
		if err != nil {
			return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"error": "agent call failed", "details": err.Error()})
		}

		botMsg := models.Message{ChatID: chat.ID, Content: agentResp.Answer, Sender: models.SenderBot}
		if err := db.Create(&botMsg).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to save bot message"})
		}

		return c.JSON(fiber.Map{
			"chatId":   chat.ID,
			"question": req.Question,
			"answer":   agentResp.Answer,
			"state":    agentResp.State,
		})
	}
}

func DeleteChat(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("userID").(string)
		chatID := c.Params("chatId")

		var chat models.Chat
		if err := db.Where("id = ? AND user_id = ?", chatID, userID).First(&chat).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "chat not found or access denied"})
		}

		if err := db.Select("Messages").Delete(&chat).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to delete chat"})
		}

		return c.SendStatus(fiber.StatusNoContent)
	}
}
