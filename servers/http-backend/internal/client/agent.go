package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/ingres/http-backend-go/internal/config"
	"github.com/ingres/http-backend-go/internal/models"
)

type AgentMessage struct {
	Sender  models.Sender `json:"sender"`
	Content string        `json:"content"`
}


type AgentRequest struct {
	UserID   string         `json:"userId"`
	ChatID   string         `json:"chatId"`
	Question string         `json:"question"`
	Messages []AgentMessage `json:"messages"`
}

type AgentResponse struct {
	Answer string `json:"answer"`
	State  bool   `json:"state"`
}

func CallAgentService(cfg config.Config, req AgentRequest) (AgentResponse, error) {
	payload, err := json.Marshal(req)
	if err != nil {
		return AgentResponse{}, err
	}

	url := fmt.Sprintf("%s/agent/chat", cfg.AgentServiceURL)
	httpReq, err := http.NewRequest("POST", url, bytes.NewReader(payload))
	if err != nil {
		return AgentResponse{}, err
	}
	httpReq.Header.Set("Content-Type", "application/json")

	client := http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		return AgentResponse{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return AgentResponse{}, fmt.Errorf("agent service returned %d", resp.StatusCode)
	}

	var ar AgentResponse
	if err := json.NewDecoder(resp.Body).Decode(&ar); err != nil {
		return AgentResponse{}, err
	}
	return ar, nil
}
