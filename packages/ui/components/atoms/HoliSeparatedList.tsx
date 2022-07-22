import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

const HoliSeparatedList: React.FC = ({ children }) => {
  if (!children) throw new Error('HoliSeparatedList component expects at least one child component')

  const { t } = useTranslation()
  const childrenArr = React.Children.toArray(children)
  const { length } = childrenArr
  return (
    <>
      {childrenArr.reduce<React.ReactNode[]>((acc, node, idx) => {
        if (0 < idx && idx < childrenArr.length - 1) {
          return [...acc, <Text key={`${idx}-comma`}>, </Text>, node]
        } else if (length > 1 && idx === length - 1) {
          return [...acc, <Text key={`${idx}-and`}> {t('general.and')} </Text>, node]
        } else {
          return [...acc, node]
        }
      }, [])}
    </>
  )
}

export default HoliSeparatedList
