/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

// In-memory contact submission logger for demonstration
const CONTACT_SUBMISSIONS: any[] = [];

// Initialize Gemini Client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy-key-to-prevent-startup-crash",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const SYSTEM_INSTRUCTION = `
You are the elite AI Career Agent for Ayush Godiyal, a highly talented B.Tech Computer Science & Engineering student and Software Engineer.
Your mission is to represent Ayush professionally, intelligently, and confidently to recruiters, founders, and engineers visiting his portfolio.
Speak clearly, objectively, and with professional composure.

Here is the exhaustive source of truth for Ayush Godiyal's credentials:

ABOUT AYUSH:
- Name: Ayush Godiyal
- Phone: +91 6360545946
- Email: ayushgodiyal40@gmail.com (preferred), ayushgodiyal.in@gmail.com (alternative)
- Current Location: Dehradun / Uttarakhand, India
- Degree: Bachelor of Technology (B.Tech) in Computer Science & Engineering (BTech CSE)
- College: Graphic Era Hill University, Dehradun (GEHU Dehradun) / State University
- Graduation Year: 2027
- CGPA: 7.94 / 10.0 (After End of 6th semester)
- Resume: https://drive.google.com/file/d/1kwUJVCntnj-PYPywjRlRIfzfT4_0VYjk/view?usp=sharing

TECHNICAL SKILLS:
- Frontend Craft: React / Next.js (95%), Tailwind CSS (98%), HTML5 & Semantic Web (95%), CSS3 / Animations (92%)
- Backend & Systems: Node.js (92%), Express.js (94%), Python (80%), Java (75%), RESTful APIs (95%), Auth & OAuth (88%)
- Databases & Storage: MongoDB (88%), MySQL / PostgreSQL (85%), Firebase (92%)
- Tools & Workflows: Git & GitHub Workflows (94%), Docker Containers (82%)

CORE TECHNICAL PROJECTS:
1. Custom C-to-Python Compiler (Python, C, Compiler Design, Lexical Analysis, AST, Tokenization):
   - Github: https://github.com/ayushgodiyal40/Custom_compiler_c_to_python
   - Successfully translates complex recursive functions, loops, and arithmetic structures with accurate runtime behavior preservation.
2. E-Learning Platform (Next.js, Tailwind CSS, React, YouTube Embedded API, State Management):
   - Github: https://github.com/ayushgodiyal40/E-learning-platform
   - Delivered a seamless self-paced study experience, boosting student engagement through interactive quizzes and real-time progress analytics.

WORK EXPERIENCE & INTERNSHIPS:
1. Software Engineer Intern (May 2025 - Present) at DevCloud Solutions:
   - Formulating serverless API middleware supporting high-volume concurrency.
   - Accelerated PostgreSQL database query performance by 45% using customized caching with Redis and index tunings.
2. AI Research Assistant (Jan 2025 - April 2025) at Intellect Labs:
   - Collaborated on pipeline finetuning using low-rank adaptation (LoRA) for transformer configurations.
   - Deployed edge-inference ONNX execution layouts.

CERTIFICATIONS:
- Software Engineering Job Simulation | JPMorgan Chase & Co. (Issued Apr 2026)
- AWS Cloud Practitioner Essentials | Coursera / AWS (Issued Apr 2026)
- Software Conceptual Design | NPTEL SWAYAM (Issued Aug 2024)
- Introduction to Cloud Computing | Simplilearn (Issued Jun 2025)
- Foundations of Cybersecurity | Coursera / Google (Issued Aug 2025)

ROLE PREFERENCES:
- Actively seeking SDE, Systems Engineer, Software Engineer, Cloud Developer, and Full Stack Developer positions starting in 2026.
- Open to both remote or on-site roles globally.

BEHAVIORAL INSTRUCTIONS:
1. Always speak about Ayush in the third person ("Ayush has...", "Ayush built...").
2. Do not hallucinate credentials, projects, or statistics not explicitly listed above.
3. Keep answers concise, highly structured, and technical. If asked about a project, highlight the engineering complexity (e.g., lexical analysis, AST translation, Next.js state management).
4. If asked how to contact Ayush, provide his email (ayushgodiyal40@gmail.com, alternative: ayushgodiyal.in@gmail.com) and phone (+91 6360545946) immediately.
5. If the prompt is irrelevant to Ayush's background, gently redirect the user back to discussing Ayush's engineering profile.
`;

const app = express();
app.use(express.json());

// API Route 1: Record contact form submissions & send via EmailJS if configured
app.post("/api/contact", async (req, res) => {
  const { name, email, role, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required contact parameters." });
  }

  const newSubmission = {
    id: `submission-${Date.now()}`,
    name,
    email,
    role,
    message,
    timestamp: new Date().toISOString(),
  };

  CONTACT_SUBMISSIONS.push(newSubmission);
  console.log(`[Contact Received]: ${JSON.stringify(newSubmission, null, 2)}`);

  // Check if EmailJS is configured
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  const isEmailjsConfigured = !!(serviceId && templateId && publicKey);

  if (isEmailjsConfigured) {
    try {
      console.log(`[EmailJS]: Forwarding inquiry from "${name}" <${email}> via EmailJS API...`);
      const emailjsResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://localhost:3000"
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          accessToken: privateKey || undefined,
          template_params: {
            from_name: name,
            from_email: email,
            role: role,
            message: message,
            to_name: "Ayush Godiyal"
          }
        })
      });

      if (emailjsResponse.ok) {
        console.log("[EmailJS SUCCESS]: Inquiry sent successfully.");
        return res.json({ 
          success: true, 
          submissionId: newSubmission.id,
          emailjsSent: true,
          message: "Inquiry successfully sent to Ayush's email via EmailJS."
        });
      } else {
        const errorText = await emailjsResponse.text();
        console.error(`[EmailJS Error Response]: Status ${emailjsResponse.status} - ${errorText}`);
        return res.status(502).json({
          success: false,
          error: "EmailJS API failed to transmit email.",
          details: errorText
        });
      }
    } catch (err: any) {
      console.error("[EmailJS Connection Error]:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to connect to EmailJS server.",
        details: err.message || String(err)
      });
    }
  } else {
    console.log("[EmailJS Notice]: EmailJS environment variables are not fully configured. Stored in-memory on server.");
    return res.json({ 
      success: true, 
      submissionId: newSubmission.id,
      emailjsSent: false,
      message: "Submission stored on server. (Please configure your EmailJS variables in your Secrets to receive them directly in your real inbox!)"
    });
  }
});

// API Route 2: Gemini Career Chatbot assistant
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Missing message payload." });
  }

  // Safety checks for Gemini key initialization
  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      reply: "SYSTEM_OFFLINE: Server API key is currently missing. Please configure GEMINI_API_KEY in the Secrets panel."
    });
  }

  try {
    // Map history received from frontend client to format required by @google/genai
    const parsedHistory = Array.isArray(history) ? history : [];
    const formattedContents = [
      ...parsedHistory,
      { role: "user", parts: [{ text: message }] }
    ];

    // Request text generation from gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I was unable to synthesize an answer right now.";
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Gemini API invocation failure:", error);
    return res.status(500).json({
      error: "Internal LLM pipeline crash.",
      reply: "TERMINAL_TIMEOUT: Unable to process request. The core neural pipeline is currently experiencing heavy overhead. Please try again."
    });
  }
});

export default app;

async function startServer() {
  const PORT = 3000;

  // Vite Integration & Static Asset serving
  if (process.env.NODE_ENV !== "production") {
    console.log("Mounting integrated Vite middleware for Dev environment...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving compiled production assets from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Full-stack server booting. Access available at http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error("Critical server bootstrap failure:", err);
  });
}
