package handler

import (
	"encoding/json"
	"log/slog"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/ingres/http-backend-go/internal/apierr"
	"github.com/ingres/http-backend-go/internal/cache"
	"github.com/ingres/http-backend-go/internal/client"
	"github.com/ingres/http-backend-go/internal/config"
	"github.com/ingres/http-backend-go/internal/validator"
)

func GetAnalyticsForLocation(cfg config.Config, cacheStore cache.Store) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req client.AnalyticsRequest
		if err := c.BodyParser(&req); err != nil {
			return apierr.New(400, "Invalid payload", err)
		}
		
		// Validation step
		if err := validator.Validate.Struct(req); err != nil {
			return apierr.New(400, validator.FormatValidationError(err), err)
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
			return apierr.New(502, "Failed to fetch stress analysis", err)
		}

		consumptionRes, err := client.CallAnalyticsService("consumption", req)
		if err != nil {
			return apierr.New(502, "Failed to fetch consumption analysis", err)
		}

		rechargeRes, err := client.CallAnalyticsService("recharge", req)
		if err != nil {
			return apierr.New(502, "Failed to fetch recharge analysis", err)
		}

		disparityRes, err := client.CallAnalyticsService("disparity", req)
		if err != nil {
			return apierr.New(502, "Failed to fetch disparity analysis", err)
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
			return apierr.New(502, "Failed to fetch locations from upstream", err)
		}

		// 3. Save to Cache (longer TTL for locations since they rarely change)
		if data, err := json.Marshal(res); err == nil {
			_ = cacheStore.Set(c.Context(), cacheKey, string(data), 24*time.Hour)
		}

		return c.JSON(res)
	}
}
