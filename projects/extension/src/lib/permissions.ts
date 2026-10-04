const ACCESS_ERROR_PATTERN = /Cannot access contents of url "([^"]+)"/;

export function extractBlockedUrl(error: unknown): string | null {
  const message = error instanceof Error ? error.message : String(error);
  return message.match(ACCESS_ERROR_PATTERN)?.[1] ?? null;
}

export async function requestHostPermission(url: string): Promise<boolean> {
  const origin = `${new URL(url).origin}/*`;
  const alreadyGranted = await browser.permissions.contains({ origins: [origin] });
  if (alreadyGranted) return true;
  return browser.permissions.request({ origins: [origin] });
}
