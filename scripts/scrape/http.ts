// 礼儀正しいHTTP取得ヘルパー。
// - User-Agent は正体を明示（robots.txt は一般UAに Allow:/、AIボットUAはブロック）。
// - 一時的なネットワークエラー/5xx はリトライ。404 は「ページ終端」として即時throw（リトライしない）。

const USER_AGENT = 'PokecaPriceBot/0.1 (+price comparison)';

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export class HttpError extends Error {
  status: number;
  constructor(status: number, statusText: string) {
    super(`HTTP ${status} ${statusText}`);
    this.status = status;
  }
}

export async function politeGet(url: string, retries = 3): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'ja,en;q=0.8' },
        redirect: 'follow',
      });
      // 404 は末尾超過＝終端。リトライせず投げる。
      if (res.status === 404) throw new HttpError(404, res.statusText);
      if (!res.ok) throw new HttpError(res.status, res.statusText); // 5xx等はリトライ対象
      return await res.text();
    } catch (e) {
      if (e instanceof HttpError && e.status === 404) throw e;
      lastErr = e;
      if (attempt < retries) await sleep(2000 * (attempt + 1)); // バックオフ
    }
  }
  throw lastErr;
}
