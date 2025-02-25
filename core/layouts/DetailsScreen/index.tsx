import React, { useEffect, useState } from 'react'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import type { ImageSource } from '@holi/ui/components/atoms/HoliImage/types'
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
import { DetailsScreenSkeleton } from '@holi/core/layouts/DetailsScreen/skeleton'
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
  description?: string
  author?: DetailsScreenAuthor
  chips?: DetailsScreenChips[]
  loading?: boolean
  visibility?: 'private' | 'public'
  title: string
  infoList?: DetailsScreenInfoList[]
  coverImage?: ImageSource
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
}: DetailsScreenProps) => {
  // This is here so we track the first load and we don't show skeleton again
  // If user pulls to refetch the screen
  const [firstLoad, setFirstLoad] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    setFirstLoad(false)
  }, [])

  if (loading && firstLoad) {
    return <DetailsScreenSkeleton />
  }

  return (
    <>
      <HoliHead
        title={title}
        description={description}
        ogTitle={title}
        ogDescription={description}
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

            {description && <HoliRichTextOutput text={description as string} />}
            {author && <AuthorBanner {...author} />}
          </Stack>
        </Stack>
      </Stack>
    </>
  )
}
