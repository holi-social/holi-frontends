import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import InfoModal from '@holi/core/components/InfoModal'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { Image } from 'holi-bricks/components/image'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'

import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'
import { Text } from 'holi-bricks/components/text'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import EventsFilterForm, { type EventFilters } from '@holi-apps/events/components/EventsFilterForm'
import EventCard from '@holi-apps/events/components/EventCard'
import { Stack } from 'holi-bricks/components/stack'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'
import { Filter3 } from '@holi/icons/src/generated'
import { Screen } from '@holi/core/components/Screen'
import { TrackingEvent } from '@holi/core/tracking'
import { useEventListData } from '@holi-apps/events/helpers/useEventListData'
import { EVENTS_SOURCE_MAPPING } from '@holi-apps/events/helpers/eventsSourceMapping'

export const ENGAGEMENT_PAGE_SIZE = 10
const PAGE_SIZE_EXTERNAL_DATA = 10

export const EventList = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  const [fetchLocalOnlyEvents, setFetchLocalOnlyEvents] = useState(false)
  const { events, canLoadMore, fetchMoreEvents } = useEventListData(PAGE_SIZE_EXTERNAL_DATA, fetchLocalOnlyEvents)

  const partner = EVENTS_SOURCE_MAPPING

  // info modal
  const { show: showPartnerModal, hide: closePartnerModal, visible: partnerModalVisible } = useModalState()
  // filter modal
  const { show: showFilterModal, hide: closeFilterModal, visible: filterModalVisible } = useModalState()

  const handleFilterChange = useCallback(
    async (filters: EventFilters) => {
      setFetchLocalOnlyEvents(filters.localOnly)
      closeFilterModal()
    },
    [closeFilterModal]
  )

  const filterButton = (
    <HoliButtonBell
      label={t('volunteering:filter.heading')}
      icon={Filter3}
      onPress={showFilterModal}
      testID="btn-to-volunteering-filter-modal"
      trackingEvent={TrackingEvent.Events.filter}
    />
  )

  return (
    <Screen
      preset="scroll"
      headerOptions={{
        headerTitle: () => (
          <Text headingLevel="2" size="lg">
            {t('act.events.title')}
          </Text>
        ),
        headerLeft: () => <HeaderBackButton />,
        headerRight: () =>
          Platform.OS === 'web' ? <HoliHorizontalRow>{filterButton}</HoliHorizontalRow> : filterButton,
        headerBackVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      <HoliContainer>
        <Stack padding={{ top: 'md' }}>
          {events && events.length > 0 && (
            <Stack gap="xs">
              <Text headingLevel="2" size="3xl">
                {t('act.events.title')}
              </Text>
              <Stack direction="row" alignItems="center" gap="3xs">
                <Stack borderRadius="pill">
                  <View style={styles.imageContainer}>
                    <Image
                      source={require('@holi/ui/assets/img/events/gemeinschaftswerk-nachhaltigkeit-logo.png')}
                      width={33}
                      height={33}
                      alt="Logo Gemeinschaftswerk Nachhaltigkeit"
                    />
                  </View>
                </Stack>
                <HoliButton transparent onPress={showPartnerModal} label={t('act.events.partnerInfoRowText')}>
                  <View style={{ flex: 3 }}>
                    <Text size="lg">{t('act.events.partnerInfoRowText')}</Text>
                  </View>
                </HoliButton>
              </Stack>

              <Text size="lg" color="support">
                {events.length} {t('act.events.opportunities')}
              </Text>

              {/* info modal */}
              <InfoModal
                headline={t('volunteering:listing.partnerModal.headline')}
                items={partner}
                shown={partnerModalVisible}
                onDismiss={closePartnerModal}
                i18nPrefix={'act.events.listing.partnerModal'}
              />

              {/* filter modal */}
              <HoliModal label={'Filter Events'} shown={filterModalVisible} onDismiss={closeFilterModal} autoHeight>
                <EventsFilterForm
                  filters={{
                    localOnly: fetchLocalOnlyEvents,
                  }}
                  onSubmit={handleFilterChange}
                />
              </HoliModal>
            </Stack>
          )}
          <HoliBox padding={[24, 0, 24, 0]}>
            {/* <View testID={isFiltering ? 'volunteering-list-filtered' : 'volunteering-list-unfiltered'}> */}
            <HoliGridWrapper>
              {Array.isArray(events) &&
                events.map((event) => {
                  return (
                    <HoliGridCell key={event.id}>
                      <EventCard event={event} />
                    </HoliGridCell>
                  )
                })}
            </HoliGridWrapper>
            {/* </View> */}
          </HoliBox>
          {canLoadMore && (
            <Stack padding={{ bottom: 'md' }}>
              <ButtonTracked
                label={t('global.seeMore')}
                loadingLabel={t('global.loading')}
                inline
                onPress={fetchMoreEvents}
                testID="btn-fetch-more"
                trackingEvent={TrackingEvent.Events.loadMore}
              />
            </Stack>
          )}
        </Stack>
      </HoliContainer>
    </Screen>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  defaultLayout: {
    backgroundColor: theme.colors.bg.page,
    paddingBottom: 0,
  },
  imageContainer: {
    borderColor: theme.colors.border.default,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    justifySelf: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
  },
}))
