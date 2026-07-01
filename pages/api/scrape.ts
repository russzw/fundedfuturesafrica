import type { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';

type ScrapedItem = {
  title: string;
  provider: string;
  degree: string[];
  fundingAmount: string;
  deadline: string;
  location: string;
  externalLink: string;
  imageUrl: string;
  description: string;
};

const DEGREE_KEYWORDS: Record<string, string[]> = {
  'Masters': ['master', 'msc', 'ma ', 'mba', 'meng', 'mphil'],
  'PhD': ['phd', 'doctoral', 'doctorate', 'dphil'],
  'Bachelors': ['bachelor', 'bsc', 'ba ', 'beng', 'undergraduate'],
  'Diploma': ['diploma', 'certificate'],
  'Fellowship': ['fellowship', 'fellow'],
  'Post-Doc': ['postdoc', 'post-doc', 'postdoctoral'],
  'Research': ['research'],
  'Internship': ['internship', 'intern'],
  'High School': ['high school', 'secondary'],
  'Vocational': ['vocational', 'trade'],
  'Bootcamp': ['bootcamp', 'boot camp'],
};

const FUNDING_KEYWORDS = [
  'fully funded', 'full tuition', 'full scholarship', 'fully-funded',
  'tuition fees', 'stipend', 'living allowance', 'maintenance grant',
  'partial funding', 'partial scholarship',
];

function inferDegrees(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const [degree, keywords] of Object.entries(DEGREE_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) found.push(degree);
  }
  return found.length > 0 ? found : ['Other'];
}

function inferFunding(text: string): string {
  const lower = text.toLowerCase();
  for (const kw of FUNDING_KEYWORDS) {
    if (lower.includes(kw)) {
      return kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }
  const amountMatch = text.match(/\$[\d,]+(?:\s*[-–]\s*\$[\d,]+)?/);
  if (amountMatch) return amountMatch[0];
  return 'Various';
}

function extractDeadline(text: string): string {
  const lower = text.toLowerCase();

  // Check for "rolling" or "open until filled"
  if (lower.includes('rolling') || lower.includes('open until filled') || lower.includes('open until')) {
    return 'Rolling';
  }

  const patterns = [
    /(?:deadline|due date|closing date|last date|apply by|applications? (?:close|due|end)|submission deadline)[:\s]*([A-Za-z]+\s+\d{1,2},?\s*\d{4})/i,
    /(?:deadline|due date|closing date|last date|apply by|applications? (?:close|due|end)|submission deadline)[:\s]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
    /(?:deadline|due date|closing date|last date|apply by|applications? (?:close|due|end)|submission deadline)[:\s]*(\d{4}-\d{2}-\d{2})/i,
    /closes?[:\s]*([A-Za-z]+\s+\d{1,2},?\s*\d{4})/i,
    /closes?[:\s]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
    /closes?[:\s]*(\d{4}-\d{2}-\d{2})/i,
    /application[s]? due[:\s]*([A-Za-z]+\s+\d{1,2},?\s*\d{4})/i,
    /application[s]? due[:\s]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
    // Standalone date patterns near deadline context
    /(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i,
    /((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4})/i,
    /(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/,
    /(\d{4}-\d{2}-\d{2})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const date = new Date(match[1]);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
  }

  // Broader date scan
  const dates = text.match(/\b(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})\b/g);
  if (dates) {
    for (const d of dates) {
      const date = new Date(d.replace(/\//g, '-'));
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
  }

  return '';
}

function extractLocation(text: string, $el: any, baseUrl: string): string {
  const lower = text.toLowerCase();

  // First try to find explicit location elements
  const locationSelectors = [
    '.location', '.location-name', '.place',
    '[class*="location"]', '[class*="place"]', '[class*="country"]',
    '[class*="region"]', '[data-location]',
    'address',
  ];
  for (const sel of locationSelectors) {
    const found = $el.find(sel).first().text().trim();
    if (found && found.length > 2 && found.length < 100) return found;
  }

  // Try labeled patterns in text
  const labeledPatterns = [
    /(?:location|where|place|venue|based in|host(?:ed)? in|study in|country|region)[:\s]*([A-Za-z\s,.-]{3,60})/i,
    /(?:located in|based in|taking place in|hosted in|studying in)[:\s]*([A-Za-z\s,.-]{3,60})/i,
  ];
  for (const pattern of labeledPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const loc = match[1].trim().split(/\n|\.|,/)[0].trim();
      if (loc.length > 2 && loc.length < 80) return loc;
    }
  }

  // Check for "Online" / "Remote"
  if (/\b(online|virtual|remote|distance)\b/i.test(text)) return 'Online';

  // Country detection
  const countries = [
    'Kenya', 'Nigeria', 'South Africa', 'Ghana', 'Ethiopia', 'Tanzania', 'Uganda',
    'Rwanda', 'Egypt', 'Morocco', 'Senegal', 'Cameroon', "Cote d'Ivoire", 'Mozambique',
    'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Mauritius', 'Malawi', 'DRC',
    'Somalia', 'Sudan', 'Tunisia', 'Algeria', 'Libya', 'Mali', 'Burkina Faso',
    'Niger', 'Chad', 'Guinea', 'Benin', 'Togo', 'Sierra Leone', 'Liberia',
    'UK', 'United Kingdom', 'USA', 'United States', 'Canada', 'Australia',
    'Germany', 'France', 'Netherlands', 'Sweden', 'Switzerland', 'Belgium',
    'Japan', 'China', 'India', 'Singapore', 'South Korea', 'New Zealand',
    'Ireland', 'Italy', 'Spain', 'Portugal', 'Norway', 'Denmark', 'Finland',
  ];
  for (const country of countries) {
    if (lower.includes(country.toLowerCase())) return country;
  }

  // City detection (common African cities)
  const cities = [
    'Nairobi', 'Lagos', 'Accra', 'Cape Town', 'Johannesburg', 'Dar es Salaam',
    'Kampala', 'Addis Ababa', 'Cairo', 'Casablanca', 'Kigali', 'Abuja',
    'Kumasi', 'Dakar', 'Lusaka', 'Harare', 'Maputo', 'Gaborone', 'Windhoek',
    'London', 'Oxford', 'Cambridge', 'Paris', 'Berlin', 'Tokyo', 'Beijing',
    'New York', 'Boston', 'San Francisco', 'Washington DC', 'Toronto',
  ];
  for (const city of cities) {
    if (lower.includes(city.toLowerCase())) return city;
  }

  // Fallback: try URL domain
  try {
    const url = new URL(baseUrl);
    const host = url.hostname.toLowerCase();
    if (host.includes('.ke')) return 'Kenya';
    if (host.includes('.ng')) return 'Nigeria';
    if (host.includes('.za')) return 'South Africa';
    if (host.includes('.uk')) return 'UK';
    if (host.includes('.us')) return 'USA';
    if (host.includes('.gh')) return 'Ghana';
    if (host.includes('.tz')) return 'Tanzania';
    if (host.includes('.ug')) return 'Uganda';
    if (host.includes('.rw')) return 'Rwanda';
  } catch {}

  return 'Global';
}

function extractDescription($: cheerio.CheerioAPI, $el: any, title: string): string {
  // Try specific description elements
  const descSelectors = [
    '.description', '.summary', '.excerpt', '.overview', '.details',
    '[class*="desc"]', '[class*="summary"]', '[class*="overview"]',
    '[class*="content"]', '.blurb', '.intro',
  ];
  for (const sel of descSelectors) {
    const text = $el.find(sel).first().text().trim();
    if (text && text.length > 20 && text.length < 2000) return text.substring(0, 500);
  }

  // Collect meaningful paragraphs (skip short ones and ones matching the title)
  const paragraphs: string[] = [];
  $el.find('p').each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 20 && text.length < 1000 && text.toLowerCase() !== title.toLowerCase()) {
      paragraphs.push(text);
    }
  });

  if (paragraphs.length > 0) {
    const combined = paragraphs.slice(0, 3).join(' ');
    return combined.substring(0, 500);
  }

  // Fallback: extract text content but skip title and very short lines
  const fullText = $el.text().replace(/\s+/g, ' ').trim();
  const lines = fullText.split(/[.\n]/).map(l => l.trim()).filter(l =>
    l.length > 15 && l.length < 500 && l.toLowerCase() !== title.toLowerCase()
  );
  if (lines.length > 0) {
    return lines.slice(0, 3).join('. ').substring(0, 500);
  }

  return fullText.substring(0, 500);
}

function extractImage($: cheerio.CheerioAPI, element: any, baseUrl: string): string {
  const $el = $(element as any);
  const img = $el.find('img').first();
  if (img.length) {
    const src = img.attr('src') || img.attr('data-src') || '';
    if (src && src.startsWith('http')) return src;
    if (src) {
      try { return new URL(src, baseUrl).href; } catch {}
    }
  }
  const bg = $el.css('background-image');
  if (bg) {
    const match = bg.match(/url\(['"]?([^'")]+)['"]?\)/);
    if (match && match[1]) {
      try { return new URL(match[1], baseUrl).href; } catch {}
    }
  }
  return '';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return res.status(400).json({ error: `Failed to fetch page: ${response.status} ${response.statusText}` });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $('script, style, nav, footer, header, .sidebar, .menu, .navigation, .ads, .cookie-banner, .popup').remove();

    const scholarships: ScrapedItem[] = [];
    const seen = new Set<string>();

    const selectors = [
      'article', '.scholarship', '.opportunity', '.listing', '.card',
      '.post', '.entry', '.item', '.result', '.award', '.grant',
      '[class*="scholarship"]', '[class*="opportunity"]', '[class*="listing"]',
      '[class*="award"]', '[class*="grant"]', '[class*="funding"]',
      '[class*="program"]', '[class*="call"]', '.content-block', '.info-block',
    ];

    for (const selector of selectors) {
      $(selector).each((_, element) => {
        const $el = $(element);
        const text = $el.text().trim();

        if (text.length < 30 || text.length > 5000) return;

        const titleEl = $el.find('h1, h2, h3, h4, a').first();
        const title = (titleEl.text() || '').trim();
        if (!title || title.length < 5 || title.length > 200) return;

        if (seen.has(title.toLowerCase())) return;
        seen.add(title.toLowerCase());

        const linkEl = $el.find('a[href]').first();
        let externalLink = linkEl.attr('href') || '';
        if (externalLink && !externalLink.startsWith('http')) {
          try { externalLink = new URL(externalLink, url).href; } catch { externalLink = url; }
        } else if (!externalLink) {
          externalLink = url;
        }

        const provider = ($el.find('.provider, .organization, .institution, .university, [class*="provider"], [class*="org"], [class*="sponsor"]').first().text() || '').trim()
          || title.split(/[-–—|]/)[0].trim()
          || new URL(url).hostname.replace('www.', '');

        const fullText = $el.text();
        scholarships.push({
          title: title.substring(0, 150),
          provider: provider.substring(0, 100),
          degree: inferDegrees(fullText + ' ' + title),
          fundingAmount: inferFunding(fullText),
          deadline: extractDeadline(fullText),
          location: extractLocation(fullText, $el, url),
          externalLink,
          imageUrl: extractImage($, element, url),
          description: extractDescription($, $el, title),
        });
      });
    }

    // Fallback: scan links for relevant scholarships
    if (scholarships.length === 0) {
      const links = $('a[href]');
      links.each((_, el) => {
        const $link = $(el);
        const text = $link.text().trim();
        const href = $link.attr('href') || '';

        if (text.length < 10 || text.length > 200) return;
        if (seen.has(text.toLowerCase())) return;

        const lower = text.toLowerCase();
        const isRelevant = lower.includes('scholarship') || lower.includes('grant') || lower.includes('funding') ||
          lower.includes('fellowship') || lower.includes('award') || lower.includes('bursary') ||
          lower.includes('apply') || lower.includes('deadline');

        if (!isRelevant) return;

        seen.add(text.toLowerCase());

        let fullLink = href;
        if (href && !href.startsWith('http')) {
          try { fullLink = new URL(href, url).href; } catch { fullLink = url; }
        }

        const $parent = $link.closest('div, li, article, section');
        const parentText = $parent.text() || '';

        scholarships.push({
          title: text.substring(0, 150),
          provider: new URL(url).hostname.replace('www.', ''),
          degree: inferDegrees(text + ' ' + parentText),
          fundingAmount: inferFunding(parentText || text),
          deadline: extractDeadline(parentText || text),
          location: extractLocation(parentText, $parent, url),
          externalLink: fullLink,
          imageUrl: '',
          description: extractDescription($, $parent.length ? $parent : $link.parent(), text).substring(0, 500),
        });

        if (scholarships.length >= 20) return false;
      });
    }

    const limited = scholarships.slice(0, 20);

    return res.status(200).json({
      success: true,
      count: limited.length,
      sourceUrl: url,
      scholarships: limited,
    });

  } catch (error: any) {
    console.error('Scraping error:', error);
    return res.status(500).json({
      error: error.name === 'TimeoutError'
        ? 'Request timed out. The website may be slow or unavailable.'
        : `Scraping failed: ${error.message || 'Unknown error'}`,
    });
  }
}
