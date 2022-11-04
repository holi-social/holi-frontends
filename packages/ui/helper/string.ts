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
