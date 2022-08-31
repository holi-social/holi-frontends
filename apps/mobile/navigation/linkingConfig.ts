const linkingConfig = {
  initialRouteName: 'Core',
  screens: {
    // the actual app
    Core: {
      screens: {
        Home: {
          initialRouteName: 'HomeFeed',
          screens: {
            HomeFeed: '',
            Topic: 'topics/:topicId',
            Post: 'topics/:topicId/posts/:postId',
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
    VolunteeringApp: {
      screens: {
        VolunteeringAppHome: 'apps/volunteering',
      },
    },
    // all modals
    Login: 'login',
    Logout: 'logout',
    Registration: 'registration',
  },
}

export default linkingConfig
