import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import InfoModal from '@holi/core/components/InfoModal'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'

import { VOLUNTEERING_IMG_SOURCES_MAPPING } from '@holi-apps/volunteering/screens/VolunteeringEngagementDetail'
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'
import { Text } from 'holi-bricks/components/text'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import { useThrottledMobileScrollEvents } from '@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { tempData } from '@holi-apps/events/components/tempData'
import { HoliButtonBell } from '@holi/ui/components/molecules/HoliButtonBell'
import { Filter3 } from '@holi/icons/src/generated'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import EventsFilterForm from '@holi-apps/events/components/EventsFilterForm'
import EventCard from '@holi-apps/events/components/EventCard'
import { Stack } from 'holi-bricks/components/stack'
import { useAllEventsQuery } from '@holi/api/graphql/graphql-codegen'

export const ENGAGEMENT_PAGE_SIZE = 10
// type EventListProps = { loadingFailed?: boolean; clearFilters?: () => void }

export const EventList = () => {
  // const events = tempData.events.data

  const { data } = useAllEventsQuery()
  const events = data?.appEvents_events.data

  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const { navigate } = useRouting()
  const { onScroll: onScreenScroll } = useThrottledMobileScrollEvents()
  const setScreenOptions = useSetScreenOptions()

  const title = t('act.events.title')
  const allPartners = VOLUNTEERING_IMG_SOURCES_MAPPING

  // info modal
  const { show: showPartnerModal, hide: closePartnerModal, visible: partnerModalVisible } = useModalState()
  // filter modal
  const [filterModalShown, setFilterModalShown] = useState(false)
  const closeFilterModal = useCallback(() => {
    setFilterModalShown(false)
  }, [])

  // const { submit, filters, clearFilters, isFiltering } = useEventFilters(closeFilterModal) // todo

  useIsomorphicLayoutEffect(() => {
    const filterButton = (
      <HoliButtonBell
        label={t('volunteering:filter.heading')}
        icon={Filter3}
        // showBell={isFiltering}
        onPress={() => {
          // if pressed too soon, the state is set to true, but the modal is not shown.
          // crude mechanism to recover from this state.
          // FIXME: We need a proper solution, e.g. involve a loading state in button disabled
          if (filterModalShown) setFilterModalShown(false)
          setFilterModalShown(true)
        }}
        testID="btn-to-volunteering-filter-modal"
      />
    )
    setScreenOptions({
      headerTitle: () => (
        <Text headingLevel="2" size="lg">
          {title}
        </Text>
      ),
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
      headerRight: () => (Platform.OS === 'web' ? <HoliHorizontalRow>{filterButton}</HoliHorizontalRow> : filterButton),
    })
  }, [navigate, t, title, setScreenOptions, filterModalShown])

  return (
    <ScrollViewRefreshable
      style={styles.defaultLayout}
      testID="volunteering-list-container"
      keyboardShouldPersistTaps="handled"
      onScroll={onScreenScroll}
    >
      <HoliModal
        shown={filterModalShown}
        onDismiss={closeFilterModal}
        testID="volunteering-filter-modal"
        label={t('volunteering:filter.heading')}
        autoHeight={false}
        relativeHeight={1}
      >
        <EventsFilterForm
          filters={{
            remote: undefined,
            date: undefined,
          }}
          onSubmit={() => {
            throw new Error('Function not implemented.')
          }}
        />
        {/* <EventsFilterForm onSubmit={submit} filters={filters} clearFilters={clearFilters} /> */}
      </HoliModal>
      <HoliContainer>
        <Stack padding={{ top: 'md' }}>
          {tempData.events.totalResults > 0 && (
            <Stack gap="xs">
              <Text headingLevel="2" size="3xl">
                {t('act.events.title')}
              </Text>
              <Stack direction="row" alignItems="center" gap="3xs">
                <Stack borderRadius="pill">
                  <View style={styles.imageContainer}>
                    <HoliLocalImage
                      imageSource={require('@holi/ui/assets/img/events/logo-gemeinschaftswerk-nachhaltigkeit.png')}
                      isSvg={false}
                      width={33}
                      height={33}
                      label="some alt text"
                    />
                  </View>
                </Stack>
                <HoliButton transparent onPress={showPartnerModal} label={t('act.events.partnerInfoRowText')}>
                  <View style={{ flex: 3 }}>
                    <Text size="lg">{t('act.events.partnerInfoRowText')}</Text>
                  </View>
                </HoliButton>
              </Stack>

              <InfoModal // todo
                headline={t('volunteering:listing.partnerModal.headline')}
                items={allPartners}
                shown={partnerModalVisible}
                onDismiss={closePartnerModal}
                i18nPrefix={'volunteering:listing.partnerModal'}
              />
              <Text size="lg" color="support">
                {tempData.events.totalResults} {t('act.events.opportunities')}
              </Text>
            </Stack>
          )}
          <HoliBox padding={[24, 0, 24, 0]}>
            {/* <View testID={isFiltering ? 'volunteering-list-filtered' : 'volunteering-list-unfiltered'}> */}
            <HoliGridWrapper>
              {events?.map((event) => {
                return (
                  <HoliGridCell key={event.id}>
                    <HoliLink
                      href={`/events/${event.id}`} // todo: link to detail page
                      label={event.title}
                    >
                      <EventCard event={event} />
                    </HoliLink>
                  </HoliGridCell>
                )
              })}
            </HoliGridWrapper>
            {/* </View> */}
          </HoliBox>
        </Stack>
      </HoliContainer>
    </ScrollViewRefreshable>
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
  },
}))
