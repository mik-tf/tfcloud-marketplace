import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import DocsLayout from '@components/DocsLayout';

import welcomeMd from '../../docs/welcome.md?raw';
import cloudUserMd from '../../docs/cloud-user.md?raw';
import cloudOperatorMd from '../../docs/cloud-operator.md?raw';
import cloudProviderMd from '../../docs/cloud-provider.md?raw';
import ecosystemMd from '../../docs/ecosystem.md?raw';
import theBigPictureMd from '../../docs/the-big-picture.md?raw';

// Hook to detect light/dark mode changes
function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  useEffect(() => {
    // Update state when <html> class changes
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
  const [isExpanded, setIsExpanded] = useState(false);
  const isDark = useDarkMode();
  
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      logLevel: 'fatal',
      // Moderate default settings
      htmlLabels: true,
      fontSize: 14
    });
    const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
    const code = chart.trim();
    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          
          // Find the SVG element and add width/height attributes
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            // Identify diagram type based on content
            const isSequenceDiagram = chart.includes('sequenceDiagram');
            const isTokenEconomics = chart.includes('Token Economics') ||
                                    (chart.includes('User') && chart.includes('Operator') && chart.includes('TFChain'));
            const isDeploymentFlow = chart.includes('Deployment Flow') ||
                                    (chart.includes('Select app') && chart.includes('Process payment'));
            const isNodeTypes = chart.includes('Node Types') ||
                                (chart.includes('VM Nodes') && chart.includes('Kubernetes'));
            
            // Determine complexity by counting nodes
            const nodeCount = (chart.match(/\[.*?\]/g) || []).length;
            
            // Set width to 100%
            // Center the SVG by setting margin to auto
            svgElement.style.margin = '0 auto';
            svgElement.style.display = 'block';
            svgElement.style.width = '100%';
            
            // Handle specific diagram types that need to be larger
            // Check if we're on a mobile device
            const isMobile = window.innerWidth < 768;
            
            if (isMobile) {
              // On mobile, make all diagrams fit the screen width
              svgElement.style.minWidth = 'auto';
              svgElement.style.maxWidth = '100%';
              svgElement.style.width = '100%';
              svgElement.classList.add('mobile-diagram');
            } else {
              // On desktop, use different sizes based on diagram type
              if (isSequenceDiagram || isTokenEconomics || isDeploymentFlow || isNodeTypes) {
                svgElement.style.minWidth = '550px';
                svgElement.style.maxWidth = isExpanded ? '1100px' : '800px';
                svgElement.classList.add('medium-large-diagram');
              }
              // Simple diagrams (few nodes) should be smaller
              else if (nodeCount <= 5) {
                svgElement.style.minWidth = '300px';
                svgElement.style.maxWidth = isExpanded ? '600px' : '400px';
                svgElement.classList.add('simple-diagram');
              }
              // Complex diagrams should be larger
              else if (nodeCount >= 10) {
                svgElement.style.minWidth = '600px';
                svgElement.style.maxWidth = isExpanded ? '1200px' : '900px';
                svgElement.classList.add('complex-diagram');
              }
              // Medium complexity diagrams
              else {
                svgElement.style.minWidth = '500px';
                svgElement.style.maxWidth = isExpanded ? '1000px' : '750px';
                svgElement.classList.add('medium-diagram');
              }
            }
            
            svgElement.style.height = 'auto';
            svgElement.style.cursor = 'pointer';
            svgElement.addEventListener('click', () => setIsExpanded(!isExpanded));
          }
        }
      })
      .catch(() => {
        // swallow parse errors silently
      });
  }, [chart, isDark, isExpanded]);
  
  // Center diagram within styled container with more width
  return (
    <div className="my-6 bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
      <div
        ref={containerRef}
        className="w-full mx-auto overflow-hidden md:overflow-auto"
        title={isExpanded ? "Click to reduce size" : "Click to expand"}
      />
    </div>
  );
};

const contentMap: Record<string, string> = {
  'welcome': welcomeMd,
  'the-big-picture': theBigPictureMd,
  'ecosystem': ecosystemMd,
  'cloud-user': cloudUserMd,
  'cloud-operator': cloudOperatorMd,
  'cloud-provider': cloudProviderMd,
  // Keep old paths for backward compatibility
  'dashboard-user': cloudUserMd,
  'dashboard-operator': cloudOperatorMd,
  'node-operator': cloudProviderMd,
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
      <div className="md:grid md:grid-cols-5 gap-8">
        <article className="col-span-4 prose dark:prose-invert max-w-none prose-img:my-8 prose-img:w-full overflow-hidden">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }: any) {
                const match = /language-mermaid/.exec(className || '');
                if (!inline && match) {
                  const chart = Array.isArray(children)
                    ? children.map(c => String(c)).join('\n')
                    : String(children);
                  return <MermaidChart chart={chart.trim()} />;
                }
                return <code className={className} {...props}>{children}</code>;
              },
              h2({ node, children, ...props }: any) {
                const text = Array.isArray(children) ? children.join('') : String(children);
                const id = text.toLowerCase().replace(/[^\w]+/g, '-');
                return <h2 id={id} {...props}>{children}</h2>;
              },
              h3({ node, children, ...props }: any) {
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
