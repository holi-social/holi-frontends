import type { LoginParams } from '@holi/core/screens/auth/Login'
import type { VideoCallParams } from '@holi/core/screens/videoCall/VideoCall.shared'
import { RouteName } from '@holi/mobile/navigation/routeName'
import type { OnboardingParams } from '@holi/core/screens/onboarding/Onboarding'
import type { SearchParams } from '@holi/core/screens/search/Search'
import type { UserProfileParams } from '@holi/core/screens/userprofile/UserProfile'
import type { LoginCallbackParams } from '@holi/core/auth/screens/LoginCallback'
import type { AuthErrorParams } from '@holi/core/auth/screens/AuthError'

export type RootStackScreens = {
  [RouteName.BottomTabs]: undefined
  [RouteName.Notifications]: undefined
  [RouteName.Spaces]: undefined
  [RouteName.Events]: undefined
  [RouteName.Insights]: undefined
  [RouteName.ActHome]: undefined
  [RouteName.ChatStack]: undefined

  [RouteName.Onboarding]: OnboardingParams
  [RouteName.OnboardingLegalDocuments]: undefined

  [RouteName.Login]: LoginParams
  [RouteName.LoginCallback]: LoginCallbackParams
  [RouteName.ForgotPassword]: undefined
  [RouteName.AuthError]: AuthErrorParams

  [RouteName.ChallengesApp]: undefined
  [RouteName.DonationsApp]: undefined
  [RouteName.GoodNewsApp]: undefined
  [RouteName.VolunteeringApp]: undefined

  [RouteName.VideoCall]: VideoCallParams

  [RouteName.NotFound]: undefined
  [RouteName.Favorites]: undefined
  [RouteName.AboutMe]: undefined
  [RouteName.MyConnections]: undefined
  [RouteName.MyPosts]: undefined
  [RouteName.MySpaces]: undefined

  [RouteName.CreatePost]: undefined
  [RouteName.EditPost]: undefined
  [RouteName.FeedPosts]: undefined

  [RouteName.CreateSpace]: undefined
  [RouteName.CreateReport]: undefined

  [RouteName.Unsubscribe]: undefined

  [RouteName.Search]: SearchParams

  [RouteName.UserProfile]: UserProfileParams

  [RouteName.EventList]: undefined

  [RouteName.PetitionDetailsScreen]: undefined
}

export interface RootNavigatorProps {
  showOnboardingOnStartup: boolean
}

export const RootNavigator = () => {
  return null
}
