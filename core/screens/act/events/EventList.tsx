import React, {} from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import InfoModal from '@holi/core/components/InfoModal'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'

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
import { BorderRadius, Spacing } from 'holi-bricks/tokens'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import EventRecommendation from '@holi/core/screens/act/events/EventRecommendation'
import { tempData, testSpace, testTask } from '@holi/core/screens/act/events/tempData'

export const ENGAGEMENT_PAGE_SIZE = 10
type EventListProps = { isFiltering?: boolean; loadingFailed?: boolean; clearFilters?: () => void }

export const EventList = ({ isFiltering = false }: EventListProps) => {
  const events = tempData.events.data
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const { onScroll: onScreenScroll } = useThrottledMobileScrollEvents()

  const allPartners = VOLUNTEERING_IMG_SOURCES_MAPPING
  const { hide: closeModal, visible: partnerModalVisible } = useModalState()
  // const { show: showPartnerModal, hide: closeModal, visible: partnerModalVisible } = useModalState()

  const { navigate } = useRouting()
  const title = t('act.events.title')
  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <Text headingLevel="2" size="lg">
          {title}
        </Text>
      ),
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
    })
  }, [navigate, t, title, isFiltering, setScreenOptions, styles.dot])

  return (
    <ScrollViewRefreshable
      style={styles.defaultLayout}
      testID="volunteering-list-container"
      keyboardShouldPersistTaps="handled"
      onScroll={onScreenScroll}
    >
      <HoliContainer>
        <View style={styles.list}>
          {tempData.events.totalResults > 0 && (
            <View style={styles.info}>
              <Text headingLevel="2" size="3xl">
                {t('act.events.title')}
              </Text>
              <View style={styles.partnerInfoRow}>
                <View style={styles.imageContainer}>
                  <HoliLocalImage
                    imageSource={require('@holi/ui/assets/img/events/logo-gemeinschaftswerk-nachhaltigkeit.png')}
                    isSvg={false}
                    width={33}
                    height={33}
                    label="some alt text"
                  />
                </View>
                <View style={{ flex: 3 }}>
                  <Text size="lg">{t('act.events.partnerInfoRowText')}</Text>
                </View>
              </View>

              <InfoModal // todo
                headline={t('volunteering:listing.partnerModal.headline')}
                items={allPartners}
                shown={partnerModalVisible}
                onDismiss={closeModal}
                i18nPrefix={'volunteering:listing.partnerModal'}
              />
              <Text size="lg" color="support">
                {tempData.events.totalResults} {t('act.events.opportunities')}
              </Text>
            </View>
          )}
          <HoliBox padding={[24, 0, 24, 0]}>
            <View testID={isFiltering ? 'volunteering-list-filtered' : 'volunteering-list-unfiltered'}>
              <HoliGridWrapper>
                {events?.map((event) => {
                  return (
                    <HoliGridCell key={event.id}>
                      <HoliLink
                        href={`/events/${event.id}`} // todo: link to detail page
                        label={event.title}
                      >
                        <EventRecommendation task={testTask} space={testSpace} />
                      </HoliLink>
                    </HoliGridCell>
                  )
                })}
              </HoliGridWrapper>
            </View>
          </HoliBox>
        </View>
      </HoliContainer>
    </ScrollViewRefreshable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  list: {
    paddingTop: Spacing.md,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 16,
  },
  defaultLayout: {
    backgroundColor: theme.colors.bg.page,
    paddingBottom: 0,
  },
  dot: {
    backgroundColor: theme.colors.bg.page,
    height: 12,
    width: 12,
    borderRadius: 6,
    position: 'absolute',
    top: -2,
    right: -2,
    borderColor: theme.colors.border.default,
    borderWidth: 2,
  },
  info: {
    gap: Spacing.xs,
  },
  partnerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing['3xs'],
  },
  imageContainer: {
    borderRadius: BorderRadius.pill,
    borderColor: theme.colors.border.default,
    overflow: 'hidden',
  },
}))
