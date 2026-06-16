// 礼儀正しいHTTP取得ヘルパー。
// - User-Agent は正体を明示（robots.txt は一般UAに Allow:/、AIボットUAはブロック）。
// - 呼び出し側で sleep を挟みレート制限する。

const USER_AGENT = 'PokecaPriceBot/0.1 (+price comparison)';

export async function politeGet(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept-Language': 'ja,en;q=0.8',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.text();
}

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
