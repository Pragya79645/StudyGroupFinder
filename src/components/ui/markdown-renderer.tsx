import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const renderContent = (text: string) => {
    const elements: React.ReactNode[] = [];
    let currentIndex = 0;
    
    // Combined regex to match both markdown links and plain URLs
    const combinedRegex = /(\[([^\]]+)\]\(([^)]+)\))|(https?:\/\/[^\s)]+)/g;
    let match;
    
    while ((match = combinedRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        const beforeText = text.substring(currentIndex, match.index);
        elements.push(renderTextWithFormatting(beforeText, elements.length));
      }
      
      if (match[1]) {
        // This is a markdown link [text](url)
        const linkText = match[2];
        const linkUrl = match[3];
        elements.push(
          <a
            key={elements.length}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline break-all"
          >
            {linkText}
          </a>
        );
      } else if (match[4]) {
        // This is a plain URL
        const url = match[4];
        elements.push(
          <a
            key={elements.length}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline break-all"
          >
            {url}
          </a>
        );
      }
      
      currentIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.substring(currentIndex);
      elements.push(renderTextWithFormatting(remainingText, elements.length));
    }
    
    return elements;
  };

  const renderTextWithFormatting = (text: string, keyPrefix: number) => {
    // Handle line breaks and bold text
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => (
      <React.Fragment key={`${keyPrefix}-${lineIndex}`}>
        {renderTextWithBold(line)}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const renderTextWithBold = (text: string) => {
    if (!text) return text;
    
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {renderContent(content)}
    </div>
  );
}
