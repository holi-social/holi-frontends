import React from 'react'
import { Platform, StyleProp, ViewStyle } from 'react-native'

import { Comment } from '@holi/core/screens/posts/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { REGEX_USER_MENTIONS } from '@holi/ui/helper/richText'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliRichTextOutputProps = {
  comment: Comment
  style?: StyleProp<ViewStyle>
  mentionStyle?: StyleProp<ViewStyle>
  testID?: string
}

const HoliRichTextOutput: React.VFC<HoliRichTextOutputProps> = ({
  comment,
  style,
  mentionStyle = { color: colors.fontColorHighlighted },
  testID,
}) => {
  /**
   * Replaces each @<USER-ID>
   * with the highlighted fullName
   */
  const getNameById = (id: string) => comment.mentions?.find((mention) => mention.id === id)?.fullName || ''

  const textWithMentions = (() => {
    const textParts: React.ReactChild[] = []
    comment.text.split(REGEX_USER_MENTIONS).forEach((textPart, index) => {
      const isMatch = textPart.match(REGEX_USER_MENTIONS)
      const replaced = isMatch ? textPart.replace(REGEX_USER_MENTIONS, getNameById(textPart.slice(1))) : undefined
      if (replaced) {
        textParts.push(
          <HoliText key={index} style={mentionStyle}>
            {Platform.OS !== 'web' && '@'}
            {replaced}
          </HoliText>
        )
      } else {
        textParts.push(<HoliText key={index}>{textPart}</HoliText>)
      }
    })
    return textParts
  })()

  return (
    <HoliText style={style} testID={testID}>
      {textWithMentions}
    </HoliText>
  )
}

export default HoliRichTextOutput
