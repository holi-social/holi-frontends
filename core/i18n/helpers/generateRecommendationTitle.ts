import { TFunction } from 'i18next'

type RecommendationTitleProps = {
  name: string
  numRecommendations: number
  currentLanguage: string
  t: TFunction
}

const generateRecommendationTitle = ({ name, numRecommendations, currentLanguage, t }: RecommendationTitleProps) => {
  const sSoundingChars = ['s', 'ß', 'z', 'x']
  const lastChar = name.slice(-1)
  let possessiveName = ''

  if (currentLanguage === 'en') {
    possessiveName = sSoundingChars.includes(lastChar) ? `${name}'` : `${name}'s`
  } else if (currentLanguage === 'de') {
    possessiveName = sSoundingChars.includes(lastChar) ? `${name}'` : `${name}s`
  }

  if (numRecommendations === 1) {
    return t('insights.recommendations.title.creator.single', { name: possessiveName })
  } else {
    return t('insights.recommendations.title.creator.multiple', {
      name: possessiveName,
      number: numRecommendations,
    })
  }
}

export default generateRecommendationTitle
