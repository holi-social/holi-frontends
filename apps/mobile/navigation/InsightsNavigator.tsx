import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import CurationPrinciplesPage from '@holi/core/screens/insights/CurationPrinciplesPage'
import InsightDetailPage, { InsightDetailPageParams } from '@holi/core/screens/insights/InsightDetailPage'
import InsightsPage from '@holi/core/screens/insights/InsightsPage'
import DiscussionCommentPage, {
  DiscussionCommentPageParams,
} from '@holi/core/screens/insights/discussions/DiscussionCommentPage'
import DiscussionDetailPage, {
  DiscussionDetailPageParams,
} from '@holi/core/screens/insights/discussions/DiscussionDetailPage'
import InitiativeDetailPage, {
  InitiativeDetailPageParams,
} from '@holi/core/screens/insights/initiatives/InitiativeDetailPage'
import QuoteDetailPage, { QuoteDetailPageParams } from '@holi/core/screens/insights/quotes/QuoteDetailPage'
import RecommendationDetailPage, {
  RecommendationDetailPageParams,
} from '@holi/core/screens/insights/recommendations/RecommendationDetailPage'
import CommentInputPage, { CommentInputPageParams } from '@holi/core/screens/posts/CommentInputPage'
import PostDetailPage, { PostDetailPageParams } from '@holi/core/screens/posts/PostDetailPage'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'

export type InsightsScreens = {
  [RouteName.InsightDetailPage]: InsightDetailPageParams
  [RouteName.InsightsPage]: undefined
  [RouteName.InsightPostDetailPage]: PostDetailPageParams
  [RouteName.InsightPostCommentInputPage]: CommentInputPageParams
  [RouteName.PostDetailPage]: PostDetailPageParams
  [RouteName.PostCommentInputPage]: CommentInputPageParams
  [RouteName.RecommendationDetailPage]: RecommendationDetailPageParams
  [RouteName.InitiativeDetailPage]: InitiativeDetailPageParams
  [RouteName.InsightQuoteDetailPage]: QuoteDetailPageParams
  [RouteName.InsightsCurationPrinciples]: undefined
  [RouteName.DiscussionDetailPage]: DiscussionDetailPageParams
  [RouteName.DiscussionCommentPage]: DiscussionCommentPageParams
}

const InsightsStack = createNativeStackNavigator<InsightsScreens>()

const InsightsNavigator = () => {
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
      <InsightsStack.Screen name={RouteName.InsightsPage} component={InsightsPage} />
      <InsightsStack.Screen name={RouteName.InsightPostDetailPage} component={PostDetailPage} />
      <InsightsStack.Screen name={RouteName.PostDetailPage} component={PostDetailPage} />
      <InsightsStack.Screen name={RouteName.InsightPostCommentInputPage} component={CommentInputPage} />
      <InsightsStack.Screen name={RouteName.PostCommentInputPage} component={CommentInputPage} />
      <InsightsStack.Screen name={RouteName.RecommendationDetailPage} component={RecommendationDetailPage} />
      <InsightsStack.Screen name={RouteName.InitiativeDetailPage} component={InitiativeDetailPage} />
      <InsightsStack.Screen name={RouteName.InsightQuoteDetailPage} component={QuoteDetailPage} />
      <InsightsStack.Screen name={RouteName.InsightsCurationPrinciples} component={CurationPrinciplesPage} />
      <InsightsStack.Screen name={RouteName.DiscussionDetailPage} component={DiscussionDetailPage} />
      <InsightsStack.Screen name={RouteName.DiscussionCommentPage} component={DiscussionCommentPage} />
    </InsightsStack.Navigator>
  )
}

export default InsightsNavigator
