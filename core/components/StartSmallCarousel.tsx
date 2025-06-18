import { Text } from 'holi-bricks/components/text'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Stack } from 'holi-bricks/components/stack'
import { BorderRadius, Spacing } from 'holi-bricks/foundations'
import { MiniCard } from 'holi-bricks/components/miniCard/MiniCard'
import { Footprints, MapPin2Filled } from '@holi/icons/src/generated'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import TrackableFlatList from '@holi/core/tracking/TrackableFlatList'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { TrackingEvent } from '@holi/core/tracking'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { Typesense_DocumentType } from '@holi/api/graphql/graphql-codegen'

// to be replaced by real data ------------------------------------------------------------
const doingGood: LocalizedTypesenseDocument[] = [
  {
    id: '1',
    title: 'Help cleaning at the animal shelter',
    type: Typesense_DocumentType.Volunteering,
    commitment_duration: '30-60 Minuten',
    location: 'Remote',
    description: 'Assist in cleaning and organizing the animal shelter.',
    image_url: 'https://picsum.photos/id/1018/800/600',
  },
  {
    id: '2',
    title: 'Need help with social media designs',
    type: Typesense_DocumentType.Volunteering,
    commitment_duration: '30-60 Minuten',
    location: 'Remote',
    description: 'Need help with social media designs',
    image_url: 'https://picsum.photos/id/1020/800/600',
  },
  {
    id: '3',
    title: 'Join public discussion on democracy',
    type: Typesense_DocumentType.Volunteering,
    commitment_duration: '30-60 Minuten',
    location: 'Remote',
    description: 'Join public discussion on democracy',
    image_url: 'https://picsum.photos/id/1019/800/600',
  },
]
// ----------------------------------------------------------------------------------------

const StartSmallCarousel = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  const listProps = {
    horizontal: true,
    contentContainerStyle: {
      paddingHorizontal: Spacing.xs,
      gap: Spacing['3xs'],
    },
    data: doingGood,
  }

  const listItemTrackingEvent: ListItemTrackingEvent<LocalizedTypesenseDocument> = ({ type, id, title }) => {
    return TrackingEvent.StartSmallCardClicked(type, id, title)
  }

  const listItemIdentifier: ListItemIdentifier<LocalizedTypesenseDocument> = ({ id }) => {
    return id
  }

  const ListComponent = (
    <TrackableFlatList
      renderItem={({ item }) => (
        <MiniCard
          title={item.title}
          chipLabel={item.commitment_duration}
          bottomIconLeft={MapPin2Filled}
          bottomLabel={item.location}
          imageSrc={item.image_url}
        />
      )}
      {...listProps}
      listItemTrackingEvent={listItemTrackingEvent}
      listItemIdentifier={listItemIdentifier}
    />
  )

  return (
    <View style={styles.StartSmallCarousel}>
      <Stack gap="sm" minHeight="auto" flex={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" padding={{ left: 'xs', right: 'xs' }}>
          <Stack direction="row" gap="xs" justifyContent="center" alignItems="center">
            <Stack direction="column">
              <Stack direction="row" gap="3xs">
                <HoliIcon icon={Footprints} size={24} color="informative" />
                <Text size="xxl" headingLevel="3">
                  {t('act.startSmall.title')}
                </Text>
              </Stack>
              <Stack padding={{ left: 'lg' }}>
                <Text size="sm" color="support">
                  {t('act.startSmall.subline')}
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {ListComponent}
      </Stack>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  StartSmallCarousel: {
    backgroundColor: theme.colors.decorative.purpleLight,
    paddingVertical: Spacing['xs'],
    borderRadius: BorderRadius.md,
    gap: Spacing['xs'],
  },
}))

export default StartSmallCarousel
