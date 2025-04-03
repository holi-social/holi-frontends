import React, { type ReactNode } from 'react'
import { View } from 'react-native'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import type { ImageSource as LegacyImageSource } from '@holi/ui/components/atoms/HoliImage/types'
import { ChipLabel } from 'holi-bricks/components/chips'
import type { ChipColor } from 'holi-bricks/components/chips/ChipLabel'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Text, TextLink } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import { useTranslation } from 'react-i18next'
import HoliCalendarIcon from '@holi/ui/components/molecules/HoliCalendarIcon'
import HoliHead from '@holi/core/components/HoliHead'
import { CoverImage } from '@holi/core/components/CoverImage'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'

import { ExternalLink, Global, Lock } from '@holi/icons/src/generated'
import { AuthorBanner, type AuthorBannerProps } from 'holi-bricks/patterns/author-banner'
import { Spacing } from 'holi-bricks/tokens'
import { DetailsScreenSkeleton } from '@holi/core/layout/DetailsScreen/skeleton'
import { HtmlRenderer } from 'holi-bricks/components/html-renderer'
import { TextLinkTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import type { ImageSource } from 'holi-bricks/components/image'
import { Avatar } from 'holi-bricks/components/avatar'

export type DetailsScreenInfoList = {
  title: string
  icon: HoliIconType
  subtitle?: string
  onPress?(): void
  showExternalIcon?: boolean
}

export type DetailsScreenChips = {
  title: string
  color: ChipColor
}

export type Partner = {
  title: string
  image?: ImageSource
  onPress?(): void
}

export type DetailsScreenAuthor = AuthorBannerProps

export type DetailsScreenData = {
  date?: Date | string
  description?: string
  author?: DetailsScreenAuthor
  chips?: DetailsScreenChips[]
  seoDescription?: string
  loading?: boolean
  visibility?: 'private' | 'public'
  title: string
  infoList?: DetailsScreenInfoList[]
  coverImage?: LegacyImageSource
  partners?: {
    title: string
    details: Partner[]
  }
  _footer?: ReactNode | ReactNode[] // DO NOT USE, is used temporary while we develop a proper solution to manage carousels at the bottom not for main use
}

type DetailsScreenProps = DetailsScreenData

const isHtml = (str: string) => /<\/?[a-z][\s\S]*>/i.test(str)

const DescriptionRenderer = ({ description }: { description?: string }) => {
  if (!description) return null

  if (React.isValidElement(description)) {
    return description
  }

  if (typeof description === 'string') {
    return isHtml(description) ? (
      <HtmlRenderer content={description} />
    ) : (
      <HoliRichTextOutput text={description as string} />
    )
  }

  return null
}

export const DetailsScreen = ({
  description,
  coverImage,
  chips = [],
  visibility,
  title,
  date,
  infoList,
  loading,
  author,
  seoDescription,
  partners,
  _footer = null,
}: DetailsScreenProps) => {
  const { t } = useTranslation()
  const hasData = title && description

  if (loading && !hasData) {
    return <DetailsScreenSkeleton />
  }

  const _seoDescription = seoDescription || (typeof description === 'string' ? description : '')
  return (
    <>
      <HoliHead
        title={title}
        description={_seoDescription}
        ogTitle={title}
        ogDescription={_seoDescription}
        ogImage={coverImage?.uri}
      />
      <Stack direction="column" flex={1} padding={{ bottom: '4xl' }}>
        <Stack>
          <CoverImage coverImage={coverImage} />
          {date && (
            <View style={{ position: 'absolute', bottom: Spacing['sm'], left: Spacing['xs'] }}>
              <HoliCalendarIcon
                day={new Date(date as Date)?.getDate()}
                month={new Date(date as Date)?.getMonth() + 1}
                size="medium"
              />
            </View>
          )}
        </Stack>

        <Stack
          margin={{ bottom: '4xl' }}
          padding={{ left: 'xs', right: 'xs', bottom: 'sm' }}
          borderRadius={{
            bottomLeft: 'md',
            bottomRight: 'md',
          }}
          backgroundColor="container"
        >
          <Stack direction="row" shouldRender={!!visibility} gap="xxs" alignItems="center" padding={{ top: 'sm' }}>
            <HoliIcon size={14} icon={visibility == 'public' ? Global : Lock} />
            <Text headingLevel="1" size="xs">
              {t(`privacy.visibility.${visibility}`)}
            </Text>
          </Stack>

          <Stack padding={{ top: 'md' }} gap="sm">
            <Stack wrap="wrap" flex={1} direction="row" gap="4xs" shouldRender={chips && chips?.length > 0}>
              {chips?.map((chip, index) => {
                return (
                  <ChipLabel size="sm" key={`${chip.title}-${index}-${chip.color}`} color={chip.color}>
                    {chip.title}
                  </ChipLabel>
                )
              })}
            </Stack>

            <Stack gap="xs" direction="row">
              <Text size="3xl" testID="detailview-title">
                {title}
              </Text>
            </Stack>

            <Stack direction="column" gap="xxs" shouldRender={!!infoList}>
              {infoList?.map((detail, index) => {
                const TextComp = detail.onPress ? TextLinkTracked : Text
                return (
                  <Stack
                    alignItems="flex-start"
                    direction="row"
                    gap="3xs"
                    padding={{ right: 'sm' }}
                    onPress={detail?.onPress}
                    key={`${detail?.title}-${index}`}
                  >
                    <HoliIcon size={Spacing.md} icon={detail?.icon} />
                    <Stack flex={1}>
                      <TextComp size="md" trackingEvent={TrackingEvent.EventDetails.videoCall}>
                        {detail?.title}
                      </TextComp>
                      {detail?.subtitle && (
                        <Text color="support" size="sm">
                          {detail?.subtitle}
                        </Text>
                      )}
                    </Stack>
                    {detail.showExternalIcon ? <HoliIcon icon={ExternalLink} size={Spacing.sm} /> : null}
                  </Stack>
                )
              })}
            </Stack>
            <DescriptionRenderer description={description} />
            {author && <AuthorBanner {...author} />}
            {partners && (
              <Stack direction="column" gap="xxs">
                <Text size="sm" color="support">
                  {partners?.title}
                </Text>
                {partners.details?.map((partner, index) => {
                  return (
                    <Stack key={`partner-block-${partner.title}-${index}`} direction="row" gap="xs">
                      <Avatar shape="circle" size="xs" source={partner?.image} initials={partner.title} />
                      <Stack direction="row" flex={1} justifyContent="space-between" alignItems="center">
                        <TextLink onPress={partner?.onPress} size="md">
                          {partner.title}
                        </TextLink>
                        {partner?.onPress ? <HoliIcon size={20} icon={ExternalLink} /> : null}
                      </Stack>
                    </Stack>
                  )
                })}
              </Stack>
            )}
          </Stack>
        </Stack>
        {_footer}
      </Stack>
    </>
  )
}
