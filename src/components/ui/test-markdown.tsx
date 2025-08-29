import { MarkdownRenderer } from './markdown-renderer';

// Test component to verify markdown rendering
export function TestMarkdownRenderer() {
  const testContent = `**🔗 Contextual Study Suggestion:**

Based on your discussion about Python and web development, here are some resources to help you get started:

**External Resources:**
• Python: Codecademy's Python course (free): https://www.codecademy.com/learn/learn-python-3 offers a structured introduction to Python.
• Web Development: freeCodeCamp's Responsive Web Design Certification (free): https://www.freecodecamp.org/learn/responsive-web-design/ Provides hands-on practice building web pages and applications.

*Based on your recent discussion*`;

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Test Markdown Renderer:</h3>
      <MarkdownRenderer content={testContent} />
    </div>
  );
}
