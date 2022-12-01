import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HeaderAnimated from '@holi//mobile/navigation/HeaderAnimated'
import InsightDetailPage, { InsightDetailPageParams } from '@holi/core/screens/insights/InsightDetailPage'
import CommentInputPage, { CommentInputPageParams } from '@holi/core/screens/posts/CommentInputPage'
import PostDetailPage, { PostDetailPageParams } from '@holi/core/screens/posts/PostDetailPage'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

export type InsightsScreensList = {
  [RouteName.InsightDetailPage]: InsightDetailPageParams
  [RouteName.PostDetailPage]: PostDetailPageParams
  [RouteName.CommentInputPage]: CommentInputPageParams
}

const InsightsStack = createNativeStackNavigator<InsightsScreensList>()

const InsightsNavigator: React.VFC = () => {
  return (
    <InsightsStack.Navigator
      initialRouteName={RouteName.InsightDetailPage}
      screenOptions={{
        header: HeaderAnimated,
        headerShown: true,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.backgroundColorWhite,
        },
      }}
    >
      <InsightsStack.Screen name={RouteName.InsightDetailPage} component={InsightDetailPage} />
      <InsightsStack.Screen name={RouteName.PostDetailPage} component={PostDetailPage} />
      <InsightsStack.Screen name={RouteName.CommentInputPage} component={CommentInputPage} />
    </InsightsStack.Navigator>
  )
}

export default InsightsNavigator
