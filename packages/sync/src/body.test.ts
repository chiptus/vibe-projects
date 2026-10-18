import { Readable } from "node:stream";
import { describe, expect, it } from "vitest";
import { readBody } from "./body";

describe("readBody", () => {
  it("collects a body within the limit", async () => {
    const body = await readBody(Readable.from([Buffer.from("hello "), Buffer.from("world")]), 100);
    expect(body?.toString()).toBe("hello world");
  });

  it("returns null once the limit is passed, without reading the rest", async () => {
    let pulled = 0;
    async function* chunks() {
      for (let i = 0; i < 1000; i++) {
        pulled++;
        yield Buffer.alloc(10);
      }
    }
    expect(await readBody(chunks(), 25)).toBeNull();
    expect(pulled).toBeLessThanOrEqual(3); // stopped at the third chunk, not buffered to the end
  });

  it("accepts exactly the limit", async () => {
    expect((await readBody(Readable.from([Buffer.alloc(10)]), 10))?.length).toBe(10);
  });
});
