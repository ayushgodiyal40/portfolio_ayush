/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Terminal, Cpu, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SUGGESTIONS = [
  "What is Ayush's academic score and CSE specialization?",
  "Tell me about the Nexus Compiler Rust project.",
  "Is Ayush available for full-time SDE roles or internships?",
  "What cloud technologies does he specialize in?",
];

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "SYSTEM INITIALIZED: Welcome. I am Ayush's AI Portfolio Agent. I have full read access to his resume, educational history, technical projects, and skills matrix. Ask me anything about his credentials or suitability for software engineering roles.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Send chat context to full-stack backend Express route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.text }],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact server API.");
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        sender: "ai",
        text: data.reply || "Agent offline. Could not synthesize reply.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        sender: "ai",
        text: "API_TRANSMISSION_ERROR: Connection to the host server was lost. Please verify that the server is online and try sending again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        sender: "ai",
        text: "TERMINAL_CLEARED. Ayush's AI Agent initialized. Ask me questions about his technical work, course scores, systems coding, or professional details.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[520px] bg-black/40 backdrop-blur-md border border-white/10 p-4 font-mono relative overflow-hidden" id="career-ai-terminal">
      {/* Terminal Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-xs">
        <div className="flex items-center gap-2 text-white/90">
          <Terminal className="w-4 h-4 text-[#CCFF00]" />
          <span className="font-semibold tracking-wider">AYUSH_AI_AGENT v1.4.2</span>
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
        </div>
        <button
          onClick={handleClear}
          className="text-white/40 hover:text-white transition-colors flex items-center gap-1 text-[10px]"
          title="Reset Terminal Shell"
        >
          <RefreshCw className="w-3 h-3" />
          RESET SHELL
        </button>
      </div>

      {/* Messages Scroll Box */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs mb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 border rounded-none ${
                m.sender === "user"
                  ? "bg-white/5 border-white/10 text-white ml-8"
                  : "bg-black border-[#CCFF00]/10 text-white/90 mr-8 shadow-[inset_0_0_15px_rgba(204,255,0,0.02)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1.5 mb-1.5 text-[9px] text-white/40">
                <span className="flex items-center gap-1">
                  {m.sender === "user" ? (
                    <Cpu className="w-3 h-3 text-[#88AAFF]" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-[#CCFF00]" />
                  )}
                  {m.sender === "user" ? "RECRUITER_INQUIRY" : "AYUSH_AGENT_RESPONSE"}
                </span>
                <span>{m.timestamp}</span>
              </div>
              <p className="whitespace-pre-line leading-relaxed text-[11px] select-text">
                {m.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="p-3 border border-[#CCFF00]/15 bg-black text-white/95 mr-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
            <span className="text-[10px] uppercase animate-pulse text-[#CCFF00]">
              Generating Response... [LLM_COGNITION_ACTIVE]
            </span>
          </div>
        )}
      </div>

      {/* Pre-set prompt pills */}
      <div className="border-t border-white/5 pt-3 mb-3">
        <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-semibold">
          Query Templates:
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              disabled={loading}
              className="text-[9px] text-white/60 bg-white/5 border border-white/5 hover:border-[#CCFF00]/30 hover:text-white px-2 py-1 text-left truncate max-w-[280px] disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2"
      >
        <div className="text-[#CCFF00] font-bold text-sm select-none">&gt;</div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Ayush's AI anything... (e.g. skills, background, compilers)"
          disabled={loading}
          className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-[#CCFF00] focus:bg-white/[0.08] text-white placeholder-white/20 rounded-none disabled:opacity-50 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 bg-[#CCFF00] border border-[#CCFF00] hover:opacity-85 text-black disabled:opacity-30 disabled:border-white/10 disabled:bg-white/5 disabled:text-white/30 transition-all rounded-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
