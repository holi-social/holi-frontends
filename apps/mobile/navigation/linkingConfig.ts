import type { LinkingOptions } from '@react-navigation/native'

import { RootStackScreens } from '@holi/mobile/navigation/RootNavigator'
import { RouteName } from '@holi/mobile/navigation/routeName'

const linkingConfig: LinkingOptions<RootStackScreens>['config'] = {
  initialRouteName: RouteName.Core,
  screens: {
    // the actual app
    [RouteName.Core]: {
      screens: {
        [RouteName.Home]: {
          initialRouteName: RouteName.HomeFeed,
          screens: {
            [RouteName.HomeFeed]: '',
            [RouteName.InsightDetailPage]: 'insights/:insightId',
            [RouteName.PostDetailPage]: 'insights/:insightId/posts/:postId',
            [RouteName.CreatePostCommentPage]: 'insights/:insightId/posts/:postId/comment',
            [RouteName.UserProfile]: 'profile/:userId',
            [RouteName.Notifications]: 'notifications',
          },
        },
        [RouteName.Spaces]: {
          initialRouteName: RouteName.SpacesHome,
          screens: {
            [RouteName.SpacesHome]: 'spaces',
            [RouteName.SpaceDetails]: 'spaces/:spaceId',
          },
        },
        [RouteName.Chat]: {
          initialRouteName: RouteName.ChatHome,
          screens: {
            [RouteName.ChatHome]: 'chat',
          },
        },
        [RouteName.Auth]: {
          initialRouteName: RouteName.Profile,
          screens: {
            [RouteName.Profile]: 'profile',
            [RouteName.SettingsOverview]: 'profile/settings',
            [RouteName.AccountSettings]: 'profile/settings/account',
          },
        },
      },
    },
    [RouteName.Search]: {
      screens: {
        [RouteName.Search]: 'search',
      },
    },
    // apps from the HOLI store
    [RouteName.DonationsApp]: {
      screens: {
        [RouteName.DonationsAppHome]: 'apps/donations',
        [RouteName.DonationsAppProjectDetail]: 'apps/donations/project/:projectId',
      },
    },
    [RouteName.VolunteeringApp]: {
      screens: {
        [RouteName.VolunteeringAppHome]: 'apps/volunteering',
      },
    },
    // all modals
    [RouteName.Login]: 'login',
    [RouteName.Logout]: 'logout',
    [RouteName.Registration]: 'registration',
    [RouteName.ForgotPassword]: 'forgotPassword',
  },
}

export default linkingConfig
