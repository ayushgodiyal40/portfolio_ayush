/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Project } from "../types";
import { FolderGit2, Star, GitFork, ExternalLink, Github, Code, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PROJECTS_DATA: Project[] = [
  {
    id: "proj-1",
    title: "Custom C-to-Python Compiler",
    description: "A custom source-to-source compiler designed to translate C code into clean, executable Python scripts, incorporating full lexical analysis, AST generation, semantic validation, and type-mapping optimizations.",
    longDescription: "A custom source-to-source compiler designed to translate C code into clean, executable Python scripts. It incorporates full lexical analysis, AST generation, semantic validation, and type-mapping optimizations. Successfully translates complex recursive functions, loops, and arithmetic structures with accurate runtime behavior preservation.",
    tags: ["Python", "C", "Compiler Design", "Lexical Analysis", "AST", "Tokenization"],
    category: "Systems",
    githubUrl: "https://github.com/ayushgodiyal40/Custom_compiler_c_to_python",
    // liveUrl: "https://compiler.ayushgodiyal.dev",
    stars: 148,
    forks: 24,
  },
  {
    id: "proj-2",
    title: "E-Learning Platform",
    description: "A rich visual student hub teaching designer principles, full of streaming lectures, custom quizzes, dark-mode compatibility, and dynamic progress metrics.",
    longDescription: "A rich visual student hub teaching designer principles, full of streaming lectures, custom quizzes, dark-mode compatibility, and dynamic progress metrics. Delivered a seamless self-paced study experience, boosting student engagement through interactive quizzes and real-time progress analytics.",
    tags: ["Next.js", "Tailwind CSS", "React", "YouTube Embedded API", "State Management"],
    category: "FullStack",
    githubUrl: "https://github.com/ayushgodiyal40/E-learning-platform",
    // liveUrl: "https://canvas-learn.ayushgodiyal.dev",
    stars: 125,
    forks: 18,
  }
  // ,
  // {
  //   id: "proj-3",
  //   title: "Hermes AI Serverless Engine",
  //   description: "Distributed serverless inference engine that segments deep learning transformer execution across edge node clusters with dynamic tensor scheduling.",
  //   longDescription: "Hermes orchestrates deep-learning model slices across multiple localized edge nodes. Implements custom pipeline parallelism, splitting layer matrices dynamically based on individual node capacities, decreasing single-machine latency by 60% for open-weight models.",
  //   tags: ["Python", "ONNX", "PyTorch", "gRPC", "AI Engineering"],
  //   category: "AI/ML",
  //   githubUrl: "https://github.com/ayushgodiyal40/hermes-inference",
  //   liveUrl: "https://github.com/ayushgodiyal40/hermes-inference",
  //   stars: 156,
  //   forks: 22,
  // },
  // {
  //   id: "proj-4",
  //   title: "Aura Ledger BFT",
  //   description: "A high-throughput decentralized blockchain consensus engine built in Go, employing Byzantine Fault Tolerance (BFT) and a customized execution virtual machine.",
  //   longDescription: "Aura Ledger is a distributed peer-to-peer state machine built in Go. Employs a custom BFT voting scheme for fast block finality (under 1.5 seconds) and features an isolated execution sandbox VM supporting state queries and transactional validation.",
  //   tags: ["Go", "Cryptography", "BFT Consensus", "gRPC", "Distributed Systems"],
  //   category: "Cloud",
  //   githubUrl: "https://github.com/ayushgodiyal40/aura-ledger",
  //   stars: 210,
  //   forks: 54,
  // },
];

const GITHUB_REPOS = [
  {
    name: "Custom_compiler_c_to_python",
    desc: "A custom source-to-source compiler designed to translate C code into clean, executable Python scripts, incorporating full lexical analysis, AST generation, semantic validation, and type-mapping optimizations.",
    lang: "Python",
    stars: 148,
    forks: 24,
    updated: "2 days ago",
  },
  {
    name: "E-learning-platform",
    desc: "A rich visual student hub teaching designer principles, full of streaming lectures, custom quizzes, dark-mode compatibility, and dynamic progress metrics.",
    lang: "TypeScript",
    stars: 125,
    forks: 18,
    updated: "3 days ago",
  }
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState<"projects" | "github">("projects");
  const [categoryFilter, setCategoryFilter] = useState<"All" | "Systems" | "AI/ML" | "FullStack" | "Cloud">("All");
  const [selectedProj, setSelectedProj] = useState<string | null>(null);

  const filteredProjects = PROJECTS_DATA.filter(
    (p) => categoryFilter === "All" || p.category === categoryFilter
  );

  return (
    <div className="space-y-6" id="portfolio-projects">
      {/* Portfolio Grid Tabs */}
      <div className="flex border-b border-white/5 pb-4 items-center justify-between gap-4 flex-col sm:flex-row">
        <div className="flex bg-white/[0.03] border border-white/5 p-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-mono tracking-wider transition-all uppercase ${
              activeTab === "projects"
                ? "bg-[#CCFF00] text-black font-semibold shadow-[0_0_12px_rgba(204,255,0,0.15)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Elite CSE Projects
          </button>
          <button
            onClick={() => setActiveTab("github")}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-mono tracking-wider transition-all uppercase flex items-center justify-center gap-1.5 ${
              activeTab === "github"
                ? "bg-[#CCFF00] text-black font-semibold shadow-[0_0_12px_rgba(204,255,0,0.15)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Github className="w-4 h-4" />
            GitHub Repos
          </button>
        </div>

        {/* Categories (Only for native Projects Tab) */}
        {activeTab === "projects" && (
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto justify-start sm:justify-end">
            {(["All", "Systems", "AI/ML", "FullStack", "Cloud"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 text-[10px] font-mono border transition-all uppercase ${
                  categoryFilter === cat
                    ? "bg-white/10 border-[#CCFF00] text-[#CCFF00]"
                    : "bg-transparent border-white/5 text-white/50 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid Render */}
      <AnimatePresence mode="wait">
        {activeTab === "projects" ? (
          <motion.div
            key="projects-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {filteredProjects.map((p) => {
              const isExpanded = selectedProj === p.id;
              return (
                <div
                  key={p.id}
                  className={`flex flex-col border p-6 transition-all duration-300 ${
                    isExpanded
                      ? "bg-white/[0.04] border-[#CCFF00] md:col-span-2 shadow-[inset_0_0_25px_rgba(204,255,0,0.02)]"
                      : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-0.5 border border-[#CCFF00]/15 uppercase">
                        {p.category}
                      </span>
                      <h4 className="text-base md:text-lg font-display uppercase tracking-wider text-white mt-2">
                        {p.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3.5 text-xs font-mono text-white/40">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span>{p.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-[#88AAFF]" />
                        <span>{p.forks}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed mb-4 flex-1">
                    {isExpanded ? p.longDescription : p.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <button
                      onClick={() => setSelectedProj(isExpanded ? null : p.id)}
                      className="text-[10px] font-mono text-[#CCFF00] hover:underline"
                    >
                      {isExpanded ? "COLLAPSE VIEW" : "READ FULL SPEC"}
                    </button>

                    <div className="flex items-center gap-3">
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-white/5 border border-white/10 hover:border-[#CCFF00] rounded-none text-white transition-colors"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-[#CCFF00] border border-[#CCFF00] hover:opacity-80 rounded-none text-black transition-opacity"
                          title="Interactive Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="github-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {GITHUB_REPOS.map((repo) => (
              <div
                key={repo.name}
                className="bg-black/30 border border-white/5 p-6 hover:border-[#CCFF00]/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-white/80 group-hover:text-[#CCFF00] transition-colors">
                      <FolderGit2 className="w-5 h-5 text-[#CCFF00]" />
                      <span className="font-mono text-sm font-semibold">{repo.name}</span>
                    </div>
                    <span className="text-[9px] font-mono text-white/30">{repo.updated}</span>
                  </div>

                  <p className="text-xs text-white/60 font-sans leading-relaxed mb-4">
                    {repo.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-400" />
                      <span>{repo.lang}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-white/30" />
                      <span>{repo.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-3 h-3 text-white/30" />
                      <span>{repo.forks}</span>
                    </div>
                  </div>

                  <a
                    href={`https://github.com/ayushgodiyal40/${repo.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/40 hover:text-[#CCFF00] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
