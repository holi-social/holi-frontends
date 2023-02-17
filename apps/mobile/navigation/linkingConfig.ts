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
            [RouteName.UserProfile]: 'profile/:userId',
          },
        },
        [RouteName.SpacesHome]: 'spaces',
        [RouteName.Chat]: 'chat',
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

    [RouteName.InsightDetailPage]: 'insights/:insightId',
    [RouteName.InsightPostDetailPage]: 'insights/:insightId/posts/:postId',
    [RouteName.InsightPostCommentInputPage]: 'insights/:insightId/posts/:postId/comment',
    [RouteName.PostDetailPage]: 'posts/:postId',
    [RouteName.PostCommentInputPage]: 'posts/:postId/comment',

    // Spaces (SpacesHome is in BottomTabs)
    [RouteName.Spaces]: {
      screens: {
        [RouteName.SpaceDetails]: 'spaces/:spaceId',
        [RouteName.FilteredSpaces]: 'spaces/filter',
        [RouteName.CreateSpace]: 'spaces/create',
        [RouteName.EditSpace]: 'spaces/:spaceId/edit',
      },
    },

    // Modals
    [RouteName.Search]: 'search',
    [RouteName.Notifications]: 'notifications',
    [RouteName.Login]: 'login',
    [RouteName.Registration]: 'registration',
    [RouteName.ForgotPassword]: 'forgotPassword',

    // Apps from the HOLI store
    [RouteName.DonationsApp]: {
      screens: {
        [RouteName.DonationsAppHome]: 'apps/donations',
        [RouteName.DonationsAppProjectDetail]: 'apps/donations/project/:projectId',
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
        [RouteName.VolunteeringAppEngagmentDetail]: 'apps/volunteering/engagement/:engagementId',
      },
    },
  },
}

export default linkingConfig
