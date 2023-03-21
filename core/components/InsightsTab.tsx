import { useQuery } from '@apollo/client'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import EmptyTab from '@holi/core/components/EmptyTab'
import { logError } from '@holi/core/errors/helpers'
import { insightsByUserIdQuery } from '@holi/core/queries'
import type { InsightsByUserIdResponse } from '@holi/core/queries'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import { colors } from '@holi/ui/styles/globalVars'

interface Props {
  userId: string
  emptyText: string
}

const InsightsTab = ({ emptyText, userId }: Props) => {
  const { data, error } = useQuery<InsightsByUserIdResponse>(insightsByUserIdQuery, { variables: { userId } })
  const insights = data?.insightsByUserId
  const hasInsights = insights && insights.totalResults > 0

  if (error) {
    logError(error, `[InsightsTab.tsx] ${error.message}`)
  }

  return hasInsights ? (
    <>
      {insights.data.map((insight) => {
        return (
          <View key={insight.id} style={styles.item}>
            <HoliColumns padding={[0, 24]}>
              <HoliColumn padding={[0, 16, 0, 0]} alignSelf="stretch">
                <HoliTextLink href={`/insights/${insight.id}`} variant="secondary">
                  {insight.title}
                </HoliTextLink>
              </HoliColumn>
              {!!insight.headerImage && (
                <HoliColumn padding={[0, 16, 0, 0]}>
                  <HoliImage
                    label=""
                    source={{
                      uri: insight.headerImage,
                      width: 64,
                      height: 64,
                    }}
                    resizeMode="cover"
                  />
                </HoliColumn>
              )}
            </HoliColumns>
          </View>
        )
      })}
    </>
  ) : (
    <EmptyTab text={emptyText} />
  )
}

export default InsightsTab

const styles = StyleSheet.create({
  item: {
    flex: 1,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: colors.background30,
  },
})
