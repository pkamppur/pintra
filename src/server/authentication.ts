import short from 'short-uuid'
import { getEnv } from './env'
import bcrypt from 'bcryptjs'

interface AuthenticatedSession {
  username: string
  token: string
  expires: Date
}

const authenticatedSessions: Map<string, AuthenticatedSession> = new Map()

export async function authenticate(username: string, password: string) {
  const storedHash = (await hashForUser(username)) || '$2a$10$XHDTB0GofOPcpSMydLdwGecRbPob3G1HGLV2lbKWhJKt26dOJpetW' // Always compare to some hash to avoid timing attacks
  const isMatch = await bcrypt.compare(password, storedHash)

  if (!isMatch) {
    return null
  }

  const token = short.generate()

  const tokenValidMinutes = 60 * 24 * 30 // 30 days
  const today = new Date()
  const expires = new Date()
  expires.setTime(today.getTime() + tokenValidMinutes * 60 * 1000)

  authenticatedSessions.set(token, { username, token, expires })

  return token
}

async function hashForUser(username: string) {
  if (username !== getEnv('HARDCODED_USERNAME')) {
    return null
  }

  const salt = '$2a$10$XHDTB0GofOPcpSMydLdwGe'
  return bcrypt.hash(getEnv('HARDCODED_PASSWORD'), salt)
}

export async function userFromAuthToken(token: string) {
  if (process.env['DISABLE_AUTH']) {
    return 'userid'
  }

  const authenticatedToken = authenticatedSessions.get(token)

  if (!authenticatedToken) {
    throw new Error('Invalid token')
  }

  const now = new Date()

  if (authenticatedToken.expires < now) {
    authenticatedSessions.delete(token)
    throw new Error('Invalid token')
  }

  return authenticatedToken.username
}
