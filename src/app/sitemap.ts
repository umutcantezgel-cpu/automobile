import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codayweb.de'; // Replace with actual production URL if different

  // Statische Routen der App
  const routes = [
    '',
    '/angebote',
    '/calculator',
    '/fahrzeuge',
    '/finanzierung',
    '/inzahlungnahme',
    '/karriere',
    '/kontakt',
    '/magazin',
    '/preise',
    '/probefahrt',
    '/service',
    '/ueber-uns',
    '/vergleich',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Hier könnte man theoretisch dynamische Routen (Fahrzeuge) ergänzen, 
  // sobald diese als eigenständige URLs (z.B. /fahrzeuge/[id]) implementiert sind.
  
  return [...routes];
}
