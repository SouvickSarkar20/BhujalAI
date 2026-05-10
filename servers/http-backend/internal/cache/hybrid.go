package cache

import (
	"context"
	"log/slog"
	"time"
)

// HybridCache implements the Store interface by combining an L1 (Local) and L2 (Redis) cache.
type HybridCache struct {
	l1 Store // Typically LocalStore
	l2 Store // Typically RedisStore
}

func NewHybridCache(l1, l2 Store) *HybridCache {
	return &HybridCache{
		l1: l1,
		l2: l2,
	}
}

func (c *HybridCache) Get(ctx context.Context, key string) (string, error) {
	// 1. Try L1 (Memory) - Super Fast
	val, err := c.l1.Get(ctx, key)
	if err == nil {
		slog.Debug("cache hit L1", "key", key)
		return val, nil
	}

	// 2. Try L2 (Redis) - Fast
	val, err = c.l2.Get(ctx, key)
	if err == nil {
		slog.Debug("cache hit L2", "key", key)
		// Backfill L1 so the next request is even faster
		_ = c.l1.Set(ctx, key, val, 5*time.Minute) 
		return val, nil
	}

	return "", ErrCacheMiss
}

func (c *HybridCache) Set(ctx context.Context, key string, value string, ttl time.Duration) error {
	// Save to both L1 and L2
	// We use a shorter TTL for L1 to prevent memory bloat on a single server
	l1TTL := ttl
	if l1TTL > 10*time.Minute {
		l1TTL = 10 * time.Minute
	}

	_ = c.l1.Set(ctx, key, value, l1TTL)
	return c.l2.Set(ctx, key, value, ttl)
}

func (c *HybridCache) Delete(ctx context.Context, key string) error {
	_ = c.l1.Delete(ctx, key)
	return c.l2.Delete(ctx, key)
}
