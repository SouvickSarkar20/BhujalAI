package handler

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/ingres/http-backend-go/internal/apierr"
	"github.com/ingres/http-backend-go/internal/config"
	"github.com/ingres/http-backend-go/internal/models"
	"github.com/ingres/http-backend-go/internal/validator"
)


// Removed local request types, using models package instead

func Signup(db *gorm.DB, cfg config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.SignupRequest
		if err := c.BodyParser(&req); err != nil {
			return apierr.New(400, "Invalid payload", err)
		}

		// Validation step
		if err := validator.Validate.Struct(req); err != nil {
			return apierr.New(400, validator.FormatValidationError(err), err)
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return apierr.New(500, "Password hash failed", err)
		}
 
		user := models.User{Name: req.Name, Email: req.Email, Password: string(hash)}
		if err := db.Create(&user).Error; err != nil {
			return apierr.New(400, "Email already in use", err)
		}
 
		expiry := time.Now().Add(cfg.JWTExpiry)
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": user.ID,
			"exp":     expiry.Unix(),
		})
		tokenString, err := token.SignedString([]byte(cfg.JWTSecret))
		if err != nil {
			return apierr.New(500, "Token creation failed", err)
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"token": tokenString,
			"user": fiber.Map{
				"id":    user.ID,
				"email": user.Email,
				"name":  user.Name,
			},
		})
	}
}
 
func Signin(db *gorm.DB, cfg config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.SigninRequest
		if err := c.BodyParser(&req); err != nil {
			return apierr.New(400, "Invalid payload", err)
		}

		// Validation step
		if err := validator.Validate.Struct(req); err != nil {
			return apierr.New(400, validator.FormatValidationError(err), err)
		}
 
		var user models.User
		if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
			return apierr.ErrUnauthorized
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			return apierr.ErrUnauthorized
		}

		expiry := time.Now().Add(cfg.JWTExpiry)
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": user.ID,
			"exp":     expiry.Unix(),
		})
		tokenString, err := token.SignedString([]byte(cfg.JWTSecret))
		if err != nil {
			return apierr.New(500, "Token creation failed", err)
		}

		return c.JSON(fiber.Map{"token": tokenString, "user": fiber.Map{"id": user.ID, "name": user.Name, "email": user.Email}})
	}
}
