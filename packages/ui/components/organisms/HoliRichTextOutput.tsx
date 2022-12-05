import React from 'react'
import { Platform, StyleProp, ViewStyle } from 'react-native'

import { Link } from '@holi/core/screens/posts/types'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLink from '@holi/ui/components/molecules/HoliLink'
import { REGEX_URL, REGEX_USER_MENTIONS } from '@holi/ui/helper/richText'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliRichTextOutputProps = {
  text: string
  users?: User[]
  links?: Link[]
  style?: StyleProp<ViewStyle>
  mentionStyle?: StyleProp<ViewStyle>
  testID?: string
}

const HoliRichTextOutput: React.VFC<HoliRichTextOutputProps> = ({
  text,
  users = [],
  links = [],
  style,
  mentionStyle = { color: colors.fontColorHighlighted },
  testID,
}) => {
  /**
   * Replaces each @<USER-ID>
   * with the highlighted fullName
   */
  const getNameById = (id: string) => users?.find((user) => user.id === id)?.fullName || ''

  const textWithMentions = (() => {
    return text
      .split(REGEX_USER_MENTIONS)
      .map((textPart, index) => {
        const isMatch = textPart.match(REGEX_USER_MENTIONS)
        const replaced = isMatch ? textPart.replace(REGEX_USER_MENTIONS, getNameById(textPart.slice(1))) : undefined
        if (replaced) {
          return (
            <HoliText key={index} style={mentionStyle}>
              {Platform.OS !== 'web' && '@'}
              {replaced}
            </HoliText>
          )
        }
        return textPart
      })
      .flatMap((item) => {
        if (typeof item !== 'string') return item

        return item.split(REGEX_URL).map((textPart) => {
          const link = links.find(({ requestedUrl }) => textPart === requestedUrl)

          return link ? (
            <HoliLink href={link.requestedUrl} external label={link.title} key={link.requestedUrl}>
              {link.title}
            </HoliLink>
          ) : (
            textPart
          )
        })
      })
  })()

  return (
    <HoliText style={style} testID={testID}>
      {textWithMentions}
    </HoliText>
  )
}

export default HoliRichTextOutput
