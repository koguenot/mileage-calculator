"use client";

import { useEffect } from "react";

const MESSAGE = "Handchosen의 소중한 자산입니다.";

export default function RightClickGuard() {
  useEffect(() => {
    function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
      alert(MESSAGE);
    }
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-[1]"
      aria-hidden
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="handchosen-watermark"
            width="200"
            height="72"
            patternUnits="userSpaceOnUse"
          >
            <text
              x="0"
              y="44"
              fill="rgba(120,113,108,0.08)"
              fontSize="28"
              fontFamily="system-ui, sans-serif"
              fontWeight="500"
            >
              Handchosen
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#handchosen-watermark)" />
      </svg>
    </div>
  );
}
