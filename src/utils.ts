export function isString(value: any): value is string {
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
  return Array.isArray(value) ? value : [value];
}

// From Express
export function decodeParam(value: any) {
  if (!isString(value) || !value.length) {
    return value;
  }

  try {
    return decodeURIComponent(value);
  } catch (error) {
    if (error instanceof URIError) {
      error.message = "Failed to decode param '" + value + "'";
    }

    throw error;
  }
}
