package cache

import (
	"context"
	"log/slog"
	"time"
)

type HybridCache struct {
	l1 Store
	l2 Store
}

func NewHybridCache(l1, l2 Store) *HybridCache {
	return &HybridCache{
		l1: l1,
		l2: l2,
	}
}

func (c *HybridCache) Get(ctx context.Context, key string) (string, error) {
	val, err := c.l1.Get(ctx, key)
	if err == nil {
		slog.Debug("cache hit L1", "key", key)
		return val, nil
	}

	val, err = c.l2.Get(ctx, key)
	if err == nil {
		slog.Debug("cache hit L2", "key", key)
		_ = c.l1.Set(ctx, key, val, 5*time.Minute)
		return val, nil
	}

	return "", ErrCacheMiss
}

func (c *HybridCache) Set(ctx context.Context, key string, value string, ttl time.Duration) error {
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
