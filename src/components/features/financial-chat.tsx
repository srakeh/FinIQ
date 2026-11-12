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
      <div className="flex-1 overflow-y-auto space-y-1 px-2 py-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="p-4 rounded-full bg-emerald-50 dark:bg-emerald-950/50">
              <Sparkles className="h-10 w-10 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                FinIQ Advisor
              </h2>
              <p className="text-zinc-500 mt-1 max-w-md text-sm">
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
                  className="px-3 py-1.5 text-xs rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 dark:hover:bg-emerald-950/50 dark:hover:border-emerald-700 dark:hover:text-emerald-400 transition-colors"
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
            className={`flex gap-3 py-4 px-3 rounded-lg ${
              msg.role === "assistant"
                ? "bg-zinc-50 dark:bg-zinc-900/50"
                : ""
            }`}
          >
            {/* Avatar */}
            <div
              className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                msg.role === "assistant"
                  ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600"
                  : "bg-blue-100 dark:bg-blue-900/50 text-blue-600"
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
              <p className="text-xs font-medium text-zinc-400 mb-1">
                {msg.role === "assistant" ? "FinIQ Advisor" : "You"}
              </p>
              <div className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed break-words">
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 py-4 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
            <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 mx-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
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
              className="shrink-0 px-3 py-1 text-xs rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 dark:hover:bg-emerald-950/50 dark:hover:border-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your finances, taxes, investments..."
            className="resize-none min-h-[44px] max-h-[120px] text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 focus-visible:ring-emerald-500"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0 h-[44px] w-[44px] bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-zinc-400 text-center mt-2">
          AI-generated financial guidance. Not a substitute for certified
          financial advice.
        </p>
      </div>
    </div>
  );
}
