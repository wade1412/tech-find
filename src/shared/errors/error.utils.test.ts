import { describe, it, expect } from "vitest";
import { isLazyChunkError } from "./error.utils";

describe("isLazyChunkError", () => {
  it.each([
    "Failed to fetch dynamically imported module",
    "Importing a module script failed",
    "Loading chunk 42 failed",
    "ChunkLoadError",
  ])("recognizes lazy chunk failure: %s", (error) => {
    expect(isLazyChunkError(error)).toBe(true);
  });

  it("recognizes a chunk failure provided as an Error", () => {
    expect(isLazyChunkError(new Error("Loading chunk 42 failed"))).toBe(true);
  });

  it("recognizes an error-like object with a message", () => {
    expect(
      isLazyChunkError({ message: "Importing a module script failed" }),
    ).toBe(true);
  });

  it("does not classify an ordinary render error as a chunk failure", () => {
    expect(isLazyChunkError("Failed to render")).toBe(false);
  });

  it.each(["Regular message", null, undefined, 0, false, {}])(
    "handles non-error messages safely",
    (message) => {
      expect(isLazyChunkError(message)).toBe(false);
    },
  );
});
