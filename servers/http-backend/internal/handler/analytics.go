package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ingres/http-backend-go/internal/client"
	"github.com/ingres/http-backend-go/internal/config"
)

func GetAnalyticsForLocation(cfg config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req client.AnalyticsRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid payload"})
		}
		
		if req.Location == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "location is required"})
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

		return c.JSON(fiber.Map{
			"status": "success",
			"location": req.Location,
			"analytics": fiber.Map{
				"stress":      stressRes["analysis"],
				"consumption": consumptionRes["analysis"],
				"recharge":    rechargeRes["analysis"],
				"disparity":   disparityRes["analysis"],
			},
		})
	}
}

func GetLocations(c *fiber.Ctx) error {
	res, err := client.FetchLocations()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to fetch locations"})
	}

	return c.JSON(res)
}
