package main

import (
	"context"
	"errors"
	"log/slog"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"

	"github.com/ingres/ingres-agent-go/internal/apierr"
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

	app := fiber.New(fiber.Config{
		AppName: "Ingres Agent Service",
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			message := "Internal Server Error"

			var e *apierr.AppError
			if errors.As(err, &e) {
				code = e.Code
				message = e.Message
			}

			slog.Error("agent error", "code", code, "message", message, "details", err.Error())
			return c.Status(code).JSON(fiber.Map{"error": message})
		},
	})
	app.Use(recover.New())
	app.Use(logger.New())

	app.Post("/agent/chat", handler.HandleAgentChat)
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	// Prepare for graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	go func() {
		slog.Info("ingres-agent starting", "port", port)
		if err := app.Listen(":" + strconv.Itoa(port)); err != nil {
			slog.Error("failed to start agent server", "error", err)
			os.Exit(1)
		}
	}()

	<-quit // Block until a signal is received
	slog.Info("shutting down ingres-agent...")

	// Create a deadline for the shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := app.ShutdownWithContext(ctx); err != nil {
		slog.Error("forced shutdown", "error", err)
	}

	slog.Info("ingres-agent stopped")
}

func getEnv(key string, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
