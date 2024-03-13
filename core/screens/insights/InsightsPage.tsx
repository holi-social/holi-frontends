import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers/logError'
import { isSSR } from '@holi/core/helpers/isSSR'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Pagination } from '@holi/core/pagination/Pagination'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import InsightList, { INSIGHT_PAGE_SIZE } from '@holi/core/screens/insights/InsightList'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { Insight } from '@holi/core/screens/insights/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const InsightsList = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  const { show: showEditorsModal, hide: hideEditorsModal, props: editorsModalProps } = useModalState({ visible: false })

  const { loading, data: insights, totalResults } = usePaginationContext<Insight>()

  const insightsCreators = insights.map((insight) => insight.creator).filter((creator) => !!creator)

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerTitle: ({ tintColor }) => <HeaderTitle tintColor={tintColor}>{'Insights'}</HeaderTitle>,
    })
  }, [navigate, setScreenOptions, t])

  if (!loading && !totalResults) return <></>

  if (loading) return <HoliLoader style={styles.loader} />

  const Headline = () => {
    return (
      <>
        <HoliHeading size="l">{t('insight.page.title')}</HoliHeading>
        <HoliGap size="xs" />
        <HoliText>{t('insight.page.description')}</HoliText>
      </>
    )
  }

  const CuratorsPopup = () => {
    return (
      <>
        <HoliBox padding={[8, 0]}>
          <HoliButton
            label={t('insights.editors.modal.title')}
            transparent
            onPress={showEditorsModal}
            testID="avatar-pile-open-modal-button"
            inline
          >
            <View style={styles.editorsButtonContent}>
              <HoliUserAvatarPile users={insightsCreators} collapse loading={!!loading} />
              <HoliText size="default" bold testID="avatars-top-title" style={styles.editorsButtonText}>
                {t('insight.page.curatedBy')}
              </HoliText>
            </View>
          </HoliButton>
        </HoliBox>
      </>
    )
  }

  return (
    <>
      <Headline />
      <CuratorsPopup />
      <HoliModal label={t('insights.editors.modal.title')} {...editorsModalProps} testID="insight-editors-modal">
        <HoliUserCardsModalContent
          title={t('insights.editors.modal.title')}
          users={insightsCreators}
          onDismiss={hideEditorsModal}
          testID="insight-editors"
        />
      </HoliModal>

      <InsightList style={styles.insightList} loading={!!loading} insights={insights} />
    </>
  )
}

const InsightsPage = () => {
  const mixins = useStyleMixins()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: INSIGHT_PAGE_SIZE,
    queryPath: 'lastInsights',
    onError: (error) => {
      logError(error, 'Failed to query insights', { location: 'InsightsOfTheWeek' })
    },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
  }

  return (
    <ScrollHeaderLayout.Default style={styles.layout}>
      <View style={styles.sections}>
        <View style={mixins.container}>
          <Pagination
            query={lastInsightsQuery}
            queryOptions={queryOptions}
            loadMoreOnScroll
            scrollPlaceholder={<HoliLoader style={styles.loaderBottom} />}
          >
            <InsightsList />
          </Pagination>
        </View>
      </View>
    </ScrollHeaderLayout.Default>
  )
}

export default withProfiler(InsightsPage, { name: 'InsightsPage' })

const styles = StyleSheet.create({
  insightList: {
    marginTop: 24,
  },
  editorsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editorsButtonText: {
    marginLeft: 10,
    flex: 1,
    flexWrap: 'wrap',
  },
  layout: {
    paddingBottom: 80,
    backgroundColor: colors.background20,
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
    }),
  },
  sections: {
    gap: 32,
    marginTop: 24,
  },
  loader: {
    ...(Platform.OS === 'web' && {
      minHeight: '80vh',
    }),
  },
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
})
