package handler

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/ingres/http-backend-go/internal/config"
	"github.com/ingres/http-backend-go/internal/models"
	"github.com/ingres/http-backend-go/internal/validator"
)


// Removed local request types, using models package instead

func Signup(db *gorm.DB, cfg config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.SignupRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid payload"})
		}

		// Validation step
		if err := validator.Validate.Struct(req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": validator.FormatValidationError(err),
			})
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "password hash failed"})
		}
 
		user := models.User{Name: req.Name, Email: req.Email, Password: string(hash)}
		if err := db.Create(&user).Error; err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "user creation failed", "details": err.Error()})
		}
 
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": user.ID, "email": user.Email, "name": user.Name})
	}
}
 
func Signin(db *gorm.DB, cfg config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.SigninRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid payload"})
		}

		// Validation step
		if err := validator.Validate.Struct(req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": validator.FormatValidationError(err),
			})
		}
 
		var user models.User
		if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {

			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid credentials"})
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid credentials"})
		}

		expiry := time.Now().Add(cfg.JWTExpiry)
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": user.ID,
			"exp":     expiry.Unix(),
		})
		tokenString, err := token.SignedString([]byte(cfg.JWTSecret))
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "token creation failed"})
		}

		return c.JSON(fiber.Map{"token": tokenString, "user": fiber.Map{"id": user.ID, "name": user.Name, "email": user.Email}})
	}
}
