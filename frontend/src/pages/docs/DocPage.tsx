import React, { useEffect, useRef, useState } from 'react';
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

  return (
    <DocsLayout>
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children: React.ReactNode; [key: string]: any }) {
              const match = /language-mermaid/.exec(className || '');
              if (!inline && match) {
                const chart = Array.isArray(children)
                  ? children.map(c => String(c)).join('\n')
                  : String(children);
                return <MermaidChart chart={chart.trim()} />;
              }
              return <code className={className} {...props}>{children}</code>;
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </DocsLayout>
  );
};

export default DocPage;
