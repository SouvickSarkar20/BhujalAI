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

type LocalStore struct {
	mu    sync.RWMutex
	items map[string]item
}

func NewLocalStore(cleanupInterval time.Duration) *LocalStore {
	s := &LocalStore{
		items: make(map[string]item),
	}
	go s.janitor(cleanupInterval)
	return s
}

func (s *LocalStore) Get(ctx context.Context, key string) (string, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	it, ok := s.items[key]
	if !ok {
		return "", ErrCacheMiss
	}

	if time.Now().After(it.expiresAt) {
		return "", ErrCacheMiss
	}

	return it.value, nil
}

func (s *LocalStore) Set(ctx context.Context, key string, value string, ttl time.Duration) error {
	s.mu.Lock()
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
