package main

import (
	"log"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"

	"github.com/ingres/ingres-agent-go/internal/handler"
)

func main() {
	// Try loading local .env first, then fallback to root .env
	_ = godotenv.Load(".env")
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("Note: root .env not found, using local or system env")
	}


	port := 9000
	if p, err := strconv.Atoi(getEnv("AGENT_SERVICE_PORT", "9000")); err == nil {
		port = p
	}

	app := fiber.New(fiber.Config{AppName: "Ingres Agent Service"})
	app.Use(recover.New())
	app.Use(logger.New())

	app.Post("/agent/chat", handler.HandleAgentChat)
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	log.Printf("ingres-agent service listening on %d", port)
	if err := app.Listen(":" + strconv.Itoa(port)); err != nil {
		log.Fatalf("failed to start agent server: %v", err)
	}
}

func getEnv(key string, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
