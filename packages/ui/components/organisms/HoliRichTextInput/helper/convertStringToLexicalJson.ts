/**
 * Converts an input string with mentions into a structured JSON format.
 * @param {string} inputString - The input string containing text and mentions.
 * @param {Array} mentions - An array of mention objects with fullName and id properties.
 * @returns {Array} - An array of segments representing the structured JSON format.
 */
import { User } from '@holi/core/screens/userprofile/types'

/**
 * Converts an input string with mentions into a structured JSON format.
 * @param {string} inputString - The input string containing text and mentions.
 * @param {Array} mentions - An array of mention objects with fullName and id properties.
 * @returns {Array} - An array of segments representing the structured JSON format.
 */
export function convertStringToLexicalJson(inputString: string, mentions: User[] = []) {
  const words = inputString.split(' ')
  const segments = []
  let normalText = ''

  // Create a lookup map from the mentions array for quick ID lookup, if mentions are provided
  const mentionsMap = mentions.reduce((map, mention) => {
    map[mention.id] = mention.fullName
    return map
  }, {})

  /**
   * Adds a normal text segment to the segments array.
   * @param {string} text - The normal text to be added.
   */
  function addTextSegment(text) {
    if (text) {
      segments.push({
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text,
        type: 'text',
        version: 1,
      })
    }
  }

  /**
   * Adds a mention segment to the segments array.
   * @param {string} id - The mention ID.
   * @param {string} userName - The full name of the mentioned user.
   */
  function addMentionSegment(id, userName) {
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
  for (const word of words) {
    if (word.startsWith('@')) {
      // Extract the mention ID (excluding the '@' character)
      const mentionId = word.slice(1)
      const userName = mentionsMap[mentionId]
      if (userName) {
        // Add accumulated normal text before adding a mention
        addTextSegment(normalText)
        normalText = '' // Reset normal text
        addMentionSegment(mentionId, userName)
      } else {
        // Append word to normal text if no mention is found
        normalText += word + ' '
      }
    } else {
      // Accumulate normal text
      normalText += word + ' '
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
