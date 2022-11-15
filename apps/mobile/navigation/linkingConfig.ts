import type { LinkingOptions } from '@react-navigation/native'

import { RootStackScreens } from '@holi/mobile/navigation/RootNavigator'

const linkingConfig: LinkingOptions<RootStackScreens>['config'] = {
  initialRouteName: 'Core',
  screens: {
    // the actual app
    Core: {
      screens: {
        Home: {
          initialRouteName: 'HomeFeed',
          screens: {
            HomeFeed: '',
            InsightDetailPage: 'insights/:insightId',
            PostDetailPage: 'insights/:insightId/posts/:postId',
            CreatePostCommentPage: 'insights/:insightId/posts/:postId/comment',
            UserProfile: 'profile/:userId',
            Notifications: 'notifications',
          },
        },
        Spaces: {
          initialRouteName: 'SpacesHome',
          screens: {
            Spaces: 'spaces',
            SpaceDetails: 'spaces/:spaceId',
          },
        },
        Chat: {
          initialRouteName: 'ChatHome',
          screens: {
            ChatHome: 'chat',
          },
        },
        Auth: {
          initialRouteName: 'OwnProfile',
          screens: {
            OwnProfile: 'profile',
            SettingsOverview: 'profile/settings',
            AccountSettings: 'profile/settings/account',
          },
        },
      },
    },
    Search: {
      // initialRouteName: 'Search',
      screens: {
        Search: 'search',
      },
    },
    // apps from the HOLI store
    DonationsApp: {
      screens: {
        DonationsAppHome: 'apps/donations',
        DonationsAppProjectDetail: 'apps/donations/project/:projectId',
      },
    },
    VolunteeringApp: {
      screens: {
        VolunteeringAppHome: 'apps/volunteering',
      },
    },
    // all modals
    Login: 'login',
    Logout: 'logout',
    Registration: 'registration',
    ForgotPassword: 'forgotPassword',
  },
}

export default linkingConfig
