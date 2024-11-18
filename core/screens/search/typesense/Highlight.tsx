import { SearchHitData } from '@holi/core/screens/search/typesense/types'
import { Text, TextSize } from 'holi-bricks/components/text/Text'
import { Hit } from 'instantsearch.js'
import { getHighlightedParts, getPropertyByPath } from 'instantsearch.js/es/lib/utils'
import React, { Fragment, PropsWithChildren } from 'react'
import { View } from 'react-native'

type HighlightPartProps = {
  isHighlighted: boolean
  size: TextSize
} & PropsWithChildren

function HighlightPart({ children, isHighlighted, size }: HighlightPartProps) {
  if (isHighlighted) {
    return (
      <Text size={size} variant={'error'}>
        {children}
      </Text>
    )
  } else {
    return <Text size={size}>{children}</Text>
  }
}

export type HighlightProps = {
  hit: Hit<SearchHitData>
  size: TextSize
  attribute: string
}

export function Highlight({ hit, attribute, size }: HighlightProps) {
  const { value: attributeValue = '' } = getPropertyByPath(hit._highlightResult, attribute) || {}
  const parts = getHighlightedParts(attributeValue)

  // TODO how to do width: 90% correctly?
  return (
    <View style={{ flexDirection: 'row', width: '93%' }}>
      {parts.map((part, partIndex) => {
        if (Array.isArray(part)) {
          return (
            <Fragment key={partIndex}>
              {part.map((subPart, subPartIndex) => (
                <HighlightPart size={size} key={subPartIndex} isHighlighted={subPart.isHighlighted}>
                  {subPart.value}
                </HighlightPart>
              ))}
            </Fragment>
          )
        } else {
          return (
            <HighlightPart size={size} key={partIndex} isHighlighted={part.isHighlighted}>
              {part.value}
            </HighlightPart>
          )
        }
      })}
    </View>
  )
}
