import short from 'short-uuid'
import { getEnv } from './env'
import bcrypt from 'bcryptjs'

export async function authenticate(username: string, password: string) {
  const storedHash = (await hashForUser(username)) || '$2a$10$XHDTB0GofOPcpSMydLdwGecRbPob3G1HGLV2lbKWhJKt26dOJpetW' // Always compare to some hash to avoid timing attacks
  const isMatch = await bcrypt.compare(password, storedHash)

  if (!isMatch) {
    return undefined
  }

  const token = short.generate()

  return token
}

async function hashForUser(username: string) {
  if (username !== getEnv('HARDCODED_USERNAME')) {
    return null
  }

  const salt = '$2a$10$XHDTB0GofOPcpSMydLdwGe'
  return bcrypt.hash(getEnv('HARDCODED_PASSWORD'), salt)
}
