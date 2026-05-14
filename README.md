# IngresAI — Groundwater Intelligence Platform

> **A production-grade, AI-powered platform for analysing groundwater data across India. Built on a microservices architecture with Go, Python, and React — deployed with Docker and secured with Let's Encrypt SSL.**

🌐 **Live at:** [https://ingres-agent.space](https://ingres-agent.space)

---

## Overview

IngresAI is an intelligent data platform that acts as a bridge between India's complex groundwater datasets and the people who need insights from them — researchers, policymakers, and local officials. Users interact through a natural language chat interface powered by a multi-provider LLM agent, while a dedicated Python analytics engine computes stress scores, recharge efficiency, sectoral consumption, and command area disparity for any location in India.

---

## Architecture

The system is composed of four independent microservices, orchestrated via Docker Compose and unified behind an Nginx reverse proxy.

```
User (Browser)
      │
      ▼
  Nginx (Port 80/443)
  ├── / ──────────────────► React Frontend (Static Files)
  ├── /api/ ──────────────► HTTP Backend (Go / Fiber) :9001
  ├── /agent/ ────────────► Ingres Agent  (Go / Fiber) :9000
  └── /analytics/ ────────► Analytics     (Python / FastAPI) :8000
```

| Service | Language / Framework | Responsibility |
|---|---|---|
| **HTTP Backend** | Go (Fiber) | Auth (JWT), user management, DB, analytics proxy |
| **Ingres Agent** | Go (Fiber) | LLM orchestration, function-calling, caching |
| **Analytics Server** | Python (FastAPI) | Groundwater stress, consumption & recharge analysis |
| **Frontend** | React + Vite + Nginx | Single-page application, served statically |

---

## Tech Stack

### Backend (Go)
- **Fiber v2** — High-performance HTTP framework
- **GORM** — ORM with PostgreSQL (NeonDB serverless)
- **JWT** — Stateless authentication
- **Redis (Upstash)** — Two-layer caching (L1: in-memory, L2: Redis)
- **Connection Pooling** — Shared HTTP client with persistent connections
- **Rate Limiting** — Per-route middleware (auth routes vs. general API)

### AI Agent (Go)
- **Pluggable LLM Provider** — Switch between Gemini, Groq, and OpenRouter via a single env variable
- **Function-Calling Loop** — Agentic orchestration with tool calls (groundwater data fetching)
- **Hybrid Cache** — L1 in-memory + L2 Redis to prevent token exhaustion on repeated queries

### Analytics (Python)
- **FastAPI** — High-performance async API
- **Pandas** — Data manipulation for stress, consumption, recharge, and disparity calculations
- **Pydantic** — Strict request validation

### Infrastructure
- **Docker + Docker Compose** — Full containerization of all 4 services
- **Nginx** — Reverse proxy, static file server, HTTPS termination
- **Let's Encrypt (Certbot)** — Automated, free SSL certificates with auto-renewal
- **GitHub Actions** — CI/CD pipeline for zero-downtime deployments
- **DigitalOcean** — Production droplet (Ubuntu, 2vCPU, 4GB RAM)
- **NeonDB** — Serverless PostgreSQL
- **Upstash Redis** — Serverless Redis (rediss:// TLS connection)

---

## Performance

| Metric | Node.js (old) | Go/Fiber (current) |
|---|---|---|
| Average API Latency | 150ms | 30ms |
| Agent Logic Processing | 450ms | 120ms |
| Memory Usage (idle) | 85MB | 12MB |
| Throughput | 800 req/s | 4,500 req/s |
| Concurrency Model | Event Loop | Goroutines |

---

## Features

- 💬 **Natural Language Chat** — Ask questions about any Indian state or district in plain English
- 🤖 **Multi-Provider LLM** — Gemini, Groq, or OpenRouter — configurable at runtime
- 📊 **Analytics Dashboard** — Groundwater stress index, sectoral consumption pie charts, recharge efficiency, and command area disparity
- 🔒 **JWT Auth** — Secure login and session management
- ⚡ **Redis Caching** — Prevents duplicate LLM calls; serves cached insights within milliseconds
- 🌍 **Production-Grade SSL** — Automatic HTTPS via Let's Encrypt with auto-renewal
- 🔄 **CI/CD** — GitHub Actions triggers a Docker rebuild on every push to `main`

---

## Repository Structure

```
Ingres-go/
├── Ingres-Frontend/          # React + Vite + TailwindCSS frontend
│   ├── Dockerfile            # Multi-stage: Node build → Nginx serve
│   └── nginx.conf            # Reverse proxy + SSL configuration
├── servers/
│   ├── http-backend/         # Go HTTP backend
│   │   └── internal/
│   │       ├── handler/      # Request handlers
│   │       ├── middleware/   # Auth, rate limiting
│   │       ├── cache/        # Hybrid L1/L2 cache
│   │       ├── client/       # Analytics & agent HTTP clients
│   │       └── config/       # Environment configuration
│   ├── ingres-agent/         # Go AI agent
│   │   └── internal/
│   │       ├── llm/          # Pluggable provider (Gemini/Groq/OpenRouter)
│   │       ├── handler/      # Chat handler with agentic loop
│   │       ├── cache/        # Hybrid cache for LLM responses
│   │       └── prompts/      # System prompts
│   └── analytics/            # Python analytics server
│       ├── processors/core/  # Stress, consumption, recharge, disparity
│       ├── routers/          # FastAPI routes
│       ├── services/         # External INGRES API client
│       └── models/           # Pydantic payloads
├── docker-compose.yml        # Full stack orchestration
└── .github/workflows/
    └── deploy.yml            # CI/CD pipeline
```

---

## Environment Variables

### `servers/http-backend/.env`
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_jwt_secret
REDIS_URL=rediss://...
AGENT_SERVICE_URL=http://agent:9000       # Set automatically by Docker
ANALYTICS_SERVICE_URL=http://analytics:8000  # Set automatically by Docker
```

### `servers/ingres-agent/.env`
```env
LLM_PROVIDER=openrouter        # Options: gemini | groq | openrouter
OPENAI_API_KEY=...             # Used for OpenRouter
GEMINI_API_KEY=...
GROQ_API_KEY=...
REDIS_URL=rediss://...
```

> **Note:** `.env` files are never committed to Git. They must be created manually on the server.

---

## Local Development

> **Prerequisites:** Go 1.26+, Node 20+, Python 3.11+, Docker (optional)

### Without Docker
```bash
# 1. Start the Agent
cd servers/ingres-agent && go run main.go

# 2. Start the Backend
cd servers/http-backend && go run main.go

# 3. Start Analytics
cd servers/analytics && uvicorn main:app --reload

# 4. Start the Frontend
cd Ingres-Frontend && npm install && npm run dev
```

### With Docker (Recommended)
```bash
# Build and start all services
docker compose up --build -d

# View logs
docker logs -f http-backend
docker compose logs -f
```

---

## Production Deployment

### First-time SSL setup
```bash
# 1. Get the SSL certificate (run once on the server)
docker run --rm -it \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --webroot --webroot-path=/var/www/certbot \
  --email your@email.com --agree-tos --no-eff-email \
  -d ingres-agent.space

# 2. Restart the Docker stack
docker compose up --build -d
```

### Automated CI/CD
Every `git push` to `main` triggers the GitHub Actions pipeline which:
1. SSHes into the DigitalOcean droplet.
2. Pulls the latest code.
3. Runs `docker compose up --build -d` to rebuild and redeploy.

**Required GitHub Secrets:**
| Secret | Value |
|---|---|
| `DROPLET_HOST` | Server IP address |
| `DROPLET_USER` | `root` |
| `DROPLET_SSH_KEY` | Private SSH key (`~/.ssh/id_ed25519`) |

---

## LLM Provider Switching

The agent uses a **Strategy Pattern** for provider abstraction. To switch providers, change a single environment variable:

```env
# In servers/ingres-agent/.env
LLM_PROVIDER=openrouter   # or: gemini | groq
```

No code changes required. The factory resolves the correct implementation at runtime.

---

## License

MIT License — see [LICENSE](LICENSE) for details.
