import React, { memo } from "react";
import { cn } from "@/lib/utils";

/**
 * Component to safely render HTML content
 * @param {string} content - HTML string to render
 * @param {string} className - Additional CSS classes
 */
const HtmlContent = memo(({ content, className, ...props }) => {
  if (!content) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)} {...props}>
        No description available
      </p>
    );
  }

  // Strip HTML tags for preview if needed, or render as HTML
  const isHtml = /<[^>]+>/.test(content);

  if (isHtml) {
    return (
      <div
        className={cn(
          "html-content prose prose-sm max-w-none dark:prose-invert break-words",
          "prose-headings:font-semibold prose-a:text-blue-600 prose-a:underline",
          "prose-strong:font-bold prose-img:rounded-lg prose-img:max-w-full",
          className
        )}
        dangerouslySetInnerHTML={{ __html: content }}
        {...props}
      />
    );
  }

  // Fallback to plain text if not HTML
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {content}
    </p>
  );
});

HtmlContent.displayName = "HtmlContent";

export default HtmlContent;
