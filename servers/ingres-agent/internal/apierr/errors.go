package apierr

import (
	"fmt"
)

type AppError struct {
	Code    int    `json:"-"`
	Message string `json:"error"`
	Err     error  `json:"-"`
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

func New(code int, message string, err error) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Err:     err,
	}
}

var (
	ErrNotFound     = &AppError{Code: 404, Message: "Resource not found"}
	ErrBadRequest   = &AppError{Code: 400, Message: "Invalid request"}
	ErrInternal     = &AppError{Code: 500, Message: "Internal server error"}
	ErrBadGateway   = &AppError{Code: 502, Message: "LLM or upstream service error"}
)
