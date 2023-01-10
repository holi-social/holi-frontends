import type { LinkingOptions } from '@react-navigation/native'

import { RootStackScreens } from '@holi/mobile/navigation/RootNavigator'
import { RouteName } from '@holi/mobile/navigation/routeName'

const linkingConfig: LinkingOptions<RootStackScreens>['config'] = {
  initialRouteName: RouteName.BottomTabs,
  screens: {
    // Views with bottom navigation
    [RouteName.BottomTabs]: {
      screens: {
        [RouteName.Home]: {
          initialRouteName: RouteName.HomeFeed,
          screens: {
            [RouteName.HomeFeed]: '',
            [RouteName.InsightDetailPage]: 'insights/:insightId',
            [RouteName.InsightPostDetailPage]: 'insights/:insightId/posts/:postId',
            [RouteName.InsightPostCommentInputPage]: 'insights/:insightId/posts/:postId/comment',
            [RouteName.PostDetailPage]: 'posts/:postId',
            [RouteName.PostCommentInputPage]: 'posts/:postId/comment',
            [RouteName.UserProfile]: 'profile/:userId',
          },
        },
        [RouteName.Spaces]: {
          initialRouteName: RouteName.SpacesHome,
          screens: {
            [RouteName.SpacesHome]: 'spaces',
            [RouteName.SpaceDetails]: 'spaces/:spaceId',
            [RouteName.FilteredSpaces]: 'spaces/filter',
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

    // Modals
    [RouteName.Notifications]: 'notifications',
    [RouteName.Login]: 'login',
    [RouteName.Registration]: 'registration',
    [RouteName.ForgotPassword]: 'forgotPassword',

    // Apps from the HOLI store
    [RouteName.DonationsApp]: {
      screens: {
        [RouteName.DonationsAppHome]: 'apps/donations',
        [RouteName.DonationsAppProjectDetail]: 'apps/donations/project/',
      },
    },
    [RouteName.GoodNewsApp]: {
      screens: {
        [RouteName.GoodNewsAppHome]: 'apps/goodnews',
      },
    },
    [RouteName.VolunteeringApp]: {
      screens: {
        [RouteName.VolunteeringAppHome]: 'apps/volunteering',
      },
    },
  },
}

export default linkingConfig
