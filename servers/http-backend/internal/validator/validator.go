package validator

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

// Validate is a global validator instance
var Validate = validator.New()

// FormatValidationError converts validator errors into a human-readable string.
func FormatValidationError(err error) string {
	if err == nil {
		return ""
	}

	if ve, ok := err.(validator.ValidationErrors); ok {
		var errMsgs []string
		for _, fe := range ve {
			switch fe.Tag() {
			case "required":
				errMsgs = append(errMsgs, fmt.Sprintf("%s is required", fe.Field()))
			case "email":
				errMsgs = append(errMsgs, fmt.Sprintf("%s must be a valid email", fe.Field()))
			case "min":
				errMsgs = append(errMsgs, fmt.Sprintf("%s must be at least %s characters", fe.Field(), fe.Param()))
			case "max":
				errMsgs = append(errMsgs, fmt.Sprintf("%s must be at most %s characters", fe.Field(), fe.Param()))
			default:
				errMsgs = append(errMsgs, fmt.Sprintf("%s failed validation on %s", fe.Field(), fe.Tag()))
			}
		}
		return strings.Join(errMsgs, ", ")
	}

	return err.Error()
}
