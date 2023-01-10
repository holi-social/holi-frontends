import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliText, { HoliTextProps } from '@holi/ui/components/atoms/HoliText'

const HoliSeparatedList: React.VFC<HoliTextProps> = ({ children, ...props }) => {
  const { t } = useTranslation()

  if (!children) {
    console.warn('HoliSeparatedList component expects at least one child component')
    return null
  }

  const childrenArr = React.Children.toArray(children)
  const { length } = childrenArr
  return (
    <>
      {childrenArr.reduce<React.ReactNode[]>((acc, node, idx) => {
        if (0 < idx && idx < childrenArr.length - 1) {
          return [
            ...acc,
            <HoliText key={`${idx}-comma`} {...props}>
              {', '}
            </HoliText>,
            node,
          ]
        } else if (length > 1 && idx === length - 1) {
          return [
            ...acc,
            <HoliText key={`${idx}-and`} {...props}>
              {' ' + t('global.and') + ' '}
            </HoliText>,
            node,
          ]
        } else {
          return [...acc, node]
        }
      }, [])}
    </>
  )
}

export default HoliSeparatedList
