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
            Insight: 'insights/:insightId',
            Post: 'insights/:insightId/posts/:postId',
            OwnProfile: 'profile',
            UserProfile: 'profile/:userId',
            Notifications: 'notifications',
          },
        },
        Chat: {
          initialRouteName: 'ChatHome',
          screens: {
            ChatHome: 'chat',
          },
        },
        Search: {
          initialRouteName: 'Search',
          screens: {
            Search: 'search',
          },
        },
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
