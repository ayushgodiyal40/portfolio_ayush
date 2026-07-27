/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, RefObject, FormEvent } from "react";
import {
  Terminal,
  Award,
  HelpCircle,
  Code,
  Cpu,
  ChevronRight,
  Github,
  Mail,
  Phone,
  Sun,
  Moon,
  ChevronDown,
  Layers,
  Settings,
  Send,
  Sparkles,
  ExternalLink,
  Star,
  GitFork,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Twitter,
  Instagram
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SpiralAnimation } from "./components/ui/spiral-animation";
import ScrambleText from "./components/ScrambleText";
import Timeline from "./components/Timeline";
import Projects from "./components/Projects";
import AIChat from "./components/AIChat";

const ROTATING_WORDS = ["PURPOSE", "IMPACT", "INTENT", "PRECISION", "EFFICIENCY"];

const SKILLS_MATRIX = [
  {
    category: "FRONTEND CRAFT",
    skills: [
      { name: "React / Next.js", level: 95, detail: "High-performance interfaces and dynamic hooks" },
      { name: "Tailwind CSS", level: 98, detail: "Utility-first clean layout design and responsive spacing" },
      { name: "HTML5 & Semantic Web", level: 95, detail: "Accessible structure and modern SEO guidelines" },
      { name: "CSS3 / Animations", level: 92, detail: "Fluid layouts, keyframes, and Framer Motion transitions" }
    ]
  },
  {
    category: "BACKEND & SYSTEMS",
    skills: [
      { name: "Node.js & Express.js", level: 94, detail: "High-volume, secure serverless routing and APIs" },
      { name: "RESTful APIs", level: 95, detail: "Structured, decoupled endpoints and payload designs" },
      { name: "Auth & OAuth", level: 88, detail: "Secure session flows, JWT tokens, and Google/GitHub providers" },
      { name: "Python", level: 80, detail: "Systems algorithms, script utilities, and parser designs" },
      { name: "Java", level: 75, detail: "Object-oriented structures and classic design patterns" }
    ]
  },
  {
    category: "DATABASES & STORAGE",
    skills: [
      { name: "Firebase", level: 92, detail: "Real-time Firestore sync, hosting, and auth integration" },
      { name: "MongoDB", level: 88, detail: "Non-relational document models and aggregate pipelines" },
      { name: "MySQL / PostgreSQL", level: 85, detail: "Structured data normalization and query optimizations" }
    ]
  },
  {
    category: "TOOLS & WORKFLOWS",
    skills: [
      { name: "Git & GitHub Workflows", level: 94, detail: "Branching, pull-requests, and action deployment integrations" },
      { name: "Docker Containers", level: 82, detail: "Isolated environments and multi-container setups" }
    ]
  }
];

export default function App() {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [bioKey, setBioKey] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Custom Portrait Link State
  const [portraitUrl, setPortraitUrl] = useState(() => {
    const saved = localStorage.getItem("ayush_portrait_url");
    if (saved) {
      if (saved.includes("drive.google.com")) {
        const match = saved.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || saved.match(/id=([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          return `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
        }
      }
      return saved;
    }
    return "https://lh3.googleusercontent.com/d/18cU7ked8bXFj--Zt_sWEpGlOdO823fyE=w1000";
  });
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState("");

  // Contact Form states
  const [formData, setFormData] = useState({ name: "", email: "", role: "SDE / Engineering", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [contactFeedback, setContactFeedback] = useState("");

  // Section references for smooth scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Cycle headings every 4 seconds
  useEffect(() => {
    const headingInterval = setInterval(() => {
      setCurrentWordIdx((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 4000);
    return () => clearInterval(headingInterval);
  }, []);

  // Remount bio every 10 seconds to re-run character stagger entrance animation
  useEffect(() => {
    const bioInterval = setInterval(() => {
      setBioKey((prev) => prev + 1);
    }, 10000);
    return () => clearInterval(bioInterval);
  }, []);

  const scrollToSection = (elementRef: RefObject<HTMLDivElement | null>) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSavePortrait = (e: FormEvent) => {
    e.preventDefault();
    let finalUrl = tempUrl.trim();

    // Helper to convert standard Google Drive share links to clean direct embed link
    if (finalUrl.includes("drive.google.com")) {
      const match = finalUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || finalUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        finalUrl = `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
      }
    }

    if (finalUrl) {
      setPortraitUrl(finalUrl);
      localStorage.setItem("ayush_portrait_url", finalUrl);
    }
    setIsSettingOpen(false);
  };

  const handleResetPortrait = () => {
    const defaultUrl = "https://lh3.googleusercontent.com/d/18cU7ked8bXFj--Zt_sWEpGlOdO823fyE=w1000";
    setPortraitUrl(defaultUrl);
    localStorage.removeItem("ayush_portrait_url");
    setTempUrl("");
    setIsSettingOpen(false);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus("submitting");
    setContactFeedback("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormStatus("success");
        setContactFeedback(data.message || "Excellent. Your connection inquiry has been successfully transmitted.");
        setFormData({ name: "", email: "", role: "SDE / Engineering", message: "" });
      } else {
        setFormStatus("error");
        setContactFeedback(data.details || data.error || "ERR_API_TRANSMISSION: Port communication offline. Please verify and retry.");
      }
    } catch {
      setFormStatus("error");
      setContactFeedback("ERR_API_TRANSMISSION: Failed to reach server endpoint.");
    }
  };

  const bioText =
    "I am an enthusiastic and detail-oriented Full Stack Developer and Software Developer who bridges the gap between gorgeous aesthetics and robust engineering. I love designing and shipping clean, highly interactive applications, beautiful interfaces, and modern backend services. I strive for pixel precision, clean codebases, and meaningful design choices that elevate web experiences.";
  const bioLetters = Array.from(bioText);

  // Animation variants
  const bioContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.012 },
    },
  };

  const bioLetterVariants = {
    hidden: { opacity: 0, y: 4 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.1 } },
  };

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden flex flex-col transition-colors duration-500 select-none ${
        isDarkMode ? "bg-[#030014] text-white" : "bg-neutral-50 text-black"
      }`}
      id="root-portfolio-container"
    >
      {/* GSAP Spiral Starfield Animation Background (Z-0, Fixed in Background on Scroll) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-55 overflow-hidden">
        <SpiralAnimation isDarkMode={isDarkMode} />
      </div>

      {/* Sticky Navigation Header (Z-30) */}
      <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-[#030014]/75">
        <div
          onClick={() => scrollToSection(heroRef)}
          className="flex items-center gap-3 group cursor-pointer"
          id="logo-brand"
        >
          <span className={`font-display text-xl md:text-2xl tracking-widest uppercase transition-colors ${
            isDarkMode ? "text-white" : "text-black"
          }`}>
            AYUSH GODIYAL
          </span>
          <div className="w-8 h-8 rounded-none bg-[#CCFF00] text-black flex items-center justify-center font-bold text-base shadow-[0_0_12px_rgba(204,255,0,0.3)] group-hover:rotate-180 transition-transform duration-500">
            ✦
          </div>
        </div>

        {/* Scroll Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 font-mono text-[10px]">
          {[
            { label: "SKILLS", ref: skillsRef },
            { label: "ARCHIVES", ref: projectsRef },
            { label: "TIMELINE", ref: timelineRef },
            { label: "AI_AGENT", ref: aiRef },
            { label: "CONTACT", ref: contactRef },
          ].map((lnk) => (
            <button
              key={lnk.label}
              onClick={() => scrollToSection(lnk.ref)}
              className={`tracking-widest transition-colors cursor-pointer hover:text-[#CCFF00] font-semibold ${
                isDarkMode ? "text-white/60" : "text-black/60"
              }`}
            >
              // {lnk.label}
            </button>
          ))}
        </nav>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <a
            href="https://drive.google.com/file/d/1kwUJVCntnj-PYPywjRlRIfzfT4_0VYjk/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className={`px-3 py-2 text-xs font-mono tracking-widest border font-semibold transition-all rounded-none cursor-pointer flex items-center gap-1.5 ${
              isDarkMode
                ? "border-white/10 text-white/85 hover:border-[#CCFF00] hover:text-[#CCFF00] hover:bg-[#CCFF00]/5"
                : "border-black/15 text-black/85 hover:border-black hover:bg-black/5"
            }`}
          >
            RESUME_
          </a>

          <button
            onClick={() => scrollToSection(contactRef)}
            className="px-4 py-2 text-xs font-mono tracking-widest bg-[#CCFF00] border border-[#CCFF00] text-black font-semibold hover:opacity-85 transition-opacity shadow-[0_0_15px_rgba(204,255,0,0.25)] rounded-none cursor-pointer"
          >
            CONNECT_
          </button>
        </div>
      </header>

      {/* Scrollable Document Stream */}
      <div className="flex-1 flex flex-col relative z-20">

        {/* SECTION 1: HERO VIEWPORT SCREEN */}
        <section
          ref={heroRef}
          className="min-h-[calc(100vh-68px)] relative flex flex-col justify-between px-6 pb-8 lg:pb-12 border-b border-white/5"
          id="hero-screen-section"
        >
          {/* Content Wrapper */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between max-w-5xl mx-auto w-full pt-8 md:pt-12 lg:pb-16 z-20 relative gap-8 lg:gap-0">
            
            {/* Headline and bio content */}
            <div className="w-full lg:max-w-[55%] xl:max-w-[60%] flex flex-col justify-center text-center lg:text-left select-text space-y-6">
              <div className="space-y-1">
                <h1
                  className="font-display uppercase text-4xl sm:text-6xl md:text-6xl lg:text-[80px] leading-none tracking-tighter"
                  style={{
                    WebkitTextStroke: isDarkMode ? "1.5px rgba(255, 255, 255, 0.9)" : "1.5px rgba(0, 0, 0, 0.9)",
                    color: "transparent",
                  }}
                >
                  ENGINEER WITH
                </h1>
                <h2 className="font-display uppercase text-5xl sm:text-7xl md:text-7xl lg:text-[105px] leading-none tracking-tight text-[#CCFF00]">
                  <ScrambleText text={ROTATING_WORDS[currentWordIdx]} key={currentWordIdx} />
                </h2>
              </div>

              {/* Typewriter bio */}
              <div className="max-w-lg md:max-w-xl mx-auto lg:mx-0 min-h-[64px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={bioKey}
                    variants={bioContainerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className={`text-xs sm:text-sm font-sans leading-relaxed tracking-wide ${
                      isDarkMode ? "text-white/80" : "text-black/80"
                    }`}
                  >
                    {bioLetters.map((char, index) => (
                      <motion.span key={index} variants={bioLetterVariants}>
                        {char}
                      </motion.span>
                    ))}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Portrait Image Layer (Normal flex flow on mobile & tablet, Absolute on Laptop/Desktop) */}
            <div className="relative lg:absolute lg:right-4 xl:right-12 lg:bottom-12 xl:bottom-16 z-30 pointer-events-auto flex flex-col items-center justify-end w-full lg:w-auto">
              <div className="relative flex flex-col items-center overflow-visible pb-4 lg:pb-0">
                <img
                  src={portraitUrl}
                  alt="Ayush Godiyal Model"
                  referrerPolicy="no-referrer"
                  className={`h-[28vh] sm:h-[32vh] md:h-[38vh] lg:h-[50vh] xl:h-[52vh] max-h-[350px] lg:max-h-[550px] object-contain transition-transform duration-700 ease-out select-none cursor-pointer scale-[1.01] hover:scale-[1.04] ${
                    isDarkMode
                      ? "brightness-95 contrast-125 drop-shadow-[0_15px_30px_rgba(0,0,0,0.65)]"
                      : "brightness-105 contrast-110 drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
                  }`}
                  onError={(e) => {
                    // Fallback if user's custom URL fails
                    e.currentTarget.src = "https://lh3.googleusercontent.com/d/18cU7ked8bXFj--Zt_sWEpGlOdO823fyE=w1000";
                  }}
                />

                {/* Social Media Handles under Photo */}
                <div className="mt-4 flex items-center justify-center gap-3 z-20">
                  <a
                    href="mailto:ayushgodiyal40@gmail.com"
                    className="group flex items-center justify-center w-9 h-9 rounded-full bg-[#EA4335]/15 border border-[#EA4335]/40 hover:border-[#EA4335] hover:bg-[#EA4335]/30 hover:shadow-[0_0_12px_rgba(234,67,53,0.4)] transition-all duration-300"
                    title="Email: ayushgodiyal40@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Mail className="w-4 h-4 text-[#EA4335] group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://github.com/ayushgodiyal40"
                    className="group flex items-center justify-center w-9 h-9 rounded-full bg-white/15 border border-white/40 hover:border-white hover:bg-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
                    title="GitHub: ayushgodiyal40"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ayush-godiyal-0b99a4285/"
                    className="group flex items-center justify-center w-9 h-9 rounded-full bg-[#0077B5]/15 border border-[#0077B5]/40 hover:border-[#0077B5] hover:bg-[#0077B5]/30 hover:shadow-[0_0_12px_rgba(0,119,181,0.4)] transition-all duration-300"
                    title="LinkedIn: Ayush Godiyal"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin className="w-4 h-4 text-[#0077B5] group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://x.com/AyushGodiy31814"
                    className="group flex items-center justify-center w-9 h-9 rounded-full bg-[#1DA1F2]/15 border border-[#1DA1F2]/40 hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/30 hover:shadow-[0_0_12px_rgba(29,161,242,0.4)] transition-all duration-300"
                    title="Twitter / X: @AyushGodiy31814"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Twitter className="w-4 h-4 text-[#1DA1F2] group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://www.instagram.com/ayush_.godiyal/"
                    className="group flex items-center justify-center w-9 h-9 rounded-full bg-[#E1306C]/15 border border-[#E1306C]/40 hover:border-[#E1306C] hover:bg-[#E1306C]/30 hover:shadow-[0_0_12px_rgba(225,48,108,0.4)] transition-all duration-300"
                    title="Instagram: @ayush_.godiyal"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Instagram className="w-4 h-4 text-[#E1306C] group-hover:scale-110 transition-transform" />
                  </a>
                </div>

                {/* Floating Settings Tool in Hero */}
                <div className="relative mt-3 lg:mt-0 lg:absolute lg:left-0 lg:bottom-24 xl:bottom-20 z-30 lg:-translate-x-[20%]">
                  <button
                    onClick={() => {
                      setTempUrl(portraitUrl);
                      setIsSettingOpen(true);
                    }}
                    className="p-2 bg-black/85 border border-white/10 hover:border-[#CCFF00] text-[#CCFF00] hover:bg-black/95 transition-all rounded-none flex items-center gap-1.5 text-[9px] font-mono tracking-widest"
                    title="Configure Custom Portrait Image Link"
                  >
                    <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                    PORTRAIT_CFG
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Scrolling Navigation hint */}
          <div className="relative z-20 flex flex-col items-center justify-center gap-1 cursor-pointer pt-4 pb-2" onClick={() => scrollToSection(skillsRef)}>
            <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">SCROLL FOR SPECIFICATIONS</span>
            <ChevronDown className="w-4 h-4 text-[#CCFF00] animate-bounce" />
          </div>
        </section>


        {/* SECTION 2: TECHNICAL SKILLS MATRIX */}
        <section
          ref={skillsRef}
          className="py-24 px-6 max-w-5xl mx-auto w-full border-b border-white/5"
          id="skills-matrix-section"
        >
          <div className="space-y-2 mb-12 text-center md:text-left">
            <span className="text-xs font-mono text-[#CCFF00] tracking-[0.2em] uppercase font-bold block">
              // CSE COMPETENCIES
            </span>
            <h2 className="font-display uppercase text-3xl sm:text-5xl tracking-wide">
              TECHNICAL MATRIX
            </h2>
            <p className={`text-xs max-w-xl font-sans ${isDarkMode ? "text-white/50" : "text-black/50"}`}>
              Demonstrated engineering expertise across computer science tracks including compiler architectures, containerized microservices, and neural inference workloads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SKILLS_MATRIX.map((group, idx) => (
              <div
                key={idx}
                className="bg-black/30 border border-white/5 p-6 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-5">
                  <Layers className="w-4 h-4 text-[#CCFF00]" />
                  <span className="font-display tracking-widest text-xs uppercase text-white/90">
                    {group.category}
                  </span>
                </div>

                <div className="space-y-5">
                  {group.skills.map((s) => (
                    <div key={s.name} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-white/80">{s.name}</span>
                        <span className="font-mono text-[#CCFF00] font-semibold">{s.level}%</span>
                      </div>

                      {/* Custom indicator bar */}
                      <div className="w-full h-1.5 bg-white/5 border border-white/10">
                        <div
                          className="h-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.5)] transition-all duration-1000"
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-white/30 block">
                        {s.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* SECTION 3: SYSTEM PROJECTS COMPONENT */}
        <section
          ref={projectsRef}
          className="py-24 px-6 max-w-5xl mx-auto w-full border-b border-white/5"
          id="project-archives-section"
        >
          <div className="space-y-2 mb-12 text-center md:text-left">
            <span className="text-xs font-mono text-[#CCFF00] tracking-[0.2em] uppercase font-bold block">
              // ARTIFACTS
            </span>
            <h2 className="font-display uppercase text-3xl sm:text-5xl tracking-wide">
              PROJECT ARCHIVES
            </h2>
            <p className={`text-xs max-w-xl font-sans ${isDarkMode ? "text-white/50" : "text-black/50"}`}>
              Rigorous codebases covering compilers, multitasking microkernels, peer-to-peer consensus chains, and serverless neural layers.
            </p>
          </div>

          <Projects />
        </section>


        {/* SECTION 4: INTERNSHIP EXPERIENCE & TIMELINE */}
        <section
          ref={timelineRef}
          className="py-24 px-6 max-w-5xl mx-auto w-full border-b border-white/5"
          id="credentials-timeline-section"
        >
          <div className="space-y-2 mb-12 text-center md:text-left">
            <span className="text-xs font-mono text-[#CCFF00] tracking-[0.2em] uppercase font-bold block">
              // MILESTONES & HISTORY
            </span>
            <h2 className="font-display uppercase text-3xl sm:text-5xl tracking-wide">
              EXPERIENCE & CREDENTIALS
            </h2>
            <p className={`text-xs max-w-xl font-sans ${isDarkMode ? "text-white/50" : "text-black/50"}`}>
              Investigate internships, certified validation milestones, and deep academic tracking in BTech Computer Science.
            </p>
          </div>

          <Timeline />
        </section>


        {/* SECTION 5: AI CAREER AGENT CONSOLE */}
        <section
          ref={aiRef}
          className="py-24 px-6 max-w-5xl mx-auto w-full border-b border-white/5"
          id="ai-agent-console-section"
        >
          <div className="space-y-2 mb-8 text-center md:text-left">
            <span className="text-xs font-mono text-[#CCFF00] tracking-[0.2em] uppercase font-bold block">
              // SERVER COGNITION
            </span>
            <h2 className="font-display uppercase text-3xl sm:text-5xl tracking-wide">
              CAREER CHAT CONSOLE
            </h2>
            <p className={`text-xs max-w-xl font-sans ${isDarkMode ? "text-white/50" : "text-black/50"}`}>
              Directly query the server-backed Gemini assistant loaded with Ayush's comprehensive skills data, course scores, and relocation terms.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-md border border-white/5 p-1">
            <AIChat />
          </div>
        </section>


        {/* SECTION 6: CONTACT TERMINAL */}
        <section
          ref={contactRef}
          className="py-24 px-6 max-w-5xl mx-auto w-full"
          id="connect-terminal-section"
        >
          <div className="space-y-2 mb-12 text-center md:text-left">
            <span className="text-xs font-mono text-[#CCFF00] tracking-[0.2em] uppercase font-bold block">
              // TRANSMIT AN ENQUIRY
            </span>
            <h2 className="font-display uppercase text-3xl sm:text-5xl tracking-wide">
              CONNECT TERM_
            </h2>
            <p className={`text-xs max-w-xl font-sans ${isDarkMode ? "text-white/50" : "text-black/50"}`}>
              Initiate contact for SDE engineering positions, full-time work collaborations, or research reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-black/30 border border-white/5 p-6 space-y-4">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-bold">
                  DIRECT CHANNELS
                </span>
                <div className="space-y-3 font-mono text-xs text-white/80">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#CCFF00]" />
                      <a href="mailto:ayushgodiyal40@gmail.com" className="hover:underline">
                        ayushgodiyal40@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3 pl-7 text-[10px] text-white/50">
                      <span className="text-[#CCFF00]/60">ALT //</span>
                      <a href="mailto:ayushgodiyal.in@gmail.com" className="hover:underline">
                        ayushgodiyal.in@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#CCFF00]" />
                    <span>+91 6360545946</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Github className="w-4 h-4 text-[#CCFF00]" />
                    <a href="https://github.com/ayushgodiyal40" target="_blank" rel="noreferrer" className="hover:underline">
                      github.com/ayushgodiyal40
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-[#CCFF00]" />
                    <a href="https://www.linkedin.com/in/ayush-godiyal-0b99a4285/" target="_blank" rel="noreferrer" className="hover:underline">
                      linkedin.com/ayush-godiyal
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Twitter className="w-4 h-4 text-[#CCFF00]" />
                    <a href="https://x.com/AyushGodiy31814" target="_blank" rel="noreferrer" className="hover:underline">
                      x.com/AyushGodiy31814
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="w-4 h-4 text-[#CCFF00]" />
                    <a href="https://www.instagram.com/ayush_.godiyal/" target="_blank" rel="noreferrer" className="hover:underline">
                      instagram.com/ayush_.godiyal
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 border border-white/5 p-6">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-bold mb-2">
                  CSE METADATA
                </span>
                <p className="text-[11px] font-mono text-white/50 leading-relaxed">
                  SYSTEM STATUS: ACTIVE<br />
                  SDE READY: YES // 2026<br />
                  GLOBAL RE-LOCATION: APPROVED
                </p>
              </div>
            </div>

            <div className="md:col-span-2 bg-black/30 backdrop-blur-md border border-white/5 p-8">
              {formStatus === "success" ? (
                <div className="space-y-4 text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-[#CCFF00] mx-auto" />
                  <h4 className="font-display uppercase text-xl text-white">TRANSMISSION RECEIVED_</h4>
                  <p className="text-xs text-white/80 font-sans max-w-md mx-auto leading-relaxed">
                    {contactFeedback || "Excellent. Your connection inquiry has been successfully transmitted to Ayush's secure email. He will contact you back in under 24 hours."}
                  </p>
                  <button
                    onClick={() => setFormStatus("idle")}
                    className="mt-4 px-4 py-2 bg-[#CCFF00] text-black font-mono text-xs uppercase font-semibold hover:opacity-80 transition-all cursor-pointer"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alexis Vance"
                        className="w-full bg-transparent border-b border-white/10 pb-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#CCFF00] transition-colors rounded-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alexis@company.com"
                        className="w-full bg-transparent border-b border-white/10 pb-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#CCFF00] transition-colors rounded-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">
                      Connection Category
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-[#333333] border-b border-white/10 pb-2 text-xs text-white focus:outline-none focus:border-[#CCFF00] transition-colors rounded-none"
                    >
                      <option value="SDE / Engineering">Full-time Software Engineering (SDE)</option>
                      <option value="Internship Collaboration">Internship Opportunity</option>
                      <option value="Open-Source / Labs">Research or Labs Collaboration</option>
                      <option value="General Inquiry">General Inquiries</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">
                      Message Body
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your project scope or interview schedule details here..."
                      className="w-full bg-transparent border-b border-white/10 pb-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#CCFF00] transition-colors resize-none rounded-none"
                    />
                  </div>

                  {formStatus === "error" && (
                    <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-[11px] font-mono flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{contactFeedback || "ERR_API_TRANSMISSION: Port communication offline. Please verify and retry."}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="w-full py-3 bg-[#CCFF00] hover:opacity-85 text-black font-semibold text-xs tracking-widest font-mono uppercase transition-all rounded-none shadow-[0_4px_20px_rgba(204,255,0,0.15)] flex items-center justify-center gap-2"
                  >
                    {formStatus === "submitting" ? (
                      <>
                        <Terminal className="w-4 h-4 animate-spin" />
                        TRANSMITTING INQUIRY...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        SUBMIT INQUIRY TO SYSTEM
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* Infinite Horizontal Scroll Marquee (Z-30) */}
      <footer className="relative z-30 overflow-hidden border-t border-white/5 py-4 bg-[#030014]/80 backdrop-blur-md">
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee flex gap-12 text-sm sm:text-lg font-display uppercase tracking-[0.2em] select-none text-transparent">
            {[...Array(6)].map((_, idx) => (
              <span
                key={idx}
                style={{
                  WebkitTextStroke: "1px rgba(255, 255, 255, 0.15)",
                }}
              >
                AYUSH GODIYAL // BTECH COMPUTER SCIENCE & ENGINEERING // FULL STACK DEVELOPER & SOFTWARE ENGINEER // CREATIVE CODING // DEHRADUN //
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* CUSTOM PORTRAIT LINK CONFIG MODAL */}
      <AnimatePresence>
        {isSettingOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
              onClick={() => setIsSettingOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-4 max-w-md mx-auto top-1/4 bg-[#333333] border border-white/10 p-6 z-50 shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <span className="font-display text-sm tracking-wider uppercase text-[#CCFF00]">
                  CONFIGURE CUSTOM PORTRAIT
                </span>
                <button
                  onClick={() => setIsSettingOpen(false)}
                  className="text-white/40 hover:text-white font-mono text-xs"
                >
                  [CLOSE]
                </button>
              </div>

              <form onSubmit={handleSavePortrait} className="space-y-4">
                <p className="text-[11px] text-white/60 leading-relaxed font-sans">
                  Paste any public image link or your shared Google Drive link (e.g. 
                  <code className="text-[#CCFF00] bg-black/40 px-1 py-0.5 mx-0.5 font-mono">https://drive.google.com/file/d/ID/view</code>) 
                  below. We will parse it and display your custom portrait live instantly!
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">
                    Portrait Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="e.g. https://domain.com/picture.png"
                    className="w-full bg-black/30 border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-[#CCFF00] text-white placeholder-white/20 font-mono rounded-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetPortrait}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-[10px] uppercase font-bold"
                  >
                    RESET DEFAULT
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#CCFF00] text-black font-mono text-[10px] uppercase font-bold hover:opacity-85"
                  >
                    SAVE CHANGES
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
