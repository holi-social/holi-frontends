import { Text } from 'holi-bricks/components/text'
import React from 'react'
import { Platform, type StyleProp, type TextStyle, type ViewStyle } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import { createUUID } from '@holi/core/helpers/strings'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import type { Link } from '@holi/core/screens/posts/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import type { HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import { REGEX_URL, REGEX_USER_MENTIONS, ensureProtocolPrefix, isValidUrl } from '@holi/ui/helper/richText'

export interface Props extends HoliTextProps {
  text: string
  users?: User[]
  links?: Link[]
  style?: StyleProp<TextStyle>
  mentionStyle?: StyleProp<ViewStyle>
  linkMentionsToProfile?: boolean
  allowAllLinks?: boolean
  testID?: string
  onPressText?: () => void
}

const HoliRichTextOutput = ({
  text,
  users = [],
  links = [],
  testID,
  size,
  allowAllLinks = false,
  linkMentionsToProfile = true,
  onPressText,
  ...props
}: Props) => {
  const linkSize = size === undefined || size === 'extralarge' || size === 'large' ? 'md' : 'sm'

  /**
   * Replaces each @<USER-ID>
   * with the highlighted fullName
   */

  const isExternalLink = (url: string) => {
    const domains = ['app.holi.social', 'staging.dev.holi.social', 'localhost']
    return !domains.some((domain) => url.includes(domain))
  }

  const mentionPrefix = Platform.OS === 'web' ? '' : '@'

  const textWithMentions = (() => {
    return text
      .split(REGEX_USER_MENTIONS)
      .map((textPart, index) => {
        const foundId = textPart.slice(1)
        const user = users?.find((user) => user.id === foundId)
        const replaced = user ? textPart.replace(REGEX_USER_MENTIONS, user.fullName) : undefined

        return user && replaced ? (
          linkMentionsToProfile ? (
            <HoliTextLink
              label={user.fullName ?? ''}
              href={`/profile/${user.id}`}
              key={index}
              size={linkSize}
              color="informative"
            >
              {mentionPrefix}
              {replaced}
            </HoliTextLink>
          ) : (
            <Text key={index} size={linkSize}>
              {mentionPrefix}
              {replaced}
            </Text>
          )
        ) : (
          textPart
        )
      })
      .flatMap((item) => {
        if (typeof item !== 'string') return item

        return item.split(REGEX_URL).map((textPart) => {
          let link = links.find(({ requestedUrl }) => textPart === requestedUrl)

          const urlWithProtocol = ensureProtocolPrefix(textPart)

          if (!link && allowAllLinks && isValidUrl(urlWithProtocol)) {
            link = {
              requestedUrl: urlWithProtocol,
              title: urlWithProtocol,
              url: '',
              description: '',
              type: '',
              image: '',
              siteName: '',
              origin: '',
            }
          }

          return link ? (
            <HoliTextLink
              href={link.requestedUrl}
              label={link.title}
              size={linkSize}
              key={link.requestedUrl}
              external={isExternalLink(link.requestedUrl)}
              color="informative"
            >
              {link.title}
            </HoliTextLink>
          ) : !!textPart.trim() && onPressText ? (
            <HoliText key={createUUID()} onPress={onPressText} {...props}>
              {textPart}
            </HoliText>
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
