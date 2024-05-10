import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import NotFound from '@holi/core/screens/404/NotFound'
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
      {/*TODO: use FeedPostCommentInputPage */}
      <FeedPostsStack.Screen name={RouteName.FeedPostCommentInputPage} component={NotFound} />
    </FeedPostsStack.Navigator>
  )
}

export default FeedPostsNavigator
