/**
 * Masks an email address for privacy by showing only the first few characters
 * of the local part while keeping the domain visible.
 * Examples:
 * - "john@example.com" -> "joh*@example.com"
 * - "a@example.com" -> "*@example.com"
 * - "ab@example.com" -> "a*@example.com"
 * - "abc@example.com" -> "a**@example.com"
 * - 'johnDoe@doe.com' -> 'jo****@doe.com'
 */

export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@')
  if (!domain) return email

  // If local part is less than 3 characters, mask at least 1 letter
  const visiblePart = localPart.slice(0, 3)
  const maskedLocalPart =
    localPart.length === 1
      ? '*'
      : localPart.length <= 3
        ? localPart[0] + '*'.repeat(localPart.length - 1)
        : visiblePart + '*'.repeat(localPart.length - visiblePart.length)

  return `${maskedLocalPart}@${domain}`
}
