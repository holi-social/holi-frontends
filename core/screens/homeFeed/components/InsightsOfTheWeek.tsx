import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { Text } from 'holi-bricks/components/text'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { User } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers/logError'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import InsightList from '@holi/core/screens/insights/InsightList'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { Insight } from '@holi/core/screens/insights/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const InsightsOfTheWeek = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { show: showEditorsModal, hide: hideEditorsModal, props: editorsModalProps } = useModalState({ visible: false })

  const mixins = useStyleMixins()

  const {
    data: lastInsights,
    loading,
    error,
    refetch,
  } = useQuery(lastInsightsQuery, {
    variables: { offset: 0, limit: 4 },
  })
  useOnRefresh(refetch)

  const insights = (lastInsights?.lastInsights?.data || []).slice(0, 4)
  const totalResults = lastInsights?.lastInsights?.totalResults || 0

  const insightsCreators = insights.map((insight: Insight) => insight.creator).filter((creator: User) => !!creator)

  if (error) {
    logError(error, 'Failed to load insights', { location: 'InsightsOfTheWeekList' })
    return <></>
  }

  if (!loading && !totalResults) return <></>

  const goToInsights = () => {
    navigate('/insights')
  }

  return (
    <HoliContainer>
      {/* Headline */}
      <Text size="3xl" headingLevel="2">
        {t('homeFeed.insights.heading')}
      </Text>
      <HoliGap size="xs" />

      {/* Curators with popup */}
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
            <HoliText size="default" testID="avatars-top-title" style={styles.editorsButtonText}>
              {t('insights.editors.editedBy')}
            </HoliText>
          </View>
        </HoliButton>
      </HoliBox>

      <HoliModal
        label={t('insights.editors.modal.title')}
        {...editorsModalProps}
        style={styles.modal}
        testID="insight-editors-modal"
      >
        <HoliUserCardsModalContent
          title={t('insights.editors.modal.title')}
          users={insightsCreators}
          onDismiss={hideEditorsModal}
          testID="insight-editors"
        />
      </HoliModal>

      <InsightList style={styles.insightList} loading={!!loading} insights={insights} />

      <HoliButtonLoading
        type="secondary"
        label={t('insights.discoverMore')}
        onPress={() => goToInsights()}
        testID="btn-navigate-to-insights"
        style={mixins.moreButton}
      />
    </HoliContainer>
  )
}

export default withProfiler(InsightsOfTheWeek, { name: 'InsightsOfTheWeek' })

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
    insightList: {
      marginTop: 24,
    },
    handwaveFilled: {
      paddingLeft: 8,
    },
    modal: { backgroundColor: theme.colors.white200 },
  })
