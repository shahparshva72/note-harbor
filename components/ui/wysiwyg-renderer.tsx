"use client";

import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

interface WysiwygRendererProps {
  content: string;
}

export default function WysiwygRenderer({ content }: WysiwygRendererProps) {
  const [sanitizedContent, setSanitizedContent] = useState("");

  useEffect(() => {
    // Sanitize the content on the client-side
    const clean = DOMPurify.sanitize(content);
    setSanitizedContent(clean);
  }, [content]);

  return (
    <div className="wysiwyg-content">
      <div
        className="mt-0 overflow-hidden text-ellipsis text-sm "
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical"
        }}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  );
}
