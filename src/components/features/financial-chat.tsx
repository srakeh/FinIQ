"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { sendChatMessage } from "@/actions/chat";
import { FormattedMessage } from "@/components/features/formatted-message";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "How can I optimize my tax deductions?",
  "Analyze my portfolio risk exposure",
  "Explain SAFE notes vs convertible notes",
  "What is Section 80C and how do I maximize it?",
  "Summarize my financial health from my documents",
];

export function FinancialChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const text = (messageText || input).trim();
    if (!text || isLoading) return;

    setError(null);
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setIsLoading(true);

    try {
      const result = await sendChatMessage(text, messages);
      if (result.success && result.message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.message },
        ]);
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(
        err?.message || "Failed to get a response. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-2 px-3 py-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-[0_0_25px_rgba(255,128,0,0.15)]">
              <Sparkles className="h-10 w-10 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                FinIQ Advisor
              </h2>
              <p className="text-muted-foreground mt-1.5 max-w-md text-sm leading-relaxed">
                Your AI financial consultant. Ask about tax optimization,
                portfolio analysis, angel investing, or get personalized
                insights from your uploaded documents.
              </p>
            </div>

            {/* Quick Prompt Pills */}
            <div className="flex flex-wrap gap-2 max-w-lg justify-center">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-border/70 bg-card/50 text-muted-foreground hover:bg-orange-500/10 hover:border-orange-500/40 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-150"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 py-3.5 px-3.5 rounded-xl transition-colors ${
              msg.role === "assistant"
                ? "bg-card/70 border border-border/50 shadow-sm"
                : "bg-accent/40"
            }`}
          >
            {/* Avatar */}
            <div
              className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm ${
                msg.role === "assistant"
                  ? "bg-orange-500/15 border border-orange-500/30 text-orange-500"
                  : "bg-secondary text-secondary-foreground border border-border"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase mb-1">
                {msg.role === "assistant" ? "FinIQ Advisor" : "You"}
              </p>
              {msg.role === "assistant" ? (
                <FormattedMessage content={msg.content} />
              ) : (
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed break-words">
                  {msg.content}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 py-3.5 px-3.5 rounded-xl bg-card/60 border border-border/50">
            <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500/15 border border-orange-500/30 text-orange-500">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
              <span>Analyzing financial models...</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 mx-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts (after conversation started) */}
      {messages.length > 0 && !isLoading && (
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {QUICK_PROMPTS.slice(0, 3).map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="shrink-0 px-3 py-1 text-xs font-medium rounded-full border border-border/70 bg-card/50 text-muted-foreground hover:bg-orange-500/10 hover:border-orange-500/40 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border/60 p-4 bg-card/40 backdrop-blur-md">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your finances, taxes, angel investments..."
            className="resize-none min-h-[44px] max-h-[120px] text-sm bg-background border-border/80 focus-visible:ring-orange-500"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0 h-[44px] w-[44px] bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_15px_rgba(255,128,0,0.35)] disabled:opacity-50 transition-all duration-150"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          FinIQ AI-generated guidance. Grounded in uploaded documents and financial models.
        </p>
      </div>
    </div>
  );
}
