export function asString(value: unknown): string | undefined {
  if (typeof value === 'string' || value instanceof String) {
    return value as string
  } else {
    return undefined
  }
}
