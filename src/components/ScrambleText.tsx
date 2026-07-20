/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from "react";

interface ScrambleTextProps {
  text: string;
  duration?: number; // Total duration of animation in ms
  scrambleChars?: string;
  className?: string;
  key?: any;
}

export default function ScrambleText({
  text,
  duration = 1200,
  scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789✦★▲▼●■◆⚡⚛🧬💻💾🌐🚀",
  className = "",
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let startTime = Date.now();
    const length = text.length;

    const tick = () => {
      const timeElapsed = Date.now() - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Number of characters already fully solved
      const solvedCount = Math.floor(progress * length);

      let currentScrambled = "";
      for (let i = 0; i < length; i++) {
        if (i < solvedCount) {
          // Solved character
          currentScrambled += text[i];
        } else if (text[i] === " ") {
          currentScrambled += " ";
        } else {
          // Random character from scramble pool
          const randIdx = Math.floor(Math.random() * scrambleChars.length);
          currentScrambled += scrambleChars[randIdx];
        }
      }

      setDisplayText(currentScrambled);

      if (progress < 1) {
        timerRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayText(text);
      }
    };

    timerRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [text, duration, scrambleChars]);

  return <span className={className}>{displayText}</span>;
}
