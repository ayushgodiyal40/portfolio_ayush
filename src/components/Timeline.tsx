/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { TimelineItem } from "../types";
import { Briefcase, GraduationCap, Award, Search, Calendar, ChevronRight, FileText, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const INITIAL_TIMELINE: TimelineItem[] = [
  // {
  //   id: "exp-1",
  //   year: "May 2025 - Present",
  //   title: "Software Engineer Intern",
  //   subtitle: "DevCloud Solutions",
  //   description: "Designed serverless API middleware supporting 10K+ concurrent requests. Optimized slow database queries by 45% using Redis caching and specialized PostgreSQL indexing. Automated testing pipelines using GitHub Actions and containerized Docker environments.",
  //   type: "experience",
  //   tags: ["Systems", "Express", "PostgreSQL", "Docker", "Redis", "TypeScript"],
  // },
  // {
  //   id: "exp-2",
  //   year: "Jan 2025 - Apr 2025",
  //   title: "AI Research Assistant",
  //   subtitle: "Intellect Labs",
  //   description: "Collaborated on low-rank adaptation (LoRA) for transformer configurations. Finetuned semantic translation pipelines and deployed edge inference workers via highly responsive WebGL client runtimes.",
  //   type: "experience",
  //   tags: ["AI/ML", "Python", "Transformers", "ONNX", "Semantic Parser"],
  // },
  {
    id: "edu-1",
    year: "2023 - 2027",
    title: "B.Tech in Computer Science & Engineering",
    subtitle: "Graphic Era Hill University, Dehradun",
    description: "CGPA: 7.94/10.0 (After Completion of 6th Semester). Pursuing specialized studies in software engineering, advanced compiler design, database query optimizations, and distributed services.",
    type: "education",
    tags: ["Academics", "OOPS", "Data Structures and Algorithms", "Compiler Design", "DBMS","Operating System","Computer Networks"],
    marksheets: [
      { term: "Semester 1", url: "https://drive.google.com/file/d/1agHIgKZeCyQtRtUNvgTzKjXywavrAcJ5/view?usp=sharing" },
      { term: "Semester 2", url: "https://drive.google.com/file/d/1AhyYjd9eyxYucGg7zrPuIHcIVCs0himC/view?usp=sharing" },
      { term: "Semester 3", url: "https://drive.google.com/file/d/19XtM4VISq8nyU_D932vjb1pcuFRfEEtv/view?usp=sharing" },
      { term: "Semester 4", url: "https://drive.google.com/file/d/14dgCGo7HvsclKwVeOxXdEtkD0RfsG1id/view?usp=sharing" },
      { term: "Semester 5", url: "https://drive.google.com/file/d/10DE8_-xNxkthm8-tQSIeGLHpteE32z2b/view?usp=sharing" },
      { term: "Semester 6", url: "https://drive.google.com/file/d/10vkyeHoXzXt_nnAcI_Q-kLiIr65Oz1nq/view?usp=sharing" },
    ],
  },
  {
    id: "cert-1",
    year: "Issued Apr 2026",
    title: "Software Engineering Job Simulation",
    subtitle: "JPMorgan Chase & Co.",
    description: "Completed real-world software engineering tasks focusing on data visualization, systems architecture, and engineering optimizations.",
    type: "certificate",
    tags: ["SDE", "React", "Data Visualization", "JPMorgan"],
    verificationUrl: "https://drive.google.com/file/d/169s7wNGJIjwhxJWlemZDxqB7VYoVZNu1/view?usp=drive_link",
  },
  {
    id: "cert-2",
    year: "Issued Apr 2026",
    title: "AWS Cloud Practitioner Essentials",
    subtitle: "Coursera / Amazon Web Services",
    description: "Validated fundamental cloud literacy, core AWS services, security structures, architecture strategies, and cloud pricing configurations.",
    type: "certificate",
    tags: ["Cloud", "AWS", "Security", "Infrastructure"],
    verificationUrl: "https://drive.google.com/file/d/1VAzVhwRDI7AIcfLkmQ4WZcSl1HbWRuUa/view?usp=sharing",
  },
  {
    id: "cert-3",
    year: "Issued Aug 2024",
    title: "Software Conceptual Design",
    subtitle: "NPTEL SWAYAM",
    description: "Achieved elite academic metrics in software conceptual design, UML architecture maps, and decoupled service modeling.",
    type: "certificate",
    tags: ["Systems", "Software Design", "UML", "Architecture"],
    verificationUrl: "https://drive.google.com/file/d/11IHPTzt2mKhzHMD9zHWGsqr21VZRS8rK/view?usp=drive_link",
  },
  {
    id: "cert-4",
    year: "Issued Jun 2025",
    title: "Introduction to Cloud Computing",
    subtitle: "Simplilearn",
    description: "Validated core cloud concepts, deployment patterns (IaaS, PaaS, SaaS), cloud storage optimization, and resource scaling methodologies.",
    type: "certificate",
    tags: ["Cloud", "SaaS", "Virtualization", "Scaling"],
    verificationUrl: "https://drive.google.com/file/d/1_BHr8d9LKYE1BIMMti72yE8P3ongxJzb/view?usp=sharing",
  },
  {
    id: "cert-5",
    year: "Issued Aug 2025",
    title: "Foundations of Cybersecurity",
    subtitle: "Coursera / Google",
    description: "Validated critical cybersecurity foundations, identifying network vulnerabilities, system hardening techniques, and modern cryptographic models.",
    type: "certificate",
    tags: ["Security", "Cybersecurity", "Google", "Cryptography"],
    verificationUrl: "https://drive.google.com/file/d/1dhpj12fk9Zt6WWjM3t7mP9qaCw77sMxy/view?usp=sharing",
  },
];

export default function Timeline() {
  const [filter, setFilter] = useState<"all" | "experience" | "education" | "certificate">("all");
  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const filteredItems = INITIAL_TIMELINE.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: TimelineItem["type"]) => {
    switch (type) {
      case "experience":
        return <Briefcase className="w-5 h-5 text-[#CCFF00]" />;
      case "education":
        return <GraduationCap className="w-5 h-5 text-[#CCFF00]" />;
      case "certificate":
        return <Award className="w-5 h-5 text-[#CCFF00]" />;
    }
  };

  return (
    <div className="space-y-6" id="portfolio-timeline">
      {/* Timeline Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-white/5 pb-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {(["all", "experience", "education", "certificate"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 text-xs font-mono rounded-none uppercase transition-all border ${
                filter === t
                  ? "bg-[#CCFF00] border-[#CCFF00] text-black font-semibold shadow-[0_0_15px_rgba(204,255,0,0.25)]"
                  : "bg-white/5 border-white/10 text-white hover:border-[#CCFF00]/50"
              }`}
            >
              {t === "all" ? "SHOW ALL" : t}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search timeline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-none text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#CCFF00] font-mono transition-all"
          />
        </div>
      </div>

      {/* Nodes Timeline list */}
      <div className="relative border-l border-white/10 pl-6 ml-3 space-y-8 py-2">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => {
            const isSelected = selectedNode === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedNode(isSelected ? null : item.id)}
              >
                {/* Node Pointer Bullet */}
                <div
                  className={`absolute -left-[37px] top-1.5 w-5 h-5 rounded-none flex items-center justify-center transition-all border ${
                    isSelected
                      ? "bg-[#CCFF00] border-[#CCFF00] scale-110 shadow-[0_0_12px_rgba(204,255,0,0.5)]"
                      : "bg-[#030014] border-white/20 group-hover:border-[#CCFF00]"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-none ${isSelected ? "bg-black" : "bg-white/40 group-hover:bg-[#CCFF00]"}`} />
                </div>

                {/* Card Container */}
                <div
                  className={`p-5 border transition-all duration-300 ${
                    isSelected
                      ? "bg-white/5 border-[#CCFF00] shadow-[inset_0_0_20px_rgba(204,255,0,0.03)]"
                      : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 bg-white/5 border border-white/10 rounded-none">
                        {getIcon(item.type)}
                      </div>
                      <div>
                        <h3 className="font-display uppercase text-sm md:text-base tracking-wider text-white group-hover:text-[#CCFF00] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs font-mono text-white/50">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#CCFF00] bg-[#CCFF00]/10 border border-[#CCFF00]/20 px-2.5 py-1 w-fit self-start md:self-center">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.year}
                    </div>
                  </div>

                  <p className="text-xs text-white/75 leading-relaxed font-sans mb-4">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-white/45 bg-white/5 border border-white/10 px-2 py-0.5 uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {item.verificationUrl && (
                    <div className="mt-3.5">
                      <a
                        href={item.verificationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-[#CCFF00] hover:text-black hover:bg-[#CCFF00] border border-[#CCFF00]/30 hover:border-[#CCFF00] px-2.5 py-1 transition-all uppercase font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        VERIFY CREDENTIAL ↗
                      </a>
                    </div>
                  )}

                  {item.marksheets && item.marksheets.length > 0 && (
                    <div className="mt-4 pt-3.5 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <FileText className="w-3.5 h-3.5 text-[#CCFF00]" />
                        <span className="text-[11px] font-mono font-semibold tracking-wider text-white uppercase">
                          SEMESTER MARKSHEETS & ACADEMIC TRANSCRIPTS
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {item.marksheets.map((ms) => (
                          <a
                            key={ms.term}
                            href={ms.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between gap-1.5 px-3 py-2 bg-white/5 border border-white/10 hover:border-[#CCFF00] hover:bg-[#CCFF00]/10 hover:text-[#CCFF00] text-white/80 text-xs font-mono transition-all group/ms"
                            title={`Open ${ms.term} Marksheet`}
                          >
                            <span className="font-medium">{ms.term}</span>
                            <ExternalLink className="w-3 h-3 text-white/40 group-hover/ms:text-[#CCFF00] transition-colors shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expansion indicator */}
                  <div className="mt-4 flex items-center justify-end text-[10px] font-mono text-white/30 group-hover:text-white/60 transition-colors">
                    <span>{isSelected ? "TAP TO COLLAPSE" : "TAP TO EXPLORE METRICS"}</span>
                    <ChevronRight className={`w-3 h-3 ml-1 transition-transform duration-300 ${isSelected ? "rotate-90" : ""}`} />
                  </div>

                  {/* Extra interactive detail when expanded */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3.5 bg-black/40 border border-white/5">
                            <span className="text-[10px] font-mono text-[#CCFF00] uppercase block mb-1">
                              Engineering Impact
                            </span>
                            <span className="text-xs text-white/80 font-sans">
                              {item.type === "experience"
                                ? "Implemented highly optimized, scalable algorithms and workflows that successfully boosted architectural performance by up to 45%."
                                : item.type === "education"
                                ? "Maintained a consistent rank in the top tier of students in BTech CSE, demonstrating high capability in systems courses."
                                : "Aquired valid industry certifications validating expert standard implementation strategies on secure platforms."}
                            </span>
                          </div>
                          <div className="p-3.5 bg-black/40 border border-white/5">
                            <span className="text-[10px] font-mono text-[#CCFF00] uppercase block mb-1">
                              CSE Competencies
                            </span>
                            <span className="text-xs text-white/80 font-sans">
                              Demonstrated direct capability in: {item.tags.slice(0, 3).join(", ")} and structured problem solving with production-grade outputs.
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 border border-white/5 bg-white/[0.01]">
            <p className="text-xs font-mono text-white/40">NO TIMELINE ENTRIES FOUND FOR YOUR FILTER.</p>
          </div>
        )}
      </div>
    </div>
  );
}
