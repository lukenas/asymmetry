"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";

interface BeehiivPost {
  id: string;
  title: string;
  subtitle?: string;
  publish_date: number;
  web_url: string;
  word_count?: number;
  content?: {
    free?: {
      web?: string;
      email?: string;
      rss?: string;
    };
    premium?: {
      web?: string;
      email?: string;
    };
  };
  html_content?: string;
  preview_text?: string;
  thumbnail_url?: string;
}

interface ContentNode {
  type: string;
  text?: string;
  children?: ContentNode[];
  href?: string;
  src?: string;
  alt?: string;
}

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<BeehiivPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentNodes, setContentNodes] = useState<ContentNode[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/beehiiv/posts/${postId}`);
        if (response.ok) {
          const data = await response.json();
          const postData = data.data || data;
          setPost(postData);
          
          // Extract content from HTML and convert to structured format
          if (postData.content?.free?.web) {
            const nodes = extractContent(postData.content.free.web);
            setContentNodes(nodes);
          } else if (postData.content?.free?.rss) {
            const nodes = extractContent(postData.content.free.rss);
            setContentNodes(nodes);
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to load post");
        }
      } catch (err) {
        setError("Failed to load post");
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getReadTime = (wordCount?: number) => {
    if (!wordCount) return "5 min read";
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  const extractContent = (html: string): ContentNode[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Remove unwanted elements
      const unwantedSelectors = [
        'header', 'nav', 'footer', '.header', '.nav', '.navigation', '.footer', '.sidebar',
        'aside', '.subscribe', '.newsletter', '.social-share', '.author-bio', '.related-posts',
        '.comments', 'script', 'style', 'noscript',
        '[class*="header"]', '[class*="nav"]', '[class*="footer"]', '[class*="sidebar"]',
        '[id*="header"]', '[id*="nav"]', '[id*="footer"]', '[id*="sidebar"]',
      ];
      
      unwantedSelectors.forEach(selector => {
        try {
          doc.querySelectorAll(selector).forEach(el => el.remove());
        } catch (e) {}
      });
      
      // Find main content
      const article = doc.querySelector('article') || 
                     doc.querySelector('[role="article"]') ||
                     doc.querySelector('.post-content') ||
                     doc.querySelector('.content') ||
                     doc.querySelector('main') ||
                     doc.body;
      
      // Remove Beehiiv wrappers
      article.querySelectorAll('[class*="beehiiv"], [id*="beehiiv"]').forEach(el => {
        while (el.firstChild) {
          el.parentNode?.insertBefore(el.firstChild, el);
        }
        el.remove();
      });
      
      // Remove duplicate titles
      article.querySelectorAll('h1, .title, [class*="title"]').forEach(el => {
        const text = el.textContent?.toLowerCase().trim();
        if (text && text.length < 100) {
          el.remove();
        }
      });
      
      // Extract content recursively
      const extractNode = (node: Node): ContentNode | null => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          return text ? { type: 'text', text } : null;
        }
        
        if (node.nodeType !== Node.ELEMENT_NODE) return null;
        
        const el = node as Element;
        const tagName = el.tagName.toLowerCase();
        
        // Skip unwanted tags
        if (['script', 'style', 'noscript', 'meta', 'link'].includes(tagName)) {
          return null;
        }
        
        // Extract children
        const children: ContentNode[] = [];
        Array.from(el.childNodes).forEach(child => {
          const childNode = extractNode(child);
          if (childNode) {
            if (childNode.type === 'text' && children.length > 0 && children[children.length - 1]?.type === 'text') {
              // Merge consecutive text nodes
              children[children.length - 1].text += ' ' + childNode.text;
            } else {
              children.push(childNode);
            }
          }
        });
        
        // Handle different element types
        switch (tagName) {
          case 'p':
            if (children.length === 0) return null;
            return { type: 'p', children };
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            if (children.length === 0) return null;
            return { type: tagName, children };
          case 'ul':
          case 'ol':
            if (children.length === 0) return null;
            return { type: tagName, children };
          case 'li':
            if (children.length === 0) return null;
            return { type: 'li', children };
          case 'a':
            const href = el.getAttribute('href');
            if (children.length === 0) return null;
            return { type: 'a', href: href || undefined, children };
          case 'strong':
          case 'b':
            if (children.length === 0) return null;
            return { type: 'strong', children };
          case 'em':
          case 'i':
            if (children.length === 0) return null;
            return { type: 'em', children };
          case 'blockquote':
            if (children.length === 0) return null;
            return { type: 'blockquote', children };
          case 'code':
            return { type: 'code', text: el.textContent || '' };
          case 'pre':
            if (children.length === 0) return null;
            return { type: 'pre', children };
          case 'img':
            return {
              type: 'img',
              src: el.getAttribute('src') || undefined,
              alt: el.getAttribute('alt') || undefined,
            };
          case 'br':
            return { type: 'br' };
          default:
            // For div, span, etc., just return children
            return children.length > 0 ? { type: 'div', children } : null;
        }
      };
      
      const result: ContentNode[] = [];
      Array.from(article.childNodes).forEach(node => {
        const extracted = extractNode(node);
        if (extracted) {
          result.push(extracted);
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error extracting content:', error);
      return [];
    }
  };

  const renderContentNode = (node: ContentNode, key: number): React.ReactNode => {
    switch (node.type) {
      case 'text':
        return node.text;
      case 'p':
        return (
          <p key={key} className="mb-6 text-base leading-relaxed text-asym-dark dark:text-asym-light">
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </p>
        );
      case 'h1':
        return (
          <h1 key={key} className="font-display text-4xl mt-16 mb-8 tracking-wide font-bold text-asym-dark dark:text-asym-light">
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </h1>
        );
      case 'h2':
        return (
          <h2 key={key} className="font-display text-3xl mt-14 mb-6 tracking-wide font-semibold text-asym-dark dark:text-asym-light">
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={key} className="font-display text-2xl mt-12 mb-5 tracking-wide font-semibold text-asym-dark dark:text-asym-light">
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </h3>
        );
      case 'h4':
        return (
          <h4 key={key} className="font-display text-xl mt-10 mb-4 tracking-wide font-semibold text-asym-dark dark:text-asym-light">
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </h4>
        );
      case 'ul':
        return (
          <ul key={key} className="list-disc ml-8 mb-6 space-y-2 text-base leading-relaxed text-asym-dark dark:text-asym-light">
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </ul>
        );
      case 'ol':
        return (
          <ol key={key} className="list-decimal ml-8 mb-6 space-y-2 text-base leading-relaxed text-asym-dark dark:text-asym-light">
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </ol>
        );
      case 'li':
        return (
          <li key={key} className="mb-2">
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </li>
        );
      case 'a':
        return (
          <a
            key={key}
            href={node.href}
            target={node.href?.startsWith('http') ? '_blank' : undefined}
            rel={node.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-asym-orange hover:underline font-medium"
          >
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </a>
        );
      case 'strong':
        return (
          <strong key={key} className="font-semibold">
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </strong>
        );
      case 'em':
        return (
          <em key={key} className="italic">
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </em>
        );
      case 'blockquote':
        return (
          <blockquote key={key} className="border-l-4 border-asym-dark/20 dark:border-asym-light/20 pl-6 italic my-6 text-base leading-relaxed text-asym-dark/80 dark:text-asym-light/80">
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </blockquote>
        );
      case 'code':
        return (
          <code key={key} className="font-mono text-sm bg-asym-dark/5 dark:bg-asym-light/5 px-2 py-1 rounded">
            {node.text}
          </code>
        );
      case 'pre':
        return (
          <pre key={key} className="bg-asym-dark/5 dark:bg-asym-light/5 p-6 rounded-lg overflow-x-auto my-8 font-mono text-sm">
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </pre>
        );
      case 'img':
        return (
          <img
            key={key}
            src={node.src}
            alt={node.alt}
            className="my-8 rounded-lg max-w-full"
          />
        );
      case 'br':
        return <br key={key} />;
      case 'div':
        return (
          <div key={key}>
            {node.children?.map((child, i) => renderContentNode(child, i))}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 max-w-4xl mx-auto px-8 pt-32 pb-24 w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-asym-dark/10 dark:bg-asym-light/10 rounded w-32 mb-4" />
            <div className="h-12 bg-asym-dark/10 dark:bg-asym-light/10 rounded w-3/4 mb-6" />
            <div className="h-4 bg-asym-dark/10 dark:bg-asym-light/10 rounded w-24 mb-12" />
            <div className="space-y-4">
              <div className="h-4 bg-asym-dark/10 dark:bg-asym-light/10 rounded w-full" />
              <div className="h-4 bg-asym-dark/10 dark:bg-asym-light/10 rounded w-5/6" />
              <div className="h-4 bg-asym-dark/10 dark:bg-asym-light/10 rounded w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 max-w-4xl mx-auto px-8 pt-32 pb-24 w-full">
          <div className="text-center py-12">
            <p className="font-sans text-asym-dark/60 dark:text-asym-light/60 mb-6">
              {error || "Post not found"}
            </p>
            <Link
              href="/field-notes"
              className="font-mono text-xs text-asym-orange tracking-wide hover:underline"
            >
              ← BACK TO FIELD NOTES
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 pt-32 pb-24 w-full">
        {/* Back Link */}
        <Link
          href="/field-notes"
          className="inline-block mb-8 font-mono text-xs text-asym-dark/50 dark:text-asym-light/50 hover:text-asym-orange transition-colors tracking-wide"
        >
          ← BACK TO FIELD NOTES
        </Link>

        {/* Post Header */}
        <article>
          <div className="mb-8">
            <span className="font-mono text-xs text-asym-orange tracking-widest uppercase">
              FIELD NOTES
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide mt-4 mb-6">
              {post.title}
            </h1>
            
            {post.subtitle && (
              <p className="font-display text-xl sm:text-2xl tracking-wide text-asym-dark/70 dark:text-asym-light/70 mb-8 leading-relaxed">
                {post.subtitle}
              </p>
            )}

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-asym-dark/10 dark:border-asym-light/10">
              <span className="font-mono text-xs text-asym-dark/50 dark:text-asym-light/50 tracking-wide">
                {formatDate(post.publish_date)}
              </span>
              <span className="w-1 h-1 rounded-full bg-asym-dark/20 dark:bg-asym-light/20" />
              <span className="font-mono text-xs text-asym-dark/50 dark:text-asym-light/50 tracking-wide">
                {getReadTime(post.word_count)}
              </span>
            </div>
          </div>

          {/* Post Content */}
          <div className="max-w-none font-sans">
            {contentNodes.length > 0 ? (
              <div className="text-base leading-relaxed text-asym-dark dark:text-asym-light">
                {contentNodes.map((node, i) => renderContentNode(node, i))}
              </div>
            ) : (
              <div className="space-y-8">
                {post.preview_text && (
                  <div className="font-sans text-base text-asym-dark dark:text-asym-light leading-relaxed">
                    <p className="text-lg mb-4">{post.preview_text}</p>
                  </div>
                )}
                <div className="border-t border-asym-dark/10 dark:border-asym-light/10 pt-8">
                  <p className="font-sans text-sm text-asym-dark/60 dark:text-asym-light/60 mb-6">
                    Full content is available on Beehiiv.
                  </p>
                  <a
                    href={post.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-xs text-asym-orange tracking-wide hover:underline"
                  >
                    READ FULL POST ON BEEHIIV →
                  </a>
                </div>
              </div>
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

