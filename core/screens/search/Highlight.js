import { Text } from 'holi-bricks/components/text/Text'
import { getHighlightedParts, getPropertyByPath } from 'instantsearch.js/es/lib/utils'
import React, { Fragment } from 'react'
import { View } from 'react-native'

function HighlightPart({ children, isHighlighted }) {
  if (isHighlighted) {
    return (
      <Text size={'md'} variant={'error'}>
        {children}
      </Text>
    )
  } else {
    return <Text size={'md'}>{children}</Text>
  }
}

export function Highlight({ hit, attribute, separator = ', ' }) {
  const { value: attributeValue = '' } = getPropertyByPath(hit._highlightResult, attribute) || {}
  const parts = getHighlightedParts(attributeValue)

  return (
    <View style={{ flexDirection: 'row' }}>
      {parts.map((part, partIndex) => {
        if (Array.isArray(part)) {
          const isLastPart = partIndex === parts.length - 1

          return (
            <Fragment key={partIndex}>
              {part.map((subPart, subPartIndex) => (
                <HighlightPart key={subPartIndex} isHighlighted={subPart.isHighlighted}>
                  {subPart.value}
                </HighlightPart>
              ))}

              {!isLastPart && separator}
            </Fragment>
          )
        } else {
          return (
            <HighlightPart key={partIndex} isHighlighted={part.isHighlighted}>
              {part.value}
            </HighlightPart>
          )
        }
      })}
    </View>
  )
}
