package apierr

import (
	"fmt"
)

// AppError is a custom error type that carries an HTTP status code
// and a user-friendly message, along with the underlying error.
type AppError struct {
	Code    int    `json:"-"`       // HTTP status code
	Message string `json:"error"`   // User-facing message
	Err     error  `json:"-"`       // Internal error cause
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

func (e *AppError) Unwrap() error {
	return e.Err
}

// New creates a new AppError
func New(code int, message string, err error) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Err:     err,
	}
}

// Sentinel errors for common cases
var (
	ErrNotFound     = &AppError{Code: 404, Message: "Resource not found"}
	ErrBadRequest   = &AppError{Code: 400, Message: "Invalid request"}
	ErrUnauthorized = &AppError{Code: 401, Message: "Unauthorized"}
	ErrInternal     = &AppError{Code: 500, Message: "Internal server error"}
	ErrBadGateway   = &AppError{Code: 502, Message: "Upstream service error"}
)
