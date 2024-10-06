"use client";

import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

interface PlainTextRendererProps {
  content: string;
}

export default function PlainTextRenderer({ content }: PlainTextRendererProps) {
  const [plainText, setPlainText] = useState("");

  useEffect(() => {
    // Sanitize the content and convert to plain text
    const sanitizedHtml = DOMPurify.sanitize(content);
    const tempElement = document.createElement("div");
    tempElement.innerHTML = sanitizedHtml;
    const extractedText =
      tempElement.textContent || tempElement.innerText || "";
    setPlainText(extractedText);
  }, [content]);

  return (
    <div className="plain-text-content">
      <p
        className="mt-0 overflow-hidden text-ellipsis whitespace-pre-wrap text-sm text-gray-500"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical"
        }}
      >
        {plainText}
      </p>
    </div>
  );
}
