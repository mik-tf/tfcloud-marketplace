import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import DocsLayout from '@components/DocsLayout';

import welcomeMd from '../../docs/welcome.md?raw';
import dashboardUserMd from '../../docs/dashboard-user.md?raw';
import dashboardOperatorMd from '../../docs/dashboard-operator.md?raw';
import nodeOperatorMd from '../../docs/node-operator.md?raw';
import ecosystemMd from '../../docs/ecosystem.md?raw';

// Hook to detect light/dark mode changes
function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

// Component to render mermaid diagrams
const MermaidChart: React.FC<{ chart: string }> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = useDarkMode();
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'default', logLevel: 'fatal' });
    const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
    const code = chart.trim();
    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (containerRef.current) containerRef.current.innerHTML = svg;
      })
      .catch(() => {
        // swallow parse errors silently
      });
  }, [chart, isDark]);
  return <div ref={containerRef} className="my-4 bg-white dark:bg-gray-800 p-4 rounded-lg" />;
};

const contentMap: Record<string, string> = {
  'welcome': welcomeMd,
  'ecosystem': ecosystemMd,
  'dashboard-user': dashboardUserMd,
  'dashboard-operator': dashboardOperatorMd,
  'node-operator': nodeOperatorMd,
};

const DocPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const key = slug || 'welcome';
  const content = contentMap[key] || '# Not Found\n\nContent not found.';
  const toc = useMemo(() => {
    const lines = content.split('\n').filter(line => /^(#{2,3})\s+/.test(line));
    return lines.map(line => {
      const match = line.match(/^(#{2,3})\s+(.*)/);
      const level = match ? match[1].length : 2;
      const text = match ? match[2] : '';
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      return { level, text, id };
    });
  }, [content]);

  return (
    <DocsLayout>
      <div className="md:grid md:grid-cols-4 gap-8">
        <article className="col-span-3 prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-mermaid/.exec(className || '');
                if (!inline && match) {
                  const chart = Array.isArray(children)
                    ? children.map(c => String(c)).join('\n')
                    : String(children);
                  return <MermaidChart chart={chart.trim()} />;
                }
                return <code className={className} {...props}>{children}</code>;
              },
              h2({ node, children, ...props }) {
                const text = Array.isArray(children) ? children.join('') : String(children);
                const id = text.toLowerCase().replace(/[^\w]+/g, '-');
                return <h2 id={id} {...props}>{children}</h2>;
              },
              h3({ node, children, ...props }) {
                const text = Array.isArray(children) ? children.join('') : String(children);
                const id = text.toLowerCase().replace(/[^\w]+/g, '-');
                return <h3 id={id} {...props}>{children}</h3>;
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
        <aside className="hidden lg:block col-span-1 sticky top-24 max-h-screen overflow-auto">
          <p className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Contents</p>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {toc.map(item => (
              <li key={item.id} className={`pl-${(item.level - 2) * 4}`}>
                <a href={`#${item.id}`} className="hover:underline">{item.text}</a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </DocsLayout>
  );
};

export default DocPage;
