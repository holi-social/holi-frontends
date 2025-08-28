import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { logError } from '@holi/core/errors/helpers'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { insightsByUserIdQuery } from '@holi/core/queries'
import type { InsightsByUserIdResponse } from '@holi/core/queries'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface InsightsTabProps {
  userId: string
}

const THUMBNAIL_SIZE = 64

const InsightsTab = ({ userId }: InsightsTabProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { data, refetch } = useQuery<InsightsByUserIdResponse>(insightsByUserIdQuery, {
    variables: { userId },
    onError: (error) =>
      logError(error, 'Failed to load insights for user', { location: 'InsightsTab.insightsByUserIdQuery' }),
  })
  const insights = data?.insightsByUserId
  const hasInsights = !!insights?.totalResults
  useOnRefresh(refetch)

  if (!hasInsights) return null

  return insights.data.map((insight) => (
    <View key={insight.id} style={styles.itemContainer}>
      <HoliLink label="" href={`/insights/${insight.id}`}>
        <HoliColumns padding={[Spacing.xl, Spacing.md]} alignItems="flex-start">
          <HoliColumn padding={[0, Spacing.xs, 0, 0]} flex={2}>
            <HoliHeading level="3" size="s">
              {insight.title}
            </HoliHeading>
          </HoliColumn>
          {!!insight.headerImage && (
            <View style={styles.imageColumn}>
              <HoliImage
                label=""
                source={{
                  uri: insight.headerImage,
                  width: THUMBNAIL_SIZE,
                  height: THUMBNAIL_SIZE,
                }}
                blurhash={insight.headerImageBlurhash}
                resizeMode="cover"
              />
            </View>
          )}
        </HoliColumns>
      </HoliLink>
    </View>
  ))
}

export default withProfiler(InsightsTab, { name: 'InsightsTab' })

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    itemContainer: {
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderBottomColor: theme.colors.background30,
    },
    imageColumn: {
      paddingBottom: 40,
      flexBasis: THUMBNAIL_SIZE,
      width: THUMBNAIL_SIZE,
      height: THUMBNAIL_SIZE,
      borderRadius: 8,
      backgroundColor: theme.colors.background20,
    },
  })
