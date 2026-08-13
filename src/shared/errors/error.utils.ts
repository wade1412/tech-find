const LAZY_CHUNK_ERROR_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /importing a module script failed/i,
  /loading chunk .* failed/i,
  /chunkloaderror/i,
];

export const isLazyChunkError = (error: unknown): boolean => {
  let message: string;

  if (error instanceof Error) {
    message = `${error.name}: ${error.message}`;
  } else if (typeof error === "string") {
    message = error;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String((error as { message: unknown }).message);
  } else {
    return false;
  }

  return LAZY_CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(message));
};
