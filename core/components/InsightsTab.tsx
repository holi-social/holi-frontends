import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { insightsByUserIdQuery } from '@holi/core/queries'
import type { InsightsByUserIdResponse } from '@holi/core/queries'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'

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
        <Stack
          padding={{ left: 'md', right: 'md', top: 'xl', bottom: 'xl' }}
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          gap="xs"
        >
          <Text headingLevel="3" size="md" bold>
            {insight.title}
          </Text>
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
        </Stack>
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
