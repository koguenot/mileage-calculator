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

  return null;
}
