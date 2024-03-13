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
            [RouteName.NotFound]: '404',
          },
        },
        [RouteName.SpacesHomeStack]: {
          screens: {
            [RouteName.SpacesHome]: 'spaces',
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
            [RouteName.NotificationSettings]: 'profile/settings/notifications',
            [RouteName.ChangePassword]: 'profile/settings/changePassword',
            [RouteName.ChangeEmail]: 'profile/settings/changeEmail',
            [RouteName.ChangeEmailVerification]: 'profile/settings/changeEmailVerification',
            [RouteName.LegalDocuments]: 'profile/settings/legalDocuments',
            [RouteName.AboutHoliApp]: 'profile/settings/aboutholiapp',
            [RouteName.HelpSettings]: 'profile/settings/help',
            [RouteName.Document]: 'profile/settings/legalDocuments/document',
            [RouteName.Favorites]: 'profile/settings/favorites',
          },
        },
      },
    },

    [RouteName.Insights]: {
      screens: {
        [RouteName.InsightsPage]: 'insights',
        [RouteName.InsightDetailPage]: 'insights/:insightId',
        [RouteName.InsightPostDetailPage]: 'insights/:insightId/posts/:postId',
        [RouteName.InsightPostCommentInputPage]: 'insights/:insightId/posts/:postId/comment',
        [RouteName.PostDetailPage]: 'posts/:postId',
        [RouteName.PostCommentInputPage]: 'posts/:postId/comment',
        [RouteName.InsightQuoteDetailPage]: 'insights/:insightId/quotes/:quoteId',
        [RouteName.RecommendationDetailPage]: 'insights/:insightId/recommendations/:recommendationId',
      },
    },

    [RouteName.Spaces]: {
      screens: {
        [RouteName.SpaceDetails]: 'spaces/:spaceIdOrName',
        [RouteName.CreateSpace]: 'spaces/create',
        [RouteName.EditSpace]: 'spaces/:spaceIdOrName/edit',
        [RouteName.LinkHub]: 'spaces/:spaceIdOrName/linkhub',
        [RouteName.CreateDigitalTool]: 'spaces/:spaceIdOrName/linkhub/tools/create',
        [RouteName.EditDigitalTool]: 'spaces/:spaceIdOrName/linkhub/tools/:toolIdOrName/edit',
        [RouteName.SpaceStorage]: 'spaces/:spaceIdOrName/storage',
        [RouteName.SpaceVideoCallList]: 'spaces/:spaceIdOrName/video-call',
        [RouteName.CreateTask]: 'spaces/:spaceIdOrName/tasks/create',
        [RouteName.TaskDetails]: 'spaces/:spaceIdOrName/tasks/:taskId',
        [RouteName.EditTask]: 'spaces/:spaceIdOrName/tasks/:taskId/edit',
        [RouteName.CreateUpdate]: 'spaces/:spaceIdOrName/updates/create',
        [RouteName.EditUpdate]: 'spaces/:spaceIdOrName/updates/:postId/edit',
        [RouteName.SpaceUpdateDetailPage]: 'spaces/:spaceIdOrName/updates/:postId',
        [RouteName.SpaceUpdateCommentInputPage]: 'spaces/:spaceIdOrName/updates/:postId/comment',
        [RouteName.SpaceInvitePage]: 'spaces/:spaceIdOrName/invite',
        [RouteName.Collaborators]: 'spaces/:spaceIdOrName/collaborators',
        [RouteName.EditCollaborators]: 'spaces/:spaceIdOrName/collaborators/manage',
        [RouteName.SpaceRolesPermissions]: 'spaces/:spaceIdOrName/collaborators/rolesAndPermissions',
        [RouteName.SpaceOnboarding]: 'spaces/:spaceIdOrName/onboarding',
        [RouteName.SpaceOnboardingSteps]: 'spaces/:spaceIdOrName/onboarding/steps',
        [RouteName.SpaceTasks]: 'spaces/:spaceIdOrName/tasks',
        [RouteName.AboutSpaces]: 'about-spaces',
        [RouteName.SpaceAppointments]: 'spaces/:spaceIdOrName/appointments',
        [RouteName.CreateAppointment]: 'spaces/:spaceIdOrName/appointments/create',
        [RouteName.EditAppointment]: 'spaces/:spaceIdOrName/appointments/:idOrSlug/edit',
        [RouteName.AppointmentDetails]: 'spaces/:spaceIdOrName/appointments/:idOrSlug',
      },
    },

    [RouteName.ChatStack]: {
      screens: {
        [RouteName.ChatRoom]: 'chat/rooms/:roomId',
        [RouteName.ChatStartConversation]: 'chat/start',
      },
    },

    [RouteName.AppsHub]: {
      screens: {
        [RouteName.AppsHub]: 'appsHub',
      },
    },

    // Modals
    [RouteName.Notifications]: 'notifications',
    [RouteName.Onboarding]: 'onboarding',
    [RouteName.Login]: 'login',
    [RouteName.Registration]: 'registration',
    [RouteName.ForgotPassword]: 'forgotPassword',
    [RouteName.VideoCall]: 'video-call/:roomName',

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
