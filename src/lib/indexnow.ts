/**
 * INDEXNOW SUBMISSION UTILITY
 *
 * IndexNow lets us notify Bing, Microsoft Copilot, Yandex and other
 * participating engines the instant a page is published or changed, instead
 * of waiting for scheduled crawling. Google does not use IndexNow, but it
 * covers the Microsoft/Bing ecosystem that powers Copilot and ChatGPT search.
 *
 * The key file lives at /public/<KEY>.txt and must contain exactly the key.
 * The host, key, and key-file location must all line up or submissions are
 * rejected — so all three are derived from the constants below.
 */

const HOST = 'www.usukaccountants.com';
const KEY = 'acc6f098a81093d00ee61b0f44e5efa4';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

export interface IndexNowResult {
  ok: boolean;
  status: number;
  submitted: number;
  message: string;
}

/**
 * Submit one or more absolute URLs to IndexNow.
 * URLs must be on the HOST domain. Non-matching URLs are filtered out.
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  const clean = urls
    .map((u) => u.trim())
    .filter((u) => u.startsWith(`https://${HOST}/`) || u === `https://${HOST}`);

  if (clean.length === 0) {
    return { ok: false, status: 0, submitted: 0, message: 'No valid URLs to submit.' };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: clean,
      }),
    });

    const ok = res.status === 200 || res.status === 202;
    return {
      ok,
      status: res.status,
      submitted: ok ? clean.length : 0,
      message: ok
        ? `Submitted ${clean.length} URL(s) to IndexNow.`
        : `IndexNow responded with status ${res.status}.`,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      submitted: 0,
      message: `IndexNow request failed: ${err instanceof Error ? err.message : 'unknown error'}`,
    };
  }
}
