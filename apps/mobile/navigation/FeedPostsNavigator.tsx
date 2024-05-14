import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import PostCommentPage from '@holi/core/screens/individualPosts/PostCommentPage'
import PostDetailsPage, { PostDetailsPageParams } from '@holi/core/screens/individualPosts/PostDetailsPage'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'

export type FeedPostsScreens = {
  [RouteName.FeedPostDetailsPage]: PostDetailsPageParams
}

const FeedPostsStack = createNativeStackNavigator<FeedPostsScreens>()

const FeedPostsNavigator = () => {
  return (
    <FeedPostsStack.Navigator
      initialRouteName={RouteName.FeedPostDetailsPage}
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        header: HeaderAnimated,
        headerShadowVisible: false,
      }}
    >
      <FeedPostsStack.Screen name={RouteName.FeedPostDetailsPage} component={PostDetailsPage} />
      <FeedPostsStack.Screen name={RouteName.FeedPostCommentPage} component={PostCommentPage} />
    </FeedPostsStack.Navigator>
  )
}

export default FeedPostsNavigator
