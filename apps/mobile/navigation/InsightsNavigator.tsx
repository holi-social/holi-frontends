import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import InsightDetailPage, { InsightDetailPageParams } from '@holi/core/screens/insights/InsightDetailPage'
import CommentInputPage, { CommentInputPageParams } from '@holi/core/screens/posts/CommentInputPage'
import PostDetailPage, { PostDetailPageParams } from '@holi/core/screens/posts/PostDetailPage'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'

export type InsightsScreens = {
  [RouteName.InsightDetailPage]: InsightDetailPageParams
  [RouteName.InsightPostDetailPage]: PostDetailPageParams
  [RouteName.InsightPostCommentInputPage]: CommentInputPageParams
  [RouteName.PostDetailPage]: PostDetailPageParams
  [RouteName.PostCommentInputPage]: CommentInputPageParams
}

const InsightsStack = createNativeStackNavigator<InsightsScreens>()

const InsightsNavigator: React.VFC = () => {
  return (
    <InsightsStack.Navigator
      initialRouteName={RouteName.InsightDetailPage}
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        header: HeaderAnimated,
        headerShadowVisible: false,
      }}
    >
      <InsightsStack.Screen name={RouteName.InsightDetailPage} component={InsightDetailPage} />
      <InsightsStack.Screen name={RouteName.InsightPostDetailPage} component={PostDetailPage} />
      <InsightsStack.Screen name={RouteName.PostDetailPage} component={PostDetailPage} />
      <InsightsStack.Screen name={RouteName.InsightPostCommentInputPage} component={CommentInputPage} />
      <InsightsStack.Screen name={RouteName.PostCommentInputPage} component={CommentInputPage} />
    </InsightsStack.Navigator>
  )
}

export default InsightsNavigator
