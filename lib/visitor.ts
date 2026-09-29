export const VISITOR_NAME_KEY = "universe-store-visitor-name-v1";

export function normalizeVisitorName(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, 40);
}

export function isValidVisitorName(value: string) {
  const name = normalizeVisitorName(value);
  return /^[\p{L}][\p{L}\p{M}'’ -]{1,39}$/u.test(name);
}

export function firstName(value: string) {
  return normalizeVisitorName(value).split(" ")[0] ?? "";
}
