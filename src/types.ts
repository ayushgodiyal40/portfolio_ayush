/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  category: "Systems" | "AI/ML" | "FullStack" | "Cloud";
  githubUrl: string;
  liveUrl?: string;
  stars?: number;
  forks?: number;
}

export interface SkillCategory {
  title: string;
  skills: { name: string; level: number; icon: string }[];
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  type: "experience" | "education" | "certificate";
  tags: string[];
  verificationUrl?: string;
}

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
