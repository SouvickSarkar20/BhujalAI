package main

import (
	"log"
	"log/slog"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"

	"github.com/ingres/ingres-agent-go/internal/handler"
)

func main() {
	// Initialize structured logger
	loggerOpts := &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}
	baseLogger := slog.New(slog.NewJSONHandler(os.Stdout, loggerOpts))
	slog.SetDefault(baseLogger)

	// Try loading local .env first, then fallback to root .env
	_ = godotenv.Load(".env")
	if err := godotenv.Load("../../.env"); err != nil {
		slog.Warn("Note: root .env not found, using local or system env")
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
	slog.Info("ingres-agent starting", "port", port)
	if err := app.Listen(":" + strconv.Itoa(port)); err != nil {
		slog.Error("failed to start agent server", "error", err)
		os.Exit(1)
	}
}

func getEnv(key string, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
