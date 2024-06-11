import { TFunction } from 'i18next'

type PostTitleProps = {
  name: string
  currentLanguage: string
  t: TFunction
}

const generatePostTitle = ({ name, currentLanguage, t }: PostTitleProps) => {
  const sSoundingChars = ['s', 'ß', 'z', 'x']
  const lastChar = name.slice(-1)
  let possessiveName = ''

  if (currentLanguage === 'en') {
    possessiveName = sSoundingChars.includes(lastChar) ? `${name}'` : `${name}'s`
  } else if (currentLanguage === 'de') {
    possessiveName = sSoundingChars.includes(lastChar) ? `${name}'` : `${name}s`
  }

  return t('individuals.post.details.title', {
    name: possessiveName,
  })
}

export default generatePostTitle
