import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import PostCommentPage, { type PostCommentPageParams } from '@holi/core/screens/individualPosts/PostCommentPage'
import PostDetailsPage, { type PostDetailsPageParams } from '@holi/core/screens/individualPosts/PostDetailsPage'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { RouteName } from '@holi/mobile/navigation/routeName'

export type FeedPostsScreens = {
  [RouteName.FeedPostDetailsPage]: PostDetailsPageParams
  [RouteName.FeedPostCommentPage]: PostCommentPageParams
}

const FeedPostsStack = createNativeStackNavigator<FeedPostsScreens>()

const FeedPostsNavigator = () => {
  return (
    <SpaceTermContextProvider>
      <FeedPostsStack.Navigator
        initialRouteName={RouteName.FeedPostDetailsPage}
        screenOptions={{
          headerShown: true,
          headerShadowVisible: false,
        }}
      >
        <FeedPostsStack.Screen name={RouteName.FeedPostDetailsPage} component={PostDetailsPage} />
        <FeedPostsStack.Screen name={RouteName.FeedPostCommentPage} component={PostCommentPage} />
      </FeedPostsStack.Navigator>
    </SpaceTermContextProvider>
  )
}

export default FeedPostsNavigator
