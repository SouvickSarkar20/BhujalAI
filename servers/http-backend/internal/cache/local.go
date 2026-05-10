package cache

import (
	"context"
	"errors"
	"sync"
	"time"
)

var ErrCacheMiss = errors.New("cache miss")

type item struct {
	value     string
	expiresAt time.Time
}

// LocalStore is an in-memory TTL cache using a mutex-protected map.
type LocalStore struct {
	mu    sync.RWMutex
	items map[string]item
}

func NewLocalStore(cleanupInterval time.Duration) *LocalStore {
	s := &LocalStore{
		items: make(map[string]item),
	}
	// Start the Janitor: A background goroutine that removes expired items
	go s.janitor(cleanupInterval)
	return s
}

func (s *LocalStore) Get(ctx context.Context, key string) (string, error) {
	s.mu.RLock() // Read Lock: multiple readers can hold this at once
	defer s.mu.RUnlock()

	it, ok := s.items[key]
	if !ok {
		return "", ErrCacheMiss
	}

	// Check if expired
	if time.Now().After(it.expiresAt) {
		return "", ErrCacheMiss
	}

	return it.value, nil
}

func (s *LocalStore) Set(ctx context.Context, key string, value string, ttl time.Duration) error {
	s.mu.Lock() // Write Lock: only one goroutine can modify the map
	defer s.mu.Unlock()

	s.items[key] = item{
		value:     value,
		expiresAt: time.Now().Add(ttl),
	}
	return nil
}

func (s *LocalStore) Delete(ctx context.Context, key string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.items, key)
	return nil
}

// janitor scans the map periodically and removes expired items to save memory.
func (s *LocalStore) janitor(interval time.Duration) {
	ticker := time.NewTicker(interval)
	for range ticker.C {
		s.mu.Lock()
		for k, v := range s.items {
			if time.Now().After(v.expiresAt) {
				delete(s.items, k)
			}
		}
		s.mu.Unlock()
	}
}
