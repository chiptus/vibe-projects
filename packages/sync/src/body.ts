/**
 * Collect a request body, giving up as soon as it passes `limit` bytes. Resolves to
 * null when the limit is exceeded, without buffering the rest of the stream.
 */
export async function readBody(stream: AsyncIterable<Uint8Array | string>, limit: number): Promise<Buffer | null> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of stream) {
    const buf = typeof chunk === "string" ? Buffer.from(chunk) : Buffer.from(chunk);
    total += buf.length;
    if (total > limit) return null;
    chunks.push(buf);
  }
  return Buffer.concat(chunks);
}
