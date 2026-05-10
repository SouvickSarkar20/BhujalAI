import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Send,
  Mic,
  MicOff,
  Copy,
  Save,
  Bot,
  User,
  Languages,
  X,
  Sparkles,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BASE_URL } from "@/config";

interface DemoChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoChat: React.FC<DemoChatProps> = ({ isOpen, onClose }) => {
  const [isHindi, setIsHindi] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");
  type ChatMessage = {
    type: "bot" | "user";
    content: string;
    timestamp: string;
  };

  const [chat, setChat] = useState<ChatMessage[]>([
    {
      type: "bot",
      content: "Hello! I can help you with groundwater insights.",
      timestamp: "now",
    },
  ]);

  const handleToggleListening = () => setIsListening(!isListening);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // add user message
    const userMsg = {
      type: "user" as const,
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");

    try {
      // call backend
      const res = await fetch(`${BASE_URL}/chat-with-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: message,
          chatId: "demo-chat",
        }),
      });

      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      const botResponse = data.reply || data.content || "No response received.";

      const botMsg = {
        type: "bot" as const,
        content: botResponse,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChat((prev) => [...prev, botMsg]);
    } catch (err) {
      const errMsg = {
        type: "bot" as const,
        content:
          "⚠️ Error contacting the server. Please check your backend connection.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChat((prev) => [...prev, errMsg]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[90vh] bg-card shadow-ocean border-border/20 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/20 bg-muted/30">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deep-sea to-teal-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-inter text-card-foreground">
                INGRES AI Demo
              </h3>
              <p className="text-sm text-muted-foreground">
                Try groundwater intelligence in action
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsHindi(!isHindi)}
              className="flex items-center space-x-2"
            >
              <Languages className="w-4 h-4" />
              <span>{isHindi ? "हिंदी" : "English"}</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Try Queries */}
          <div className="w-1/3 p-6 border-r border-border/20 bg-muted/20 overflow-y-auto">
            <h4 className="text-lg font-bold font-inter text-card-foreground mb-4">
              {isHindi ? "क्या करके देखें" : "Try These Queries"}
            </h4>

            <div className="space-y-3">
              {(isHindi
                ? [
                    "राजस्थान में कितना पानी बचा है?",
                    "गर्मियों में पंजाब का क्या हाल होगा?",
                    "मेरे जिले में नलकूप कहाँ लगाना चाहिए?",
                    "पिछले 5 साल में कहाँ सबसे ज्यादा गिरावट हुई?",
                    "बारिश के बाद भूजल कितना बढ़ता है?",
                  ]
                : [
                    "How much water is left in Rajasthan?",
                    "What will happen to Punjab in summer?",
                    "Where should I drill a borewell in my district?",
                    "Which areas had maximum decline in 5 years?",
                    "How much does groundwater recharge after monsoon?",
                  ]
              ).map((query, index) => (
                <div
                  key={index}
                  className="p-3 bg-accent/20 rounded-lg border border-accent/30 cursor-pointer hover:bg-accent/30 transition-colors"
                  onClick={() => setMessage(query)}
                >
                  <p className="text-sm text-card-foreground">{query}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-teal-accent/10 rounded-lg border border-teal-accent/30">
              <h5 className="font-semibold text-teal-accent mb-2">
                {isHindi ? "खासियत" : "Features"}
              </h5>
              <ul className="text-sm text-card-foreground space-y-1">
                <li>
                  • {isHindi ? "आवाज़ से पूछें" : "Voice input supported"}
                </li>
                <li>• {isHindi ? "तुरंत जवाब" : "Instant responses"}</li>
                <li>• {isHindi ? "डेटा डाउनलोड" : "Export data"}</li>
              </ul>
            </div>
          </div>

          {/* Right Panel - Chat */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex space-x-3 max-w-2xl ${
                      msg.type === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.type === "user"
                          ? "bg-deep-sea"
                          : "bg-gradient-to-br from-teal-accent to-deep-sea"
                      }`}
                    >
                      {msg.type === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    <div
                      className={`rounded-2xl p-4 ${
                        msg.type === "user"
                          ? "bg-deep-sea text-white"
                          : "bg-muted border border-border/20"
                      }`}
                    >
                      <ReactMarkdown
                        {...({
                          className:
                            "prose prose-sm max-w-none dark:prose-invert",
                        } as any)}
                      >
                        {msg.content}
                      </ReactMarkdown>

                      <p className="text-xs text-muted-foreground mt-2">
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-border/20 bg-muted/20">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleListening}
                  className={`${
                    isListening
                      ? "bg-destructive text-destructive-foreground"
                      : ""
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>

                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isHindi
                      ? "अपना सवाल यहाँ लिखें..."
                      : "Ask about groundwater..."
                  }
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />

                <Button
                  onClick={handleSendMessage}
                  className="bg-deep-sea hover:bg-deep-sea/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-muted-foreground">
                  {isHindi
                    ? "यह केवल डेमो है। वास्तविक डेटा के लिए डैशबोर्ड देखें।"
                    : "This is a demo. Visit dashboard for real-time data."}
                </p>

                <Button variant="outline" size="sm">
                  <Save className="w-3 h-3 mr-2" />
                  Save Demo to Space
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
