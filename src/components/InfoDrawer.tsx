/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from "react";
import { X, ArrowLeft, Send, Sparkles, Terminal, Mail, Phone, Calendar, Award } from "lucide-react";
import { motion } from "motion/react";
import AIChat from "./AIChat";
import Timeline from "./Timeline";
import Projects from "./Projects";

interface InfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "menu" | "projects" | "timeline" | "ai" | "contact";
}

export default function InfoDrawer({ isOpen, onClose, initialTab = "menu" }: InfoDrawerProps) {
  const [activeTab, setActiveTab] = useState<"menu" | "projects" | "timeline" | "ai" | "contact">(initialTab);

  // Form states
  const [formData, setFormData] = useState({ name: "", email: "", role: "SDE / Engineering", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [contactFeedback, setContactFeedback] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus("submitting");
    setContactFeedback("");

    try {
      // Post form to Express API endpoint
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormStatus("success");
        setContactFeedback(data.message || "Thank you! Your message has been received and processed successfully.");
        setFormData({ name: "", email: "", role: "SDE / Engineering", message: "" });
      } else {
        setFormStatus("error");
        setContactFeedback(data.details || data.error || "A system-level transmission overhead occurred. Please try again.");
      }
    } catch {
      setFormStatus("error");
      setContactFeedback("Failed to reach the portfolio transmission endpoint. Check your network.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/75 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        id="drawer-backdrop"
      />

      {/* Slide out Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 180 }}
        className="fixed right-0 top-0 bottom-0 w-full sm:max-w-xl md:max-w-2xl bg-[#333333] border-l border-white/5 z-50 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden text-white"
        id="info-drawer"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-[#333333]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {activeTab !== "menu" && (
              <button
                onClick={() => setActiveTab("menu")}
                className="p-1 text-white/60 hover:text-white transition-colors"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="font-display uppercase text-lg tracking-wider">
              {activeTab === "menu" && "AYUSH'S CONSOLE"}
              {activeTab === "projects" && "SPEC_SHEETS & LABS"}
              {activeTab === "timeline" && "INTERNSHIPS & TIMELINE"}
              {activeTab === "ai" && "AI CAREER AGENT_"}
              {activeTab === "contact" && "CONNECT_"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 bg-white/5 border border-white/10 hover:border-[#CCFF00] text-white hover:text-[#CCFF00] transition-colors rounded-none"
            title="Close Console"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* Menu Dashboard */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              {/* Short professional summary */}
              <div className="bg-white/[0.02] border border-white/5 p-5 space-y-3">
                <span className="text-[10px] font-mono text-[#CCFF00] uppercase tracking-widest block font-bold">
                  BTECH CSE // SYSTEMS ENGINEER
                </span>
                <p className="text-xs text-white/80 leading-relaxed font-sans">
                  Ayush Godiyal is a CSE undergraduate focused on compiler systems, containerized cloud services, and custom WebGL layouts. Explore his technical specs below or inquire instantly with the server-side AI chatbot.
                </p>
                <div className="flex flex-col gap-2 pt-2 border-t border-white/5 text-[11px] font-mono text-white/50">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#CCFF00]" />
                      <span>ayushgodiyal40@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2 pl-6 text-[10px] text-white/40">
                      <span className="text-[#CCFF00]/50">ALT //</span>
                      <span>ayushgodiyal.in@gmail.com</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#CCFF00]" />
                    <span>+91 6360545946</span>
                  </div>
                </div>
              </div>

              {/* Sub-panels triggers */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: "projects",
                    label: "01 // PROJECT ARCHIVES",
                    desc: "Interactive spec sheets for systems, compilers, and ML edge tools.",
                  },
                  {
                    id: "timeline",
                    label: "02 // ACADEMICS & TIMELINE",
                    desc: "Comprehensive list of internships, BTech CSE courses, and certificates.",
                  },
                  {
                    id: "ai",
                    label: "03 // TALK WITH AI AGENT",
                    desc: "Query a custom Gemini-powered agent configured with Ayush's professional background.",
                    highlight: true,
                  },
                  {
                    id: "contact",
                    label: "04 // INITIATE CONNECT",
                    desc: "Quick contact form to pitch collaborations, schedule interviews, or commission work.",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`p-5 text-left border transition-all relative overflow-hidden group rounded-none ${
                      item.highlight
                        ? "bg-[#CCFF00]/5 border-[#CCFF00]/30 hover:border-[#CCFF00]"
                        : "bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-display text-sm md:text-base tracking-widest ${
                          item.highlight ? "text-[#CCFF00]" : "text-white"
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.highlight && <Sparkles className="w-4 h-4 text-[#CCFF00] animate-pulse" />}
                    </div>
                    <p className="text-[11px] text-white/60 font-sans leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sub-panel 1: Projects list */}
          {activeTab === "projects" && <Projects />}

          {/* Sub-panel 2: Internships and certificates timeline */}
          {activeTab === "timeline" && <Timeline />}

          {/* Sub-panel 3: AI Chatbot */}
          {activeTab === "ai" && (
            <div className="space-y-4">
              <p className="text-xs text-white/60 leading-relaxed font-sans">
                Recruiters and visitors can chat directly with Ayush's smart career agent. Ask questions like: <em className="text-[#CCFF00] font-mono not-italic">"What languages is Ayush familiar with?"</em> or <em className="text-[#CCFF00] font-mono not-italic">"Is he willing to relocate?"</em>.
              </p>
              <AIChat />
            </div>
          )}

          {/* Sub-panel 4: Let's Work Contact Form */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="space-y-1.5 border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono text-[#CCFF00] uppercase tracking-wider block font-bold">
                  TRANSMIT AN INQUIRY
                </span>
                <p className="text-xs text-white/60 font-sans leading-relaxed">
                  Send a fast encrypted message directly to Ayush's professional inbox. Fill out the fields below to trigger an automated notification.
                </p>
              </div>

              {formStatus === "success" ? (
                <div className="p-6 bg-white/[0.02] border border-[#CCFF00] space-y-3">
                  <span className="text-[#CCFF00] font-mono text-sm block font-bold">
                    [TRANSMISSION SUCCESSFUL]
                  </span>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">
                    {contactFeedback || "Thank you! Your message has been received and processed successfully. Ayush will follow up at your provided email address within 24 hours."}
                  </p>
                  <button
                    onClick={() => setFormStatus("idle")}
                    className="mt-2 text-xs font-mono text-[#CCFF00] underline"
                  >
                    SEND ANOTHER INQUIRY
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">
                      Your Name // Company
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alexis Vance // Google Cloud SDE"
                      className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#CCFF00] transition-all font-sans rounded-none"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. alexis.vance@work.com"
                      className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#CCFF00] transition-all font-sans rounded-none"
                    />
                  </div>

                  {/* Role / Inquiry type */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">
                      Connection Category
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-[#333333] border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-[#CCFF00] transition-all font-sans rounded-none"
                    >
                      <option value="SDE / Engineering" className="bg-[#333333] text-white">Full-time Software Engineering (SDE)</option>
                      <option value="Internship Collaboration" className="bg-[#333333] text-white">Internship Opportunities</option>
                      <option value="Open-Source / Labs" className="bg-[#333333] text-white">Research or Labs Collaboration</option>
                      <option value="General Inquiry" className="bg-[#333333] text-white">General Inquiry / Saying Hello</option>
                    </select>
                  </div>

                  {/* Message field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">
                      Message Body
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your project scope, interview schedule, or inquiry details here..."
                      className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#CCFF00] transition-all font-sans resize-none rounded-none"
                    />
                  </div>

                  {formStatus === "error" && (
                    <p className="text-xs font-mono text-red-400">
                      {contactFeedback || "ERR_API_TRANSMISSION: Unable to send the inquiry. Please verify server status and try again."}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="w-full bg-[#CCFF00] hover:opacity-85 text-black font-semibold text-xs py-3 tracking-widest font-mono uppercase transition-all rounded-none shadow-[0_4px_20px_rgba(204,255,0,0.15)] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {formStatus === "submitting" ? (
                      <>
                        <Terminal className="w-4 h-4 animate-spin" />
                        TRANSMITTING...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        SUBMIT CONNECT REQUEST
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
