package httpclient

import (
	"net"
	"net/http"
	"time"
)

// Default is a shared, optimized HTTP client with connection pooling enabled.
// Creating a new http.Client for every request is a common Go performance anti-pattern.
var Default = &http.Client{
	Timeout: 180 * time.Second,
	Transport: &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		DialContext: (&net.Dialer{
			Timeout:   30 * time.Second,
			KeepAlive: 30 * time.Second,
		}).DialContext,
		MaxIdleConns:          100,
		MaxIdleConnsPerHost:   10,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   10 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
	},
}
