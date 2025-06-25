"use client";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaRobot } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "next-themes";

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeSwitch, setActiveSwitch] = useState(1); // Track active switch
  const [switchStates, setSwitchStates] = useState([false, false, false, false]); // Four independent switches
  const [switchTimes, setSwitchTimes] = useState(["", "", "", ""]); // Four time values for switches
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isDark =
    theme === "dark" ||
    (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const webhookUrl = "http://52.140.1.5:5678/webhook/chat";
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      console.log('Chat API response:', data); // Log the response
      // Use 'output' property if present, otherwise fallback to 'reply'
      const botReply = data.output || data.reply || "No response";
      setMessages((msgs) => [...msgs, { role: "bot", content: botReply }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { role: "bot", content: "Error connecting to chat server." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  // Function to activate or deactivate workflow
  const toggleWorkflow = async (activate: boolean) => {
  try {
    const apiKey = process.env.API_KEY as String ; // Use API key from env
    const url = activate
      ? "http://52.140.1.5/api/v1/workflows/rguevFxVSG6QEKSr/activate"
      : "http://52.140.1.5/api/v1/workflows/rguevFxVSG6QEKSr/deactivate";
    console.log("✅ Response status:",apiKey);
    const headers = {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzgwZjdjNS00ZjI5LTRjNDctODg4Zi1jNmEyZDIxZjVkOWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUwODEyNzM5LCJleHAiOjE3NTMzODE4MDB9.atzeohRl-gBD7bB5Rhz5ohrnF0KHELILjjP9bPUr-FQ",
    };

    console.log("➡️ Sending request to:", url);
    console.log("➡️ Headers:", headers);

    const res = await fetch(url, {
      method: "POST",
      headers,
    });

    console.log("✅ Response status:", res.status);

    if (res.status === 204) {
      console.log("✅ Success! No content returned.");
    } else {
      const data = await res.json();
      console.log("✅ Response body:", data);
    }
  } catch (err) {
    console.error(`❌ Error ${activate ? "activating" : "deactivating"} workflow:`, err);
  }
};


  return (
    <div className="flex flex-row h-screen bg-background text-foreground">
      {/* Sidebar with toggle buttons */}
      <aside className="h-full w-40 flex flex-col items-center justify-start gap-10 py-12 bg-gradient-to-b from-white/80 via-white/60 to-white/30 dark:from-[#23232a]/90 dark:via-[#18181b]/80 dark:to-[#111112]/60 backdrop-blur-2xl border-r border-white/20 shadow-xl">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="flex flex-col items-center gap-3 w-full">
            <label className="text-base font-semibold text-gray-800 dark:text-gray-100 tracking-wide mb-1 select-none">
              Switch {idx + 1}
            </label>
            <button
              onClick={() => {
                setSwitchStates(states => states.map((v, i) => i === idx ? !v : v));
                toggleWorkflow(!switchStates[idx]); // Activate on ON, deactivate on OFF
              }}
              className={`relative w-16 h-10 flex items-center focus:outline-none group transition-all duration-200 ${switchStates[idx] ? "ring-2 ring-green-400" : "ring-1 ring-gray-300"}`}
              aria-pressed={switchStates[idx]}
              tabIndex={0}
              type="button"
            >
              <span
                className={`w-16 h-10 flex items-center rounded-full transition-colors duration-200 px-2 border-2 shadow-inner
                  ${switchStates[idx] ? "bg-green-500 border-green-600" : "bg-gray-300 border-gray-400 dark:bg-gray-700 dark:border-gray-600"}`}
              >
                <span
                  className={`h-8 w-8 bg-white rounded-full shadow-lg transform transition-transform duration-200 border-2 border-gray-200 dark:border-gray-700
                    ${switchStates[idx] ? "translate-x-6" : "translate-x-0"}`}
                />
              </span>
              <span className={`absolute left-3 text-xs font-bold transition-colors duration-200 ${switchStates[idx] ? "text-green-800" : "text-gray-600 dark:text-gray-300"}`}>
                {switchStates[idx] ? "ON" : "OFF"}
              </span>
            </button>
            <input
              type="time"
              value={switchTimes[idx]}
              onChange={e => setSwitchTimes(times => times.map((t, i) => i === idx ? e.target.value : t))}
              className="mt-1 w-28 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#23232a] px-3 py-1 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all duration-200"
            />
          </div>
        ))}
      </aside>
      {/* Main chat area */}
      <div className="flex flex-col flex-1 h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <FaRobot className="text-xl" />
            <span className="text-lg font-medium">Lead Gen Agent</span>
          </div>
          {mounted && (
            <Button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="h-8 w-8 p-0 rounded-full flex items-center justify-center text-lg"
            >
              {isDark ? <FiSun className="w-3 h-3" /> : <FiMoon className="w-3 h-3" />}
            </Button>
          )}
        </div>
        <Card className="flex-1 rounded-none border-none">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-60 select-none">
                <FaRobot className="text-5xl mb-4 text-primary/60" />
                <div className="text-lg">Start a conversation</div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xl px-4 py-3 rounded-xl text-sm shadow ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-muted dark:bg-[#2d2d30] text-gray-800 dark:text-gray-100"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="w-full flex justify-start">
                    <div className="bg-muted dark:bg-[#2d2d30] text-sm px-4 py-3 rounded-xl flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce delay-100">.</span>
                      <span className="animate-bounce delay-200">.</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 px-4 py-3 border-t border-border bg-background"
          >
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message"
              disabled={loading}
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none"
              autoFocus
            />
            <Button type="submit" disabled={loading || !input.trim()} className="px-6">
              {loading ? <span className="animate-pulse">...</span> : "Send"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
