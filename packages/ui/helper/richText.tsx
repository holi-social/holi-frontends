import { dummyUser } from '@holi/ui/helper/dummyUser'

export const findUserByName = (keyword: string) => {
  return dummyUser.filter((user) => user.name.toLowerCase().includes(keyword.toLowerCase()))
}

const hashtags = [
  { id: 'todo', name: 'todo' },
  { id: 'help', name: 'help' },
  { id: 'loveyou', name: 'loveyou' },
]
export const findHashtagByName = (keyword: string) => {
  return hashtags.filter((one) => one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
}

export const REGEX_URL =
  // eslint-disable-next-line no-useless-escape
  /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi

export const addDistinctItem = (objectArray: object[] = [], newObject: object, distinctPropName: string) => {
  if (!newObject || !Object.hasOwn(newObject, distinctPropName) || !distinctPropName || distinctPropName.length < 1) {
    return objectArray
  }
  const newArray = [...objectArray, newObject]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [...new Map(newArray.map((item: Record<string, any>) => [item[distinctPropName], item])).values()]
}

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;'
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']'
const TRIGGERS = ['@'].join('')
const LENGTH_LIMIT = 75
// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50
// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNCTUATION + '\\s]'
// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNCTUATION +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  ')'
export const REGEX_MENTION = new RegExp(
  '(^|\\s|\\()(' + '[' + TRIGGERS + ']' + '((?:' + VALID_CHARS + VALID_JOINS + '){0,' + LENGTH_LIMIT + '})' + ')$'
)
// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' + '[' + TRIGGERS + ']' + '((?:' + VALID_CHARS + '){0,' + ALIAS_LENGTH_LIMIT + '})' + ')$'
)
const CapitalizedNameMentionsRegex = new RegExp('(^|[^#])((?:' + NAME + '{1,})$)')

export type Mention = {
  leadOffset: number
  matchingString: string
  replaceableString: string
}

export const findMentionMatches = (text: string): Mention | undefined => {
  // 1. simple @-regex
  let match = REGEX_MENTION.exec(text)

  // 2. @-alias-regex
  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text)
  }

  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1]

    const matchingString = match[3]
    if (matchingString.length >= 1) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      }
    }
  }

  // 3. @-capitalized-name-regex
  match = CapitalizedNameMentionsRegex.exec(text)
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1]

    const matchingString = match[2]
    if (matchingString != null && matchingString.length >= 3) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: matchingString,
      }
    }
  }
}
