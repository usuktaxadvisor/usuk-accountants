import type { MetadataRoute } from 'next';

/**
 * Robots policy.
 *
 * We explicitly welcome the major AI / answer-engine crawlers in addition to the
 * standard wildcard, because being cited by AI search (ChatGPT, Claude, Perplexity,
 * Gemini/Google AI Overviews, Copilot) is a primary distribution goal for this site.
 * Listing them explicitly documents intent and avoids any ambiguity if the wildcard
 * policy is ever tightened.
 */
export default function robots(): MetadataRoute.Robots {
  const allowAll = { allow: '/' };
  return {
    rules: [
      { userAgent: '*', ...allowAll },
      // Search engines
      { userAgent: 'Googlebot', ...allowAll },
      { userAgent: 'Bingbot', ...allowAll },
      // AI / answer engines we want to be cited by
      { userAgent: 'GPTBot', ...allowAll },              // OpenAI / ChatGPT
      { userAgent: 'OAI-SearchBot', ...allowAll },       // ChatGPT Search
      { userAgent: 'ChatGPT-User', ...allowAll },        // ChatGPT browsing
      { userAgent: 'ClaudeBot', ...allowAll },           // Anthropic / Claude
      { userAgent: 'Claude-Web', ...allowAll },          // Anthropic browsing
      { userAgent: 'anthropic-ai', ...allowAll },        // Anthropic
      { userAgent: 'PerplexityBot', ...allowAll },       // Perplexity
      { userAgent: 'Perplexity-User', ...allowAll },     // Perplexity browsing
      { userAgent: 'Google-Extended', ...allowAll },     // Gemini / AI Overviews training
      { userAgent: 'Applebot-Extended', ...allowAll },   // Apple Intelligence
      { userAgent: 'CCBot', ...allowAll },               // Common Crawl (feeds many models)
    ],
    sitemap: 'https://www.usukaccountants.com/sitemap.xml',
  };
}
