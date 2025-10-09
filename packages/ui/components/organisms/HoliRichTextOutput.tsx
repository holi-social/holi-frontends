import { Text, type TextLinkProps, type TextLinkSize } from 'holi-bricks/components/text'
import React from 'react'
import { Platform, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import { createUUID } from '@holi/core/helpers/strings'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import type { Link } from '@holi/core/screens/posts/types'
import { REGEX_URL, REGEX_USER_MENTIONS, ensureProtocolPrefix, isValidUrl } from '@holi/ui/helper/richText'
import type { SkeletonTextOptions } from '@holi/ui/components/atoms/HoliSkeleton/types'
import { defaultTextOptionsAsProps } from '@holi/ui/components/atoms/HoliSkeleton/defaults'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'

export interface HoliRichTextProps extends Omit<Omit<TextLinkProps, 'variant'>, 'size'> {
  text: string
  users?: User[]
  links?: Link[]
  /**
   * @deprecated This is an unused property, it is not applied to any internal component. It will be removed when this component is migrated to holiBricks.
   */
  style?: StyleProp<TextStyle>
  mentionStyle?: StyleProp<ViewStyle>
  linkMentionsToProfile?: boolean
  allowAllLinks?: boolean
  testID?: string
  onPressText?: () => void
  loading?: boolean
  size?: TextLinkSize
  skeletonOptions?: SkeletonTextOptions
}

const HoliRichTextOutput = ({
  text,
  users = [],
  links = [],
  testID,
  size = 'md',
  allowAllLinks = false,
  linkMentionsToProfile = true,
  loading,
  skeletonOptions,
  numberOfLines,
  onPressText,
  color = 'support',
  ...props
}: HoliRichTextProps) => {
  /**
   * Replaces each @<USER-ID>
   * with the highlighted fullName
   */

  const isExternalLink = (url: string) => {
    const domains = [
      'app.holi.social',
      'staging.dev.holi.social',
      'localhost',
      'challenges.holi.social',
      'staging.challenges-dev.holi.social',
    ]
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
              size={size}
              color="informative"
            >
              {mentionPrefix}
              {replaced}
            </HoliTextLink>
          ) : (
            <Text key={index} size={size} color={color}>
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
              size={size}
              key={link.requestedUrl}
              external={isExternalLink(link.requestedUrl)}
              color="informative"
            >
              {link.title}
            </HoliTextLink>
          ) : !!textPart.trim() && onPressText ? (
            <Text size={size} key={createUUID()} onPress={onPressText} color={color} {...props}>
              {textPart}
            </Text>
          ) : (
            textPart
          )
        })
      })
  })()

  const sizesToSkeletonHeight = {
    md: 16,
    sm: 15,
    xs: 12,
  }

  if (loading) {
    return (
      <View style={props?.style as StyleProp<ViewStyle>}>
        <HoliSkeleton
          {...defaultTextOptionsAsProps(skeletonOptions, numberOfLines, sizesToSkeletonHeight[size], '60%')}
        />
      </View>
    )
  }

  // Check if there are any links in the text to avoid nested anchor tags
  const hasLinks = links.length > 0 || REGEX_URL.test(text)

  if (hasLinks && Platform.OS === 'web') {
    return (
      <View testID={testID} style={props?.style as StyleProp<ViewStyle>}>
        {textWithMentions}
      </View>
    )
  }

  return (
    <Text testID={testID} size={size} color={color} numberOfLines={numberOfLines} {...props}>
      {textWithMentions}
    </Text>
  )
}

export default HoliRichTextOutput
