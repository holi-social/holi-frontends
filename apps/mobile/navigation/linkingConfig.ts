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
            [RouteName.Search]: 'search',
          },
        },
        [RouteName.SpacesHomeStack]: {
          screens: {
            [RouteName.SpacesHome]: 'spaces',
            [RouteName.FilteredSpaces]: 'spaces/filter',
          },
        },
        [RouteName.Chat]: {
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
            [RouteName.ChangePassword]: 'profile/settings/changePassword',
          },
        },
      },
    },

    [RouteName.Insights]: {
      screens: {
        [RouteName.InsightDetailPage]: 'insights/:insightId',
        [RouteName.InsightPostDetailPage]: 'insights/:insightId/posts/:postId',
        [RouteName.InsightPostCommentInputPage]: 'insights/:insightId/posts/:postId/comment',
        [RouteName.PostDetailPage]: 'posts/:postId',
        [RouteName.PostCommentInputPage]: 'posts/:postId/comment',
      },
    },

    [RouteName.Spaces]: {
      screens: {
        [RouteName.SpaceDetails]: 'spaces/:spaceIdOrName',
        [RouteName.CreateSpace]: 'spaces/create',
        [RouteName.EditSpace]: 'spaces/:spaceIdOrName/edit',
        [RouteName.AddDigitalTool]: 'spaces/:spaceIdOrName/addDigitalTool',
        [RouteName.SpaceStorage]: 'spaces/:spaceIdOrName/storage',
        [RouteName.LinkHub]: 'spaces/:spaceIdOrName/linkHub',
        [RouteName.EditDigitalTool]: 'spaces/:spaceIdOrName/tools/:toolIdOrName/edit',
        [RouteName.CreateTask]: 'spaces/:spaceIdOrName/createTask',
        [RouteName.TaskDetails]: 'spaces/:spaceIdOrName/tasks/:taskId',
      },
    },

    // Modals
    [RouteName.Notifications]: 'notifications',
    [RouteName.Onboarding]: 'onboarding',
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
