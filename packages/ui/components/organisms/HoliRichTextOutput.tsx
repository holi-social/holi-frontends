import React from 'react'
import { Platform, StyleProp, TextStyle, ViewStyle } from 'react-native'

import { Link } from '@holi/core/screens/posts/types'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import type { HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import { REGEX_URL, REGEX_USER_MENTIONS, isValidUrl } from '@holi/ui/helper/richText'

export interface Props extends HoliTextProps {
  text: string
  users?: User[]
  links?: Link[]
  style?: StyleProp<TextStyle>
  mentionStyle?: StyleProp<ViewStyle>
  allowAllLinks?: boolean
  testID?: string
}

const HoliRichTextOutput = ({ text, users = [], links = [], testID, size, allowAllLinks = false, ...props }: Props) => {
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
        const linkSize = size === undefined || size === 'extralarge' || size === 'large' ? 'default' : size

        return user && replaced ? (
          <HoliTextLink label={user.fullName ?? ''} href={`/profile/${user.id}`} key={index} size={linkSize}>
            {Platform.OS !== 'web' ? '@' : ''}
            {replaced}
          </HoliTextLink>
        ) : (
          textPart
        )
      })
      .flatMap((item) => {
        if (typeof item !== 'string') return item

        return item.split(REGEX_URL).map((textPart) => {
          let link = links.find(({ requestedUrl }) => textPart === requestedUrl)

          if (!link && allowAllLinks && isValidUrl(textPart)) {
            link = {
              requestedUrl: textPart,
              title: textPart,
              url: '',
              description: '',
              type: '',
              image: '',
              siteName: '',
              origin: '',
            }
          }

          return link ? (
            <HoliTextLink href={link.requestedUrl} label={link.title} key={link.requestedUrl} external>
              {link.title}
            </HoliTextLink>
          ) : (
            textPart
          )
        })
      })
  })()

  return (
    <HoliText testID={testID} size={size} {...props}>
      {textWithMentions}
    </HoliText>
  )
}

export default HoliRichTextOutput
