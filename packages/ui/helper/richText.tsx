export type Mention = {
  leadOffset: number
  matchingString: string
  replaceableString: string
}

// Copied from: https://github.com/dabakovich/react-native-controlled-mentions/blob/v2.2.4/example/mentions-app.tsx
export const REGEX_URL =
  // eslint-disable-next-line no-useless-escape
  /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi

// @<USER-ID>
export const REGEX_USER_MENTIONS = /(@[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})/g

// @[<USER-Name>](<USER-ID>)
// Usage: aString.replace(REGEX_USER_MENTIONS_WITH_NAME, '@$1')
// e.g. '@[Paul Müller](a00-02)' => '@a00-02'
export const REGEX_USER_MENTIONS_WITH_NAME = /@\[.{3,36}\]\(+([^\][]+)\)/g
// export const REGEX_USER_MENTIONS_WITH_NAME = /@\[[0-9a-fA-F-]{36}\]\(+([^\][]+)\)/g

// @<ANY_STRING_WITH_SPECIAL_CHARS>
// Regex for "@SomeUserName" or "@some user name" or "@some-user_name"
// Copied from https://github.com/facebook/lexical/blob/0.6.1-next.1/packages/lexical-playground/src/plugins/MentionsPlugin/index.tsx
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
