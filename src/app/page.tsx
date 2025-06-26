"use client";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaRobot } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "next-themes";
// Add Uiverse.io bauble switch styles
import "./bauble-switch.css";

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
  const [switchStates, setSwitchStates] = useState([false, false, false, false, false]); // Five independent switches
  const [switchTimes, setSwitchTimes] = useState(["", "", "", ""]); // Four time values for switches
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: Lead Gen Agent, 1: Other Agent
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

// Add a new function for Mail Drafter workflow
const toggleWorkflowMail = async (activate: boolean) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_N8N_API_KEY as String;
    const url = activate
      ? "http://52.140.1.5/api/v1/workflows/FfeNpRxuw9gXWoEn/activate"
      : "http://52.140.1.5/api/v1/workflows/FfeNpRxuw9gXWoEn/deactivate";
    const headers = {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": (process.env.NEXT_PUBLIC_N8N_API_KEY || "") as string,
    };
    console.log("➡️ [Mail Drafter] Sending request to:", url);
    const res = await fetch(url, {
      method: "POST",
      headers,
    });
    console.log("✅ [Mail Drafter] Response status:", res.status);
    if (res.status === 204) {
      console.log("✅ [Mail Drafter] Success! No content returned.");
    } else {
      const data = await res.json();
      console.log("✅ [Mail Drafter] Response body:", data);
    }
  } catch (err) {
    console.error(`❌ [Mail Drafter] Error ${activate ? "activating" : "deactivating"} workflow:`, err);
  }
};

// Add a new function for Follow Up workflow
const toggleWorkflowFollowUp = async (activate: boolean) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_N8N_API_KEY as String;
    const url = activate
      ? "http://52.140.1.5/api/v1/workflows/vv5avi2UgZUa3BP9/activate"
      : "http://52.140.1.5/api/v1/workflows/vv5avi2UgZUa3BP9/deactivate";
    console.log("✅ [Follow Up] API Key:", apiKey);
    const headers = {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzgwZjdjNS00ZjI5LTRjNDctODg4Zi1jNmEyZDIxZjVkOWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUwODEyNzM5LCJleHAiOjE3NTMzODE4MDB9.atzeohRl-gBD7bB5Rhz5ohrnF0KHELILjjP9bPUr-FQ",
    };
    console.log("➡️ [Follow Up] Sending request to:", url);
    const res = await fetch(url, {
      method: "POST",
      headers,
    });
    console.log("✅ [Follow Up] Response status:", res.status);
    if (res.status === 204) {
      console.log("✅ [Follow Up] Success! No content returned.");
    } else {
      const data = await res.json();
      console.log("✅ [Follow Up] Response body:", data);
    }
  } catch (err) {
    console.error(`❌ [Follow Up] Error ${activate ? "activating" : "deactivating"} workflow:`, err);
  }
};

// Add a new function for 2nd Follow Up workflow
const toggleWorkflowSecondFollowUp = async (activate: boolean) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_N8N_API_KEY as string;
    const url = activate
      ? "http://52.140.1.5/api/v1/workflows/93dWrCzd9v9fEoVO/activate"
      : "http://52.140.1.5/api/v1/workflows/93dWrCzd9v9fEoVO/deactivate";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": apiKey || "",
    };
    console.log("➡️ [2nd Follow Up] Sending request to:", url);
    const res = await fetch(url, {
      method: "POST",
      headers,
    });
    console.log("✅ [2nd Follow Up] Response status:", res.status);
    if (res.status === 204) {
      console.log("✅ [2nd Follow Up] Success! No content returned.");
    } else {
      const data = await res.json();
      console.log("✅ [2nd Follow Up] Response body:", data);
    }
  } catch (err) {
    console.error(`❌ [2nd Follow Up] Error ${activate ? "activating" : "deactivating"} workflow:`, err);
  }
};

// Add a new function for Lead Closure workflow
const toggleWorkflowLeadClosure = async (activate: boolean) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_N8N_API_KEY as string;
    const url = activate
      ? "http://52.140.1.5/api/v1/workflows/nN9hW9KkzgUZUcjV/activate"
      : "http://52.140.1.5/api/v1/workflows/nN9hW9KkzgUZUcjV/deactivate";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": apiKey || "",
    };
    console.log("➡️ [Lead Closure] Sending request to:", url);
    const res = await fetch(url, {
      method: "POST",
      headers,
    });
    console.log("✅ [Lead Closure] Response status:", res.status);
    if (res.status === 204) {
      console.log("✅ [Lead Closure] Success! No content returned.");
    } else {
      const data = await res.json();
      console.log("✅ [Lead Closure] Response body:", data);
    }
  } catch (err) {
    console.error(`❌ [Lead Closure] Error ${activate ? "activating" : "deactivating"} workflow:`, err);
  }
};

  useEffect(() => {
    // On mount, fetch the state for all workflows and update switch states
    const workflowIds = [
      "rguevFxVSG6QEKSr", // Booking Agent
      "FfeNpRxuw9gXWoEn", // Mail Drafter
      "vv5avi2UgZUa3BP9", // Follow Up
      "93dWrCzd9v9fEoVO", // 2nd Follow Up
      "nN9hW9KkzgUZUcjV", // Lead Closure
    ];
    const apiKey = process.env.NEXT_PUBLIC_N8N_API_KEY ?? "";
    const headers = {
      "Content-Type": "application/json",
      "x-n8n-api-key": apiKey,
    };
    Promise.all(
      workflowIds.map(async (id) => {
        try {
          const res = await fetch(`http://52.140.1.5/api/v1/workflows/${id}?excludePinnedData=true`, {
            method: "GET",
            headers: headers as Record<string, string>,
          });
          const data = await res.json();
          return data.active === true;
        } catch (err) {
          console.error(`Error fetching workflow state for ${id}:`, err);
          return false;
        }
      })
    ).then((states) => setSwitchStates(states));
  }, []);

  const [mailDraftMessages, setMailDraftMessages] = useState<Message[]>([]);
  const [mailDraftInput, setMailDraftInput] = useState("");
  const [mailDraftLoading, setMailDraftLoading] = useState(false);

  const sendMailDraftMessage = async () => {
    if (!mailDraftInput.trim()) return;
    const userMessage: Message = { role: "user", content: mailDraftInput };
    setMailDraftMessages((msgs) => [...msgs, userMessage]);
    setMailDraftInput("");
    setMailDraftLoading(true);
    try {
      const webhookUrl = "http://52.140.1.5:5678/webhook/maildraft";
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });
      const data = await res.json();
      console.log('MailDraft API response:', data);
      const botReply = data.output || data.reply || "No response";
      setMailDraftMessages((msgs) => [...msgs, { role: "bot", content: botReply }]);
    } catch (err) {
      setMailDraftMessages((msgs) => [...msgs, { role: "bot", content: "Error connecting to maildraft server." }]);
    } finally {
      setMailDraftLoading(false);
    }
  };

  const handleMailDraftKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !mailDraftLoading) sendMailDraftMessage();
  };

  // Show welcome message when Lead Gen tab is loaded
  useEffect(() => {
    if (activeTab === 0 && messages.length === 0) {
      setMessages([
        { role: "bot", content: "Hey, I am your lead generation agent and will help you to generate leads.\nCan you tell me where are you looking leads from?" }
      ]);
    }
    if (activeTab === 1 && mailDraftMessages.length === 0) {
      setMailDraftMessages([
        { role: "bot", content: "Hey, I am your mail draft agent. How can I help you draft your email today?" }
      ]);
    }
    // eslint-disable-next-line
  }, [activeTab]);

  return (
    <div className="flex flex-row h-screen w-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar with toggle buttons */}
      <aside
        className={`h-full ${sidebarCollapsed ? "w-0 min-w-0" : "w-1/5 min-w-[180px]"} flex flex-col items-center justify-start gap-10 py-12 bg-gradient-to-b from-white/80 via-white/60 to-white/30 dark:from-[#23232a]/90 dark:via-[#18181b]/80 dark:to-[#111112]/60 backdrop-blur-2xl border-r border-white/20 shadow-xl transition-all duration-300 relative`}
        style={{ minWidth: sidebarCollapsed ? 0 : undefined, padding: sidebarCollapsed ? 0 : undefined }}
      >
        {/* Floating expand/collapse button */}
        <button
          onClick={() => setSidebarCollapsed((c) => !c)}
          className={`z-20 bg-white dark:bg-[#23232a] border border-gray-300 dark:border-gray-700 rounded-full p-1 shadow hover:bg-gray-100 dark:hover:bg-[#18181b] transition-all duration-200 absolute top-4 ${sidebarCollapsed ? 'left-2' : 'right-[-16px]'}`}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none' }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-700 dark:text-gray-200">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {/* Sidebar content only visible when expanded */}
        {!sidebarCollapsed && (
          <>
            {[0, 1, 2, 3, 4].map((idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 w-full bauble_box">
                <label className="text-base font-semibold text-gray-800 dark:text-gray-100 tracking-wide mb-1 select-none">
                  {idx === 0 ? "Booking Agent" : idx === 1 ? "Mail Drafter" : idx === 2 ? "Follow Up" : idx === 3 ? "2nd Follow Up" : "Lead Closure"}
                </label>
                <input
                  type="checkbox"
                  className="bauble_input"
                  checked={switchStates[idx]}
                  onChange={() => {
                    setSwitchStates(states => states.map((v, i) => i === idx ? !v : v));
                    if (idx === 0) {
                      toggleWorkflow(!switchStates[idx]); // Booking Agent
                    } else if (idx === 1) {
                      toggleWorkflowMail(!switchStates[idx]); // Mail Drafter
                    } else if (idx === 2) {
                      toggleWorkflowFollowUp(!switchStates[idx]); // Follow Up
                    } else if (idx === 3) {
                      toggleWorkflowSecondFollowUp(!switchStates[idx]); // 2nd Follow Up
                    } else if (idx === 4) {
                      toggleWorkflowLeadClosure(!switchStates[idx]); // Lead Closure
                    }
                  }}
                  id={`bauble-switch-${idx}`}
                />
                <label
                  htmlFor={`bauble-switch-${idx}`}
                  className="bauble_label"
                  style={{
                    background: switchStates[idx] ? '#2c2' : '#c22', // ON: green, OFF: red
                    transition: 'background 0.5s ease',
                  }}
                >
                  <span
                    className="bauble_handle"
                    style={{
                      background: switchStates[idx] ? '#2c2' : '#c22', // ON: green, OFF: red
                      transition: 'background 0.5s ease',
                    }}
                  />
                </label>
              </div>
            ))}
          </>
        )}
      </aside>
      {/* Main chat area */}
      <div className="flex flex-col flex-1 h-full w-full overflow-hidden">
        {/* Top bar: Tabs and Theme Toggle */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 pt-4 pb-2">
          <div className="flex items-center">
            <button
              className={`px-4 py-2 font-medium rounded-t-md transition-colors duration-200 focus:outline-none ${activeTab === 0 ? 'bg-white dark:bg-[#23232a] text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab(0)}
              type="button"
            >
              Lead Gen Agent
            </button>
            <button
              className={`ml-2 px-4 py-2 font-medium rounded-t-md transition-colors duration-200 focus:outline-none ${activeTab === 1 ? 'bg-white dark:bg-[#23232a] text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab(1)}
              type="button"
            >
              Reasearch and Outreach Agent
            </button>
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
        {/* Main chat area, only show for Lead Gen Agent tab */}
        {activeTab === 0 && (
          <>
            
            <Card className="flex-1 rounded-none border-none h-full w-full overflow-hidden">
              <CardContent className="flex-1 h-full w-full overflow-y-auto p-8 space-y-4">
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
          </>
        )}
        {/* Placeholder for second tab content */}
        {activeTab === 1 && (
          <>
          
            <Card className="flex-1 rounded-none border-none h-full w-full overflow-hidden">
              <CardContent className="flex-1 h-full w-full overflow-y-auto p-8 space-y-4">
                {mailDraftMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-60 select-none">
                    <FaRobot className="text-5xl mb-4 text-primary/60" />
                    <div className="text-lg">Start a conversation</div>
                  </div>
                ) : (
                  <>
                    {mailDraftMessages.map((msg, i) => (
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
                    {mailDraftLoading && (
                      <div className="w-full flex justify-start">
                        <div className="bg-muted dark:bg-[#2d2d30] text-sm px-4 py-3 rounded-xl flex gap-1">
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce delay-100">.</span>
                          <span className="animate-bounce delay-200">.</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMailDraftMessage();
                }}
                className="flex items-center gap-2 px-4 py-3 border-t border-border bg-background"
              >
                <Input
                  type="text"
                  value={mailDraftInput}
                  onChange={(e) => setMailDraftInput(e.target.value)}
                  onKeyDown={handleMailDraftKeyDown}
                  placeholder="Send a message"
                  disabled={mailDraftLoading}
                  className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none"
                />
                <Button type="submit" disabled={mailDraftLoading || !mailDraftInput.trim()} className="px-6">
                  {mailDraftLoading ? <span className="animate-pulse">...</span> : "Send"}
                </Button>
              </form>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
