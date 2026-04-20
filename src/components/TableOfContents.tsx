import { useState, useEffect } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const elements = doc.querySelectorAll("h1, h2, h3");

    const items: TocItem[] = [];
    elements.forEach((el, index) => {
      const id = `heading-${index}`;
      el.id = id;
      items.push({
        id,
        text: el.textContent || "",
        level: parseInt(el.tagName[1]),
      });
    });

    setHeadings(items);
  }, [content]);

  if (headings.length < 2) return null;

  return (
    <nav className="mb-8">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Table of Contents
        </span>
        <svg
          className={`w-5 h-5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <ul className="mt-2 space-y-1 text-sm border border-t-0 border-border rounded-b-lg p-4 bg-muted/20">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
            >
              <button
                type="button"
                className="block w-full text-left py-1 text-muted-foreground hover:text-foreground transition-colors text-start"
                onClick={() => {
                  const element = document.getElementById(heading.id);
                  if (element) {
                    const rect = element.getBoundingClientRect();
                    const offset = 100;
                    window.scrollTo({
                      top: window.scrollY + rect.top - offset,
                      behavior: "smooth"
                    });
                  }
                }}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}