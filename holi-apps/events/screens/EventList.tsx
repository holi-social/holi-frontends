import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import InfoModal, { type InfoModalItemProps } from '@holi/core/components/InfoModal'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'

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
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import EventsFilterForm from '@holi-apps/events/components/EventsFilterForm'
import EventCard from '@holi-apps/events/components/EventCard'
import { Stack } from 'holi-bricks/components/stack'
import { useAllEventsQuery } from '@holi/api/graphql/graphql-codegen'
import { useEventFilters } from '@holi-apps/events/hooks/useEventFilters'
import { Button } from 'holi-bricks/components/button'
import { isSSR } from '@holi/core/helpers/isSSR'
import type { HoliEvent } from '@holi-apps/events/types'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliSwitch from '@holi/ui/components/molecules/HoliSwitch'

export const ENGAGEMENT_PAGE_SIZE = 10

export const EVENTS_SOURCE_MAPPING: {
  [name: string]: InfoModalItemProps
} = {
  'Gemeinschaftswerk Nachhaltigkeit': {
    logo: {
      src: require('@holi/ui/assets/img/events/gemeinschaftswerk-nachhaltigkeit-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/events/gemeinschaftswerk-nachhaltigkeit-wordmark.png'),
      width: 119,
      height: 34,
      isSvg: false,
    },
    url: 'https://gemeinschaftswerk-nachhaltigkeit.de',
  },
}

export const EventList = () => {
  const { data: pagedData, fetchMore } = useAllEventsQuery({
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    variables: {
      limit: 10,
      offset: 0,
    },
  })

  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showRemote, setShowRemote] = useState(true)
  // const canLoadMore =
  //   !loading &&
  //   pagedData?.appEvents_events.data?.length &&
  //   pagedData?.appEvents_events?.data?.length < (pagedData?.appEvents_events?.totalResults || 0)

  const fetchMoreEvents = useCallback(async () => {
    if (isLoadingMore) return
    setIsLoadingMore(true)

    try {
      await fetchMore({
        variables: {
          limit: 10,
          offset: pagedData?.appEvents_events.data?.length
            ? Math.ceil(pagedData?.appEvents_events.data?.length / 10)
            : 0,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.appEvents_events.data) return prev

          const existingIds = new Set(prev.appEvents_events.data?.map((event: HoliEvent) => event.id))
          const newEvents = fetchMoreResult.appEvents_events.data.filter((newItem: HoliEvent) => {
            return !existingIds.has(newItem.id)
          })

          const temp = {
            appEvents_events: {
              ...prev.appEvents_events,
              data: [...(prev.appEvents_events.data || []), ...newEvents],
            },
          }
          return temp
        },
      })
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, fetchMore, pagedData?.appEvents_events.data?.length])

  const events = pagedData?.appEvents_events.data

  const hideRemoteEvents = () => {
    if (!events) return
    const noRemoteEvents = events.filter((e: HoliEvent) => {
      return !e.isRemote
    })
    return noRemoteEvents
  }

  const filteredEvents = showRemote ? events : hideRemoteEvents()

  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const { navigate } = useRouting()
  const { onScroll: onScreenScroll } = useThrottledMobileScrollEvents()
  const setScreenOptions = useSetScreenOptions()

  const title = t('act.events.title')
  const partner = EVENTS_SOURCE_MAPPING

  // info modal
  const { show: showPartnerModal, hide: closePartnerModal, visible: partnerModalVisible } = useModalState()
  // filter modal
  const [filterModalShown, setFilterModalShown] = useState(false)
  const closeFilterModal = useCallback(() => {
    setFilterModalShown(false)
  }, [])

  const { submit } = useEventFilters(closeFilterModal) // todo

  useIsomorphicLayoutEffect(() => {
    // const filterButton = (
    //   <HoliButtonBell
    //     label={t('volunteering:filter.heading')}
    //     icon={Filter3}
    //     // showBell={isFiltering}
    //     onPress={() => {
    //       // if pressed too soon, the state is set to true, but the modal is not shown.
    //       // crude mechanism to recover from this state.
    //       // FIXME: We need a proper solution, e.g. involve a loading state in button disabled
    //       if (filterModalShown) setFilterModalShown(false)
    //       setFilterModalShown(true)
    //     }}
    //     testID="btn-to-volunteering-filter-modal"
    //   />
    // )
    const filterButton = (
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap="xs">
        <Text size="md">{t('core.act.events.filter.remote')}</Text>
        <HoliSwitch
          value={showRemote}
          size="small"
          onChange={() => {
            setShowRemote((prev) => !prev)
          }}
        />
      </Stack>
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
  }, [navigate, t, title, setScreenOptions, filterModalShown, showRemote])

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
          onSubmit={submit}
        />
        {/* <EventsFilterForm onSubmit={submit} filters={filters} clearFilters={clearFilters} /> */}
      </HoliModal>
      <HoliContainer>
        <Stack padding={{ top: 'md' }}>
          {filteredEvents && filteredEvents.length > 0 && (
            <Stack gap="xs">
              <Text headingLevel="2" size="3xl">
                {t('act.events.title')}
              </Text>
              <Stack direction="row" alignItems="center" gap="3xs">
                <Stack borderRadius="pill">
                  <View style={styles.imageContainer}>
                    <HoliLocalImage
                      imageSource={require('@holi/ui/assets/img/events/gemeinschaftswerk-nachhaltigkeit-logo.svg')}
                      isSvg={true}
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

              <InfoModal
                headline={t('volunteering:listing.partnerModal.headline')}
                items={partner}
                shown={partnerModalVisible}
                onDismiss={closePartnerModal}
                i18nPrefix={'act.events.listing.partnerModal'}
              />
              <Text size="lg" color="support">
                {filteredEvents.length} {t('act.events.opportunities')}
              </Text>
            </Stack>
          )}
          <HoliBox padding={[24, 0, 24, 0]}>
            {/* <View testID={isFiltering ? 'volunteering-list-filtered' : 'volunteering-list-unfiltered'}> */}
            <HoliGridWrapper>
              {Array.isArray(filteredEvents) &&
                filteredEvents.map((event) => {
                  return (
                    <HoliGridCell key={event.id}>
                      <EventCard event={event} />
                    </HoliGridCell>
                  )
                })}
            </HoliGridWrapper>
            {/* </View> */}
          </HoliBox>
          {/* {canLoadMore && ( */}
          <Stack padding={{ bottom: 'md' }}>
            <Button
              label={t('global.seeMore')}
              loadingLabel={t('global.loading')}
              inline
              onPress={fetchMoreEvents}
              testID="btn-fetch-more"
            />
          </Stack>
          {/* )} */}
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
