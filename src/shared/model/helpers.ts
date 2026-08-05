export const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
