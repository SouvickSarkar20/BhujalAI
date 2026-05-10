package middleware

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/storage/redis/v3"
	"github.com/ingres/http-backend-go/internal/config"
)

// NewAuthLimiter prevents brute-force attacks on signup/login.
func NewAuthLimiter(cfg config.Config) fiber.Handler {
	store := redis.New(redis.Config{
		URL: cfg.RedisURL,
	})

	return limiter.New(limiter.Config{
		Max:        5,               // 5 requests
		Expiration: 1 * time.Minute, // per 1 minute
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP() + "_auth" // Rate limit per IP for auth
		},
		Storage: store,
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Too many attempts. Please try again later.",
			})
		},
	})
}

// NewApiLimiter prevents abuse of AI and Analytics endpoints.
func NewApiLimiter(cfg config.Config) fiber.Handler {
	store := redis.New(redis.Config{
		URL: cfg.RedisURL,
	})

	return limiter.New(limiter.Config{
		Max:        20,              // 20 requests
		Expiration: 1 * time.Minute, // per 1 minute
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP() + "_api"
		},
		Storage: store,
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "API rate limit exceeded. Slow down!",
			})
		},
	})
}
