import { Text } from 'holi-bricks/components/text'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Platform } from 'react-native'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { Stack } from 'holi-bricks/components/stack'
import { Spacing } from 'holi-bricks/foundations'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { Typesense_DocumentType } from '@holi/api/graphql/graphql-codegen'
import { MiniCard } from 'holi-bricks/components/miniCard/MiniCard'

type StartSmallCarouselProps = {
  icon: HoliIconType
}

const StartSmallCarousel: React.FC<StartSmallCarouselProps> = ({ icon }) => {
  const { t } = useTranslation()

  const doingGood: LocalizedTypesenseDocument[] = [
    {
      id: '1',
      title: 'Help cleaning at the animal shelter',
      description: 'Join us to clean and organize the animal shelter.',
      type: Typesense_DocumentType.Volunteering,
    },
  ]

  const listProps = {
    horizontal: true,
    contentContainerStyle: {
      paddingLeft: Spacing.xs,
      paddingBottom: Platform.OS === 'web' ? Spacing.xxs : undefined,
      gap: Spacing['3xs'],
    },
    data: doingGood,
  }

  const ListComponent = (
    <FlatList renderItem={({ item }) => <MiniCard title={item.title} imageLabel={item.description} />} {...listProps} />
  )

  return (
    <Stack gap="sm" minHeight="auto" flex={1} testID="start-small-carousel">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding={{ left: 'xs', right: 'xs' }}
        testID="start-small-carousel-heading"
      >
        <Stack direction="row" gap="xs" justifyContent="center" alignItems="center">
          <Stack
            elevation={200}
            borderRadius="lg"
            borderColor="muted"
            borderWidth="sm"
            backgroundColor="support"
            padding="xxs"
            justifyContent="center"
            alignItems="center"
          >
            <HoliIcon icon={icon} size={24} />
          </Stack>
          <Stack direction="column">
            <Text size="xxl" headingLevel="3">
              {t('act.startSmall.title')}
            </Text>
            <Text size="sm" color="support">
              {t('act.startSmall.subline')}
            </Text>
          </Stack>
        </Stack>
      </Stack>

      {ListComponent}
    </Stack>
  )
}

export default StartSmallCarousel
