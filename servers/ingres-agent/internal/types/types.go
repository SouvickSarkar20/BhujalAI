package types

type AgentMessage struct {
	Sender  string `json:"sender"`
	Content string `json:"content"`
}

type AgentRequest struct {
	UserID        string         `json:"userId"`
	ChatID        string         `json:"chatId"`
	Question      string         `json:"question"`
	Messages      []AgentMessage `json:"messages"`
	PreviousChats []ChatMessage  `json:"previousChats,omitempty"`
}

type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type GetBusinessDataInterpretation struct {
	Location          string   `json:"location"`
	Intent            string   `json:"intent"`
	RequestedDataType []string `json:"requested_data_type"`
	RequestedFields   []string `json:"requested_fields"`
	RelatedFields     []string `json:"related_fields"`
	Year              *string  `json:"year"`
	Notes             *string  `json:"notes"`
}

type GetMapBusinessDataInterpretation struct {
	Intent          string   `json:"intent"`
	RequestedFields []string `json:"requested_fields"`
	RelatedFields   []string `json:"related_fields"`
	Location        *string  `json:"location"`
	Year            *string  `json:"year"`
	Message         *string  `json:"message"`
}

type GetBusinessDataResult struct {
	Interpretation GetBusinessDataInterpretation `json:"interpretation"`
	Data           interface{}                   `json:"data"`
}

type ResearchFunctionResult struct {
	Location   string      `json:"location"`
	State      bool        `json:"state"`
	DataSource string      `json:"dataSource"`
	Result     interface{} `json:"result"`
	Error      *bool       `json:"error,omitempty"`
	Message    *string     `json:"message,omitempty"`
}

type AgentResponse struct {
	Answer string `json:"answer"`
	State  bool   `json:"state"`
	Reply  string `json:"reply,omitempty"`
}

type ResearchArgs struct {
	Location      string   `json:"location"`
	State         bool     `json:"state"`
	PreviousChats []string `json:"previousChats"`
	UserQuery     string   `json:"userQuery"`
}
