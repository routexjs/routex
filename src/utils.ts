export function isString(value: any): boolean {
  return typeof value === "string" || value instanceof String;
}

export function toLowerCases(
  value: string | string[] | undefined
): string | string[] | undefined {
  if (!value) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(toLowerCases) as string[];
  }

  return value.toLowerCase();
}

export function toArray<T>(value: T[] | T): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}
