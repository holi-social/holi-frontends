export type Mention = {
  leadOffset: number
  matchingString: string
  replaceableString: string
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

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' + '[' + TRIGGERS + ']' + '((?:' + VALID_CHARS + VALID_JOINS + '){0,' + LENGTH_LIMIT + '})' + ')$'
)
// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' + '[' + TRIGGERS + ']' + '((?:' + VALID_CHARS + '){0,' + ALIAS_LENGTH_LIMIT + '})' + ')$'
)
const CapitalizedNameMentionsRegex = new RegExp('(^|[^#])((?:' + NAME + '{' + 1 + ',})$)')

export const findMentionMatches = (text: string): Mention | undefined => {
  // 1. simple @-regex
  let match = AtSignMentionsRegex.exec(text)

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

/* old - not sufficient */
export const findMatchByStartPhrase = (
  text: string,
  startChar: string,
  where: 'anywhere' | 'new-word-only' = 'new-word-only'
) => {
  // TODO: special chars missing
  let pattern = null
  if (where === 'new-word-only') {
    pattern = new RegExp(`\\B${startChar}[a-z0-9_-]+|\\B${startChar}gi`)
  } else {
    //anywhere
    pattern = new RegExp(`\\${startChar}[a-z0-9_-]+|\\${startChar}i`)
  }
  const keywordArray = text.match(pattern)
  if (keywordArray && !!keywordArray.length) {
    const lastKeyword = keywordArray[keywordArray.length - 1]
    return lastKeyword
  }
}
