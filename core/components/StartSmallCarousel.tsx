import { Text, TextLink } from 'holi-bricks/components/text'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Stack } from 'holi-bricks/components/stack'
import { BorderRadius, Spacing } from 'holi-bricks/foundations'
import { MiniCard } from 'holi-bricks/components/miniCard/MiniCard'
import { ArrowRightS, Footprints, MapPin2Filled } from '@holi/icons/src/generated'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import TrackableFlatList from '@holi/core/tracking/TrackableFlatList'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { TrackingEvent } from '@holi/core/tracking'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { useMicroactions } from '@holi-apps/volunteering/hooks/useVolunteeringRecos'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliMoreCard from '@holi/ui/components/atoms/HoliMoreCard'

const StartSmallCarousel = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const { navigate } = useRouting()
  const { engagements } = useMicroactions({ pageSize: 5, displayErrors: true })

  const listProps = {
    horizontal: true,
    contentContainerStyle: {
      paddingHorizontal: Spacing.xs,
      gap: Spacing['3xs'],
    },
    data: engagements,
    ListFooterComponent: (
      <View style={{ flex: 1 }}>
        <HoliMoreCard
          role="link"
          label={t('act.events.showAll')}
          onPress={() => {
            navigate('/volunteering')
          }}
          testID={'start-small-slider-load-more-button'}
        >
          {t('act.events.showAll')}
        </HoliMoreCard>
      </View>
    ),
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
          chipLabel={
            item.commitment_duration
              ? t(`spaces.input.task.section.timing.duration.value.${item.commitment_duration}`)
              : undefined
          }
          bottomIconLeft={item.location ? MapPin2Filled : undefined}
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
    <View style={styles.startSmallCarousel}>
      <Stack gap="sm" minHeight="auto" flex={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" padding={{ left: 'xs', right: 'xs' }}>
          <Stack direction="row" gap="xs" justifyContent="center" alignItems="center" flex={1}>
            <Stack direction="column" flex={1}>
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
            <Stack direction="row">
              <TextLink
                size="sm"
                role="none"
                onPress={() => {
                  navigate('/volunteering')
                }}
              >
                {t('global.seeMore')}
              </TextLink>
              <HoliIcon icon={ArrowRightS} size={20} />
            </Stack>
          </Stack>
        </Stack>

        {ListComponent}
      </Stack>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  startSmallCarousel: {
    backgroundColor: theme.colors.decorative.purpleLight,
    paddingVertical: Spacing['xs'],
    borderRadius: BorderRadius.md,
    gap: Spacing['xs'],
  },
}))

export default StartSmallCarousel
