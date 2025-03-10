import React, { type ReactNode } from 'react'
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
import { DetailsScreenSkeleton } from '@holi-apps/events/components/DetailsScreen/skeleton'
import { Global, Lock } from '@holi/icons/src/generated'
import { AuthorBanner, type AuthorBannerProps } from 'holi-bricks/patterns/author-banner'

export type DetailsScreenInfoList = {
  title: string
  icon: HoliIconType
  subtitle?: string
  onPress?(): void
}

export type DetailsScreenChips = {
  title: string
  color: ChipColor
}

export type DetailsScreenAuthor = AuthorBannerProps

export type DetailsScreenData = {
  date?: Date
  description?: string | ReactNode
  author?: DetailsScreenAuthor
  chips?: DetailsScreenChips[]
  seoDescription?: string
  loading?: boolean
  visibility?: 'private' | 'public'
  title: string
  infoList?: DetailsScreenInfoList[]
  coverImage?: LegacyImageSource
  _footer?: ReactNode | ReactNode[] // DO NOT USE, is used temporary while we develop a proper solution to manage carousels at the bottom not for main use
}

type DetailsScreenProps = DetailsScreenData

export const DetailsScreen = ({
  description,
  coverImage,
  chips,
  visibility,
  title,
  date,
  infoList,
  loading,
  author,
  seoDescription,
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
        <CoverImage coverImage={coverImage} />
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
              {date && (
                <HoliCalendarIcon
                  day={new Date(date as Date)?.getDate()}
                  month={new Date(date as Date)?.getMonth() + 1}
                  size="medium"
                />
              )}
              <Text size="3xl">{title}</Text>
            </Stack>

            <Stack direction="column" gap="xxs" shouldRender={!!infoList}>
              {infoList?.map((detail, index) => {
                const TextComp = detail.onPress ? TextLink : Text
                return (
                  <Stack
                    alignItems={detail?.subtitle ? 'flex-start' : 'center'}
                    justifyContent="flex-start"
                    direction="row"
                    gap="3xs"
                    onPress={detail?.onPress}
                    key={`${detail?.title}-${index}`}
                  >
                    <HoliIcon size={24} icon={detail?.icon} />
                    <Stack>
                      <TextComp size="md">{detail?.title}</TextComp>
                      {detail?.subtitle && (
                        <Text color="support" size="sm">
                          {detail?.subtitle}
                        </Text>
                      )}
                    </Stack>
                  </Stack>
                )
              })}
            </Stack>
            {description && React.isValidElement(description) ? <Text size="md">{description}</Text> : null}
            {description && typeof description === 'string' && <HoliRichTextOutput text={description as string} />}
            {author && <AuthorBanner {...author} />}
          </Stack>
        </Stack>
        {_footer}
      </Stack>
    </>
  )
}
