import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import EmptyTab from '@holi/core/components/EmptyTab'
import { logError } from '@holi/core/errors/helpers'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { insightsByUserIdQuery } from '@holi/core/queries'
import type { InsightsByUserIdResponse } from '@holi/core/queries'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface InsightsTabProps {
  userId: string
  emptyText: string
}

const THUMBNAIL_SIZE = 64

const InsightsTab = ({ emptyText, userId }: InsightsTabProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { data } = useQuery<InsightsByUserIdResponse>(insightsByUserIdQuery, {
    variables: { userId },
    onError: (error) =>
      logError(error, 'Failed to load insights for user', { location: 'InsightsTab.insightsByUserIdQuery' }),
  })
  const insights = data?.insightsByUserId
  const hasInsights = !!insights?.totalResults

  return (
    <HoliContainer>
      {hasInsights ? (
        <>
          {insights.data.map((insight) => {
            return (
              <View key={insight.id} style={styles.itemContainer}>
                <HoliLink label="" href={`/insights/${insight.id}`}>
                  <HoliColumns padding={[40, 24]} alignItems="flex-start">
                    <HoliColumn padding={[0, 16, 0, 0]} flex={2}>
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
            )
          })}
        </>
      ) : (
        <EmptyTab text={emptyText} />
      )}
    </HoliContainer>
  )
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
