import { withProfiler } from '@sentry/react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type DimensionValue, Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native'

import { logError } from '@holi/core/errors/helpers/logError'
import { isSSR } from '@holi/core/helpers/isSSR'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Pagination } from '@holi/core/pagination/Pagination'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import InsightList, { INSIGHT_PAGE_SIZE } from '@holi/core/screens/insights/InsightList'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import type { Insight } from '@holi/core/screens/insights/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import type { User } from '@holi/core/domain/shared/types'
import { breakpoints } from 'holi-bricks/foundations'

const InsightsList = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { show: showEditorsModal, hide: hideEditorsModal, props: editorsModalProps } = useModalState()

  const { loading, data: insights, totalResults } = usePaginationContext<Insight>()

  const insightsCreators = insights.map((insight) => insight.creator).filter((creator) => !!creator) as User[]

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: ({ tintColor }) => <HeaderTitle tintColor={tintColor}>{'Insights'}</HeaderTitle>,
    })
  }, [navigate, setScreenOptions, t])

  const { width: screenWidth } = useWindowDimensions()
  const [isWideLayout, setWideLayout] = useState<boolean>(false)

  useIsomorphicLayoutEffect(() => {
    if (screenWidth >= breakpoints.sm) {
      setWideLayout(true)
    }
  }, [isWideLayout, screenWidth])

  if (!loading && !totalResults) return <></>

  if (loading) return <HoliLoader style={styles.loader} />

  const CurationPrinciplesCardSmall = () => (
    <Pressable onPress={() => navigate('/insights/curationPrinciples')} style={styles.curationPrinciplesCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['3xs'] }}>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_news.svg')}
          label={t('insights.curationPrinciples.title')}
          height={36}
          width={62}
          isSvg
        />
        <HoliText bold>{t('insights.curationPrinciples.title')}</HoliText>
      </View>
      <HoliIcon icon={ArrowRightS} />
    </Pressable>
  )

  const CurationPrinciplesCardLarge = () => {
    const baseStyles = [styles.curationPrinciplesCard, { padding: Spacing.xs }]

    return (
      <Pressable
        onPress={() => navigate('/insights/curationPrinciples')}
        style={({ hovered }) => (hovered ? [...baseStyles, styles.curationPrinciplesCardHovered] : baseStyles)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, flexShrink: 1 }}>
          <View
            style={{
              height: 120,
              paddingVertical: Spacing.lg,
              paddingHorizontal: Spacing.md,
              backgroundColor: theme.colors.background20,
              justifyContent: 'center',
              borderRadius: 8,
            }}
          >
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/illustration_news_sparkle.svg')}
              label={t('insights.curationPrinciples.title')}
              height={80}
              width={110}
              resizeMode="contain"
              isSvg
            />
          </View>

          <View style={{ flex: 1, height: 120, justifyContent: 'space-between' }}>
            <HoliHeading level="2">{t('insights.curationPrinciples.title')}</HoliHeading>
            <HoliText numberOfLines={2} color="gray300">
              {t('insights.curationPrinciples.intro.description')}
            </HoliText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <HoliText bold>{t('insights.curationPrinciples.learnMore')}</HoliText>
              <HoliIcon icon={ArrowRightS} />
            </View>
          </View>
        </View>
      </Pressable>
    )
  }

  const Headline = () => {
    return (
      <>
        <HoliHeading size="l" testID="insights-page">
          {t('insight.page.title')}
        </HoliHeading>
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

      {isWideLayout ? <CurationPrinciplesCardLarge /> : <CurationPrinciplesCardSmall />}

      <InsightList loading={!!loading} insights={insights as Insight[]} />
    </>
  )
}

const InsightsPage = () => {
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: INSIGHT_PAGE_SIZE,
    queryPath: 'lastInsights',
    onError: (error) => {
      logError(error, 'Failed to query insights', { location: 'InsightsPage' })
    },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
  }

  return (
    <ScrollViewRefreshable style={styles.layout}>
      <View style={styles.sections}>
        <HoliContainer>
          <Pagination
            query={lastInsightsQuery}
            queryOptions={queryOptions}
            scrollPlaceholder={<HoliLoader style={styles.loaderBottom} />}
            fetchMoreButtonProps={{
              variant: 'secondary',
              style: mixins.moreButton,
            }}
          >
            <InsightsList />
          </Pagination>
        </HoliContainer>
      </View>
    </ScrollViewRefreshable>
  )
}

export default withProfiler(InsightsPage, { name: 'InsightsPage' })

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
      backgroundColor: theme.colors.background20,
      ...(Platform.OS === 'web' && {
        minHeight: '100vh' as DimensionValue,
      }),
    },
    sections: {
      gap: 32,
      marginTop: 24,
      marginBottom: 64,
    },
    loader: {
      ...(Platform.OS === 'web' && {
        minHeight: '80vh' as DimensionValue,
      }),
    },
    loaderBottom: {
      marginBottom: 24,
      position: 'relative',
    },

    curationPrinciplesCard: {
      flexDirection: 'row',
      width: '100%',
      padding: Spacing['3xs'],
      backgroundColor: theme.colors.background10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.gray200,
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: Spacing.md,
    },

    curationPrinciplesCardHovered: {
      borderColor: theme.colors.black300,
      shadowColor: theme.colors.black300,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.12,
    },
  })
