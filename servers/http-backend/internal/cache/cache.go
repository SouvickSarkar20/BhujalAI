package cache

import (
	"context"
	"time"
)

// Store is the interface for all cache implementations.
// By using an interface, our business logic doesn't care if it's 
// talking to Redis or local memory.
type Store interface {
	Get(ctx context.Context, key string) (string, error)
	Set(ctx context.Context, key string, value string, ttl time.Duration) error
	Delete(ctx context.Context, key string) error
}
