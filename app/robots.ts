import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// Search engines and AI assistants may read the site so they can find and describe the works.
// (Training on the images is refused in the copyright terms; robots.txt cannot enforce that.)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
