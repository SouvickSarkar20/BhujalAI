package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	HTTPBackendPort int
	AgentServiceURL string
	DBHost          string
	DBPort          int
	DBUser          string
	DBPassword      string
	DBName          string
	DatabaseURL     string

	JWTSecret      string
	JWTExpiry      time.Duration
	OpenAIKey      string
	IngresAPIURL   string
	IngresAPIKey   string
	AllowedOrigins string
}

func getEnv(key string, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return fallback
}

func LoadConfig() Config {
	httpPort := 9001
	if p, err := strconv.Atoi(getEnv("HTTP_BACKEND_PORT", "9001")); err == nil {
		httpPort = p
	}

	dbPort := 5432
	if p, err := strconv.Atoi(getEnv("DB_PORT", "5432")); err == nil {
		dbPort = p
	}

	jwtHours := 168
	if p, err := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "168")); err == nil {
		jwtHours = p
	}

	return Config{
		HTTPBackendPort: httpPort,
		AgentServiceURL: getEnv("AGENT_SERVICE_URL", "http://localhost:9000"),
		DBHost:          getEnv("DB_HOST", "localhost"),
		DBPort:          dbPort,
		DBUser:          getEnv("DB_USER", "postgres"),
		DBPassword:      getEnv("DB_PASS", "password"),
		DBName:          getEnv("DB_NAME", "ingres"),
		DatabaseURL:     getEnv("DATABASE_URL", ""),

		JWTSecret:      getEnv("JWT_SECRET", "secret"),
		JWTExpiry:      time.Duration(jwtHours) * time.Hour,
		OpenAIKey:      getEnv("OPENAI_API_KEY", ""),
		IngresAPIURL:   getEnv("INGRES_API_URL", "https://ingres.iith.ac.in/api/gec/getBusinessDataForUserOpen"),
		IngresAPIKey:   getEnv("INGRES_API_KEY", ""),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:5173, https://ingres-agent.space, http://ingres-agent.space, https://www.ingres-agent.space, http://localhost:3000"),
	}
}
