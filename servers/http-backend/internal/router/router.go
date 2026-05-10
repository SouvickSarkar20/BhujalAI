package router

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/ingres/http-backend-go/internal/config"
	"github.com/ingres/http-backend-go/internal/handler"
	"github.com/ingres/http-backend-go/internal/middleware"
)

func SetupRoutes(app *fiber.App, dbConn *gorm.DB, cfg config.Config) {
	api := app.Group("/api")

	// Auth routes
	auth := api.Group("/auth")
	auth.Post("/signup", handler.Signup(dbConn, cfg))
	auth.Post("/signin", handler.Signin(dbConn, cfg))

	// Chat routes
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
	analytics.Get("/locations", handler.GetLocations)

	// Protected routes
	protected := analytics.Group("/")
	protected.Use(middleware.RequireAuth(cfg))
	protected.Post("/analyze", handler.GetAnalyticsForLocation(cfg))
}
