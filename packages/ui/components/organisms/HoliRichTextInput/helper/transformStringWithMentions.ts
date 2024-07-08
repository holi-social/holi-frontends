import { User } from '@holi/core/screens/userprofile/types'

/**
 * Mobile only method to convert a string with mentions into the format needed for the react-native-controlled-mentions library.
 */

export function transformStringWithMentions(input: string, users: User[]): string {
  // Create a map from the users array for quick lookup
  const userMap = new Map(users.map((user) => [user.id, user.fullName]))

  // Use a regular expression to find all mentions in the input string
  // eslint-disable-next-line no-useless-escape
  const mentionRegex = /@([a-f0-9\-]{36})/g

  // Replace the mentions in the string
  const result = input.replace(mentionRegex, (match, p1) => {
    const userId = p1
    const userName = userMap.get(userId)

    // If a user is found, format the mention as specified
    if (userName) {
      return `@[${userName}](${userId})`
    }

    // If no user is found, return the original mention
    return match
  })

  return result
}
