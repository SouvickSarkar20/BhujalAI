package main

import (
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"github.com/joho/godotenv"

	"github.com/ingres/http-backend-go/internal/config"
	"github.com/ingres/http-backend-go/internal/db"
	"github.com/ingres/http-backend-go/internal/models"
	"github.com/ingres/http-backend-go/internal/router"
)

func main() {

	_ = godotenv.Load(".env")
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("Note: root .env not found, using local or system env")
	}

	cfg := config.LoadConfig()
	if cfg.AgentServiceURL == "http://localhost:9000" {
		cfg.AgentServiceURL = DefaultAgentURL
	}

	dbConn := db.Connect(cfg)
	if err := dbConn.AutoMigrate(&models.User{}, &models.Chat{}, &models.Message{}); err != nil {
		log.Fatalf("failed migration: %v", err)
	}

	app := fiber.New(fiber.Config{AppName: "Ingres HTTP Backend"})
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.AllowedOrigins,
		AllowCredentials: true,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization, X-Requested-With",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
	}))

	router.SetupRoutes(app, dbConn, cfg)

	port := strconv.Itoa(cfg.HTTPBackendPort)
	log.Printf("http-backend listening on %s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
