import process from 'process'

export function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`ENV MISSING: ${name}`)
  }
  return value
}
