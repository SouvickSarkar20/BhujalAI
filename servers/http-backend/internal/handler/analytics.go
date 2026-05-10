package handler

import (
	"encoding/json"
	"log/slog"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/ingres/http-backend-go/internal/cache"
	"github.com/ingres/http-backend-go/internal/client"
	"github.com/ingres/http-backend-go/internal/config"
)

func GetAnalyticsForLocation(cfg config.Config, cacheStore cache.Store) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req client.AnalyticsRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid payload"})
		}
		
		if req.Location == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "location is required"})
		}

		// Check Cache First
		cacheKey := "analytics:" + req.Location
		if cached, err := cacheStore.Get(c.Context(), cacheKey); err == nil {
			var res map[string]interface{}
			if json.Unmarshal([]byte(cached), &res) == nil {
				slog.Info("serving analytics from cache", "location", req.Location)
				return c.JSON(res)
			}
		}

		// Call all python endpoints
		stressRes, err := client.CallAnalyticsService("stress", req)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch stress analysis"})
		}

		consumptionRes, err := client.CallAnalyticsService("consumption", req)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch consumption analysis"})
		}

		rechargeRes, err := client.CallAnalyticsService("recharge", req)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch recharge analysis"})
		}

		disparityRes, err := client.CallAnalyticsService("disparity", req)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch disparity analysis"})
		}

		finalRes := fiber.Map{
			"status": "success",
			"location": req.Location,
			"analytics": fiber.Map{
				"stress":      stressRes["analysis"],
				"consumption": consumptionRes["analysis"],
				"recharge":    rechargeRes["analysis"],
				"disparity":   disparityRes["analysis"],
			},
		}

		// Store in Cache for 1 Hour
		if data, err := json.Marshal(finalRes); err == nil {
			_ = cacheStore.Set(c.Context(), cacheKey, string(data), 1*time.Hour)
		}

		return c.JSON(finalRes)
	}
}

func GetLocations(cacheStore cache.Store) fiber.Handler {
	return func(c *fiber.Ctx) error {
		cacheKey := "locations:all"
		
		// 1. Try Cache
		if cached, err := cacheStore.Get(c.Context(), cacheKey); err == nil {
			var res map[string]interface{}
			if json.Unmarshal([]byte(cached), &res) == nil {
				return c.JSON(res)
			}
		}

		// 2. Fetch from Python Service
		res, err := client.FetchLocations()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch locations"})
		}

		// 3. Save to Cache (longer TTL for locations since they rarely change)
		if data, err := json.Marshal(res); err == nil {
			_ = cacheStore.Set(c.Context(), cacheKey, string(data), 24*time.Hour)
		}

		return c.JSON(res)
	}
}
