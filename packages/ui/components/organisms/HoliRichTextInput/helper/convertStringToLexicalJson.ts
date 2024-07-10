import { User } from '@holi/core/screens/userprofile/types'

/**
 * Web only method to convert a string with mentions into a structured JSON format.
 */

interface LexicalSegment {
  detail: number
  format: number
  mode: 'normal' | 'segmented'
  style: string
  text: string
  type: 'text' | 'mention'
  version: number
  userId?: string
  userName?: string
  displayString?: string
}

/**
 * Converts an input string with mentions into a structured JSON format.
 * @param {string} inputString - The input string containing text and mentions.
 * @param {Array} mentions - An array of mention objects with fullName and id properties.
 * @returns {Array} - An array of segments representing the structured JSON format.
 */
export function convertStringToLexicalJson(inputString: string, mentions: User[] = []) {
  const words = inputString.split(' ')
  const segments: LexicalSegment[] = []
  let normalText = ''

  // Create a lookup map from the mentions array for quick ID lookup, if mentions are provided
  const mentionsMap = mentions.reduce((map: Record<string, string>, mention: User) => {
    map[mention.id] = mention.fullName
    return map
  }, {})

  /**
   * Adds a normal text segment to the segments array.
   * @param {string} text - The normal text to be added.
   */
  function addTextSegment(text: string) {
    if (!text) return

    segments.push({
      detail: 0,
      format: 0,
      mode: 'normal',
      style: '',
      text: text,
      type: 'text',
      version: 1,
    })
  }

  /**
   * Adds a mention segment to the segments array.
   * @param {string} id - The mention ID.
   * @param {string} userName - The full name of the mentioned user.
   */
  function addMentionSegment(id: string, userName: string) {
    segments.push({
      detail: 1,
      format: 0,
      mode: 'segmented',
      style: '',
      text: userName,
      type: 'mention',
      version: 1,
      userId: id,
      userName: userName,
      displayString: `@${userName}`,
    })
  }

  // Process each word in the input string
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const appendSpace = i === words.length - 1 ? '' : ' '
    if (word.startsWith('@')) {
      // Extract the mention ID (excluding the '@' character)
      const mentionId = word.slice(1)
      const userName = mentionsMap[mentionId]
      if (userName) {
        // Add accumulated normal text before adding a mention
        addTextSegment(normalText)
        normalText = appendSpace // Reset normal text
        addMentionSegment(mentionId, userName)
      } else {
        // Append word to normal text if no mention is found
        normalText += word + appendSpace
      }
    } else {
      // Accumulate normal text
      normalText += word + appendSpace
    }
  }

  // Add any remaining normal text as the final text segment
  addTextSegment(normalText)

  return {
    root: {
      children: [
        {
          children: segments,
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}
