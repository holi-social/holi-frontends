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
import { colors, vars } from '@holi/ui/styles/globalVars'

interface Props {
  userId: string
  emptyText: string
}

const THUMBNAIL_SIZE = 64

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
          <View key={insight.id} style={styles.itemContainer}>
            <HoliColumns padding={[40, 24]} alignItems="flex-start">
              <HoliColumn padding={[0, 16, 0, 0]} flex={2}>
                <HoliTextLink href={`/insights/${insight.id}`} variant="secondary">
                  {insight.title}
                </HoliTextLink>
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
                    resizeMode="cover"
                  />
                </View>
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
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: colors.background30,
    maxWidth: vars.maxScreenWidth,
  },
  imageColumn: {
    paddingBottom: 40,
    flexBasis: THUMBNAIL_SIZE,
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 8,
    backgroundColor: colors.background20,
  },
})
