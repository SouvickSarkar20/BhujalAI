// --- same imports as before ---
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Send, Search, Plus } from "lucide-react";
import { BASE_URL } from "@/config";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: string;
  metadata?: { source?: string; year?: number; region?: string };
}

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = BASE_URL + "/chat";

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId?: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("token");

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch all chats
  useEffect(() => {
    if(!token){
      navigate(`/login`);
    }
    const fetchChats = async () => {
      try {
        const res = await fetch(`${API_BASE}/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setChats(data || []);
        else toast({ title: "Error", description: data.error || "Failed to fetch chats" });

      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Network error fetching chats" });
      }
    };
    fetchChats();
  }, []);

  // Fetch messages
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setSelectedChat(null);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/${chatId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const formatted = (data || []).map((msg: any) => ({
            id: msg.id,
            type: msg.sender === "USER" ? "user" : "bot",
            content: msg.content,
            timestamp: msg.createdAt,
            metadata: msg.metadata,
          })) as Message[];

          setMessages(formatted);
          setSelectedChat(chatId);
        } else {
          toast({ title: "Error", description: data.error || "Failed to fetch messages" });
        }
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Network error fetching messages" });
      }
    };

    fetchMessages();
  }, [chatId]);

  // Processing simulation
  const processingSteps = [
    "Interpreting your query...",
    "Searching INGRES portal for relevant data...",
    "Analyzing the data and preparing insights...",
  ];

  const simulateProcessing = async (stopSignal: { stop: boolean }) => {
    const stepDelay = 5000;
    for (let i = 0; i < processingSteps.length; i++) {
      if (stopSignal.stop) break;
      const tempMsg: Message = {
        id: `temp-${i}-${Date.now()}`,
        type: "bot",
        content: processingSteps[i],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMsg]);
      await new Promise((res) => setTimeout(res, stepDelay));
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMsg.id));
    }
  };

  // Convert text to formatted HTML
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul className="list-disc ml-5 mb-2">
            {currentList.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: formatBold(item) }} />
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const formatBold = (str: string) =>
      str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    for (const line of lines) {
      if (line.trim().startsWith("*")) {
        currentList.push(line.replace(/^\*\s*/, ""));
      } else if (line.trim() === "") {
        flushList();
        elements.push(<br key={elements.length} />);
      } else {
        flushList();
        elements.push(
          <p
            key={elements.length}
            className="text-sm my-1"
            dangerouslySetInnerHTML={{ __html: formatBold(line) }}
          />
        );
      }
    }
    flushList();
    return <>{elements}</>;
  };

  // Handle send
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setCurrentMessage("");
    setIsLoading(true);

    const stopSignal = { stop: false };

    try {
      const simPromise = simulateProcessing(stopSignal);

      const previousChats = [...messages, userMsg]
        .map((m) => ({
          role: m.type === "user" ? "user" : "assistant",
          content: m.content,
        }))
        .filter((m) => m.content.trim() !== "");

        const body: any = { question: userMsg.content };
        if (selectedChat || chatId) body.chatId = selectedChat || chatId;

        const res = await fetch(`${API_BASE}/chat-with-agent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });


      stopSignal.stop = true;

      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "AI service overloaded",
          description: "Please try again in a moment.",
        });
        // Restore message to input for retry
        setCurrentMessage(userMsg.content);
        // Remove the message from the UI since it failed
        setMessages((prev) => prev.filter((msg) => msg.id !== userMsg.id));
        setIsLoading(false);
        return;
      }


      // Add bot message
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        type: "bot",
        content: data.answer,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);

      const returnedChatId: string | undefined = data.chatId;
      if (returnedChatId && !selectedChat && !chatId) {
        navigate(`/dashboard/chat/${returnedChatId}`);
        // Optionally refresh chats list to show new chat
        const refreshChats = async () => {
          const r = await fetch(`${API_BASE}/all`, { headers: { Authorization: `Bearer ${token}` } });
          const d = await r.json();
          if (r.ok) setChats(d || []);
        };
        refreshChats();
      }


      await simPromise;
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Network error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat.id);
    navigate(`/dashboard/chat/${chat.id}`);
  };
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Chat History</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate("/dashboard/chat")}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-2 space-y-2">
          {filteredChats.map((chat) => (
            <motion.div key={chat.id} whileHover={{ scale: 1.02 }}>
              <Card
                className={`cursor-pointer transition-colors ${
                  selectedChat === chat.id ? "bg-accent" : "hover:bg-accent/50"
                }`}
                onClick={() => handleSelectChat(chat)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">{chat.title}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(chat.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border bg-card">
          <h1 className="font-semibold">
            {chats.find((c) => c.id === (selectedChat || chatId))?.title ||
              "New Chat"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Ask questions about groundwater data
          </p>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-[80%] ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="text-sm leading-relaxed">
                      {renderFormattedText(message.content)}
                    </div>
                    {message.metadata?.source && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {message.metadata.source}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="text-sm text-muted-foreground animate-pulse">
              INGRES AI is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card flex items-center space-x-3">
          <Button
            size="icon"
            variant={isListening ? "default" : "outline"}
            onClick={() => setIsListening(!isListening)}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Input
            placeholder="Ask about groundwater data..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
