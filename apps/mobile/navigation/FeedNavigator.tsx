import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Search from '@holi/core/screens/Search'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import InsightDetailPage, { InsightDetailPageParams } from '@holi/core/screens/insights/InsightDetailPage'
import CommentInputPage, { CommentInputPageParams } from '@holi/core/screens/posts/CommentInputPage'
import PostDetailPage, { PostDetailPageParams } from '@holi/core/screens/posts/PostDetailPage'
import UserProfile, { UserProfileParams } from '@holi/core/screens/userprofile/UserProfile'
import HeaderAnimated from '@holi/mobile/navigation/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'

export type FeedStackScreens = {
  [RouteName.HomeFeed]: undefined
  [RouteName.InsightDetailPage]: InsightDetailPageParams
  [RouteName.InsightPostDetailPage]: PostDetailPageParams
  [RouteName.InsightPostCommentInputPage]: CommentInputPageParams
  [RouteName.PostDetailPage]: PostDetailPageParams
  [RouteName.PostCommentInputPage]: CommentInputPageParams
  [RouteName.Search]: undefined
  [RouteName.UserProfile]: UserProfileParams
}

const FeedStack = createNativeStackNavigator<FeedStackScreens>()

const FeedNavigator: React.VFC = () => {
  return (
    <FeedStack.Navigator
      initialRouteName={RouteName.HomeFeed}
      screenOptions={{
        header: HeaderAnimated,
        headerShadowVisible: false,
        headerTransparent: true,
      }}
    >
      <FeedStack.Screen name={RouteName.HomeFeed} component={HomeFeed} />
      <FeedStack.Screen name={RouteName.Search} component={Search} />
      <FeedStack.Screen name={RouteName.InsightDetailPage} component={InsightDetailPage} />
      <FeedStack.Screen name={RouteName.InsightPostDetailPage} component={PostDetailPage} />
      <FeedStack.Screen name={RouteName.InsightPostCommentInputPage} component={CommentInputPage} />
      <FeedStack.Screen name={RouteName.PostDetailPage} component={PostDetailPage} />
      <FeedStack.Screen name={RouteName.PostCommentInputPage} component={CommentInputPage} />
      <FeedStack.Screen name={RouteName.UserProfile} component={UserProfile} />
    </FeedStack.Navigator>
  )
}

export default FeedNavigator
