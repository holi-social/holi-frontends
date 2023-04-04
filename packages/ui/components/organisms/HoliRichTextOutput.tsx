import React from 'react'
import { Platform, StyleProp, TextStyle, ViewStyle } from 'react-native'

import { Link } from '@holi/core/screens/posts/types'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliText, { HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import { REGEX_URL, REGEX_USER_MENTIONS } from '@holi/ui/helper/richText'

export interface HoliRichTextOutputProps extends HoliTextProps {
  text: string
  users?: User[]
  links?: Link[]
  style?: StyleProp<TextStyle>
  mentionStyle?: StyleProp<ViewStyle>
  testID?: string
}

const HoliRichTextOutput: React.VFC<HoliRichTextOutputProps> = ({ text, users = [], links = [], testID, ...props }) => {
  /**
   * Replaces each @<USER-ID>
   * with the highlighted fullName
   */

  const textWithMentions = (() => {
    return text
      .split(REGEX_USER_MENTIONS)
      .map((textPart, index) => {
        const foundId = textPart.slice(1)
        const user = users?.find((user) => user.id === foundId)
        const replaced = user ? textPart.replace(REGEX_USER_MENTIONS, user.fullName) : undefined

        return user && replaced ? (
          <HoliTextLink label={user.fullName ?? ''} href={`/profile/${user.id}`} key={index}>
            {Platform.OS !== 'web' && '@'}
            {replaced}
          </HoliTextLink>
        ) : (
          textPart
        )
      })
      .flatMap((item) => {
        if (typeof item !== 'string') return item

        return item.split(REGEX_URL).map((textPart) => {
          const link = links.find(({ requestedUrl }) => textPart === requestedUrl)

          return link ? (
            <HoliTextLink href={link.requestedUrl} external label={link.title} key={link.requestedUrl}>
              {link.title}
            </HoliTextLink>
          ) : (
            textPart
          )
        })
      })
  })()

  return (
    <HoliText testID={testID} {...props}>
      {textWithMentions}
    </HoliText>
  )
}

export default HoliRichTextOutput
