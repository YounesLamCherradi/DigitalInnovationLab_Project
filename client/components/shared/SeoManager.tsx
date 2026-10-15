import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pages: Record<string, { title: string; description: string }> = {
  '/': { title: 'Digital Innovation Lab | Al Akhawayn University', description: 'Discover digital innovation research, projects, partnerships, and opportunities at Al Akhawayn University in Ifrane, Morocco.' },
  '/projects': { title: 'Innovation Projects | Digital Innovation Lab', description: 'Explore digital transformation, AI, identity, and technology projects created by the Digital Innovation Lab.' },
  '/apply': { title: 'Opportunities and Applications | Digital Innovation Lab', description: 'Find open opportunities and apply to join research and innovation initiatives at the Digital Innovation Lab.' },
  '/team': { title: 'Our Team | Digital Innovation Lab', description: 'Meet the researchers, board members, and staff behind the Digital Innovation Lab at Al Akhawayn University.' },
  '/partners': { title: 'Partners | Digital Innovation Lab', description: 'Meet the academic, technology, and innovation partners collaborating with the Digital Innovation Lab across Africa.' },
  '/news': { title: 'News and Insights | Digital Innovation Lab', description: 'Read the latest news, research updates, events, and achievements from the Digital Innovation Lab.' },
  '/contact': { title: 'Contact Us | Digital Innovation Lab', description: 'Contact the Digital Innovation Lab at Al Akhawayn University in Ifrane, Morocco.' },
};

function setMeta(selector: string, key: 'name' | 'property', name: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) { element = document.createElement('meta'); element.setAttribute(key, name); document.head.appendChild(element); }
  element.content = value;
}

export const SeoManager = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = pages[pathname] || { title: 'Page Not Found | Digital Innovation Lab', description: 'Digital Innovation Lab at Al Akhawayn University.' };
    const canonicalUrl = new URL(pathname, import.meta.env.VITE_SITE_URL || window.location.origin).toString();
    document.title = page.title;
    setMeta('meta[name="description"]', 'name', 'description', page.description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', page.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', page.description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;
  }, [pathname]);
  return null;
};

