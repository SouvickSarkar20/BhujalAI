package router

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/ingres/http-backend-go/internal/cache"
	"github.com/ingres/http-backend-go/internal/config"
	"github.com/ingres/http-backend-go/internal/handler"
	"github.com/ingres/http-backend-go/internal/middleware"
)

func SetupRoutes(app *fiber.App, dbConn *gorm.DB, cfg config.Config, cacheStore cache.Store) {
	api := app.Group("/api")

	// Auth routes (Strict Rate Limit)
	auth := api.Group("/auth")
	auth.Use(middleware.NewAuthLimiter(cfg))
	auth.Post("/signup", handler.Signup(dbConn, cfg))
	auth.Post("/signin", handler.Signin(dbConn, cfg))

	// Chat routes (General API Rate Limit)
	api.Use(middleware.NewApiLimiter(cfg))
	chat := api.Group("/chat")
	chat.Use(middleware.RequireAuth(cfg))
	chat.Get("/all", handler.GetAllChats(dbConn))
	chat.Get("/:chatId/messages", handler.GetMessages(dbConn))
	chat.Delete("/:chatId", handler.DeleteChat(dbConn))
	chat.Post("/chat-with-agent", handler.ChatWithAgent(dbConn, cfg))

	// User routes
	userGroup := api.Group("/user")
	userGroup.Use(middleware.RequireAuth(cfg))
	userGroup.Get("/me", handler.GetCurrentUser(dbConn))

	// Analytics routes
	analytics := api.Group("/analytics")
	analytics.Get("/locations", handler.GetLocations(cacheStore))

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"status":  "ok",
			"service": "http-backend",
			"app":     "BhujalAI",
		})
	})

	// Protected routes
	protected := analytics.Group("/")
	protected.Use(middleware.RequireAuth(cfg))
	protected.Post("/query", handler.GetAnalyticsForLocation(cfg, cacheStore))
}
