import type { LinkingOptions } from '@react-navigation/native'

import type { RootStackScreens } from '@holi/mobile/navigation/RootNavigator'
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
          },
        },
        [RouteName.SpacesStack]: {
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
        [RouteName.ActStack]: {
          initialRouteName: RouteName.ActHome,
          screens: {
            [RouteName.ActHome]: 'act',
          },
        },
        [RouteName.Auth]: {
          initialRouteName: RouteName.Profile,
          screens: {
            [RouteName.Profile]: 'profile',
            [RouteName.SettingsOverview]: 'profile/settings',
            [RouteName.AccountSettings]: 'profile/settings/account',
            [RouteName.NotificationSettings]: 'profile/settings/notifications',
            [RouteName.TrackingSettings]: 'profile/settings/tracking',
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

    [RouteName.Events]: {
      screens: {
        [RouteName.EventDetailsScreen]: 'events/:eventId',
        [RouteName.EventList]: 'events',
      },
    },

    [RouteName.Insights]: {
      screens: {
        [RouteName.InsightsPage]: 'insights',
        [RouteName.InsightsCurationPrinciples]: 'insights/curationPrinciples',
        [RouteName.InsightDetailPage]: 'insights/:insightId',
        [RouteName.InsightPostDetailPage]: 'insights/:insightId/posts/:postId',
        [RouteName.InsightPostCommentInputPage]: 'insights/:insightId/posts/:postId/comment',
        [RouteName.PostDetailPage]: 'posts/:postId',
        [RouteName.PostCommentInputPage]: 'posts/:postId/comment',
        [RouteName.InsightQuoteDetailPage]: 'insights/:insightId/quotes/:quoteId',
        [RouteName.RecommendationDetailPage]: 'insights/:insightId/recommendations/:recommendationId',
        [RouteName.InitiativeDetailPage]: 'insights/:insightId/initiatives/:initiativeId',
        [RouteName.DiscussionDetailPage]: 'insights/:insightId/discussions/:discussionId',
        [RouteName.DiscussionCommentPage]: 'insights/:insightId/discussions/:discussionId/comment',
      },
    },
    [RouteName.Spaces]: {
      screens: {
        [RouteName.SpaceDetails]: 'spaces/:spaceIdOrName',
        [RouteName.SpaceRelatedSpaces]: 'spaces/:spaceIdOrName/relatedSpaces',
        [RouteName.CreateSpace]: 'spaces/create',
        [RouteName.ExploreSpaces]: 'spaces/explore/',
        [RouteName.EditSpace]: 'spaces/:spaceIdOrName/edit',
        [RouteName.LinkHub]: 'spaces/:spaceIdOrName/linkhub',
        [RouteName.CreateDigitalTool]: 'spaces/:spaceIdOrName/linkhub/tools/create',
        [RouteName.EditDigitalTool]: 'spaces/:spaceIdOrName/linkhub/tools/:toolIdOrName/edit',
        [RouteName.SpaceVideoCallList]: 'spaces/:spaceIdOrName/video-call',
        [RouteName.CreateTask]: 'spaces/:spaceIdOrName/tasks/create',
        [RouteName.TaskDetails]: 'spaces/:spaceIdOrName/tasks/:taskId',
        [RouteName.EditTask]: 'spaces/:spaceIdOrName/tasks/:taskId/edit',
        [RouteName.CreateTaskDE]: 'spaces/:spaceIdOrName/aufgaben/create',
        [RouteName.TaskDetailsDE]: 'spaces/:spaceIdOrName/aufgaben/:taskId',
        [RouteName.EditTaskDE]: 'spaces/:spaceIdOrName/aufgaben/:taskId/edit',
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
        [RouteName.SpaceTasksDE]: 'spaces/:spaceIdOrName/aufgaben',
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

    // Onboarding
    [RouteName.Onboarding]: 'onboarding',
    [RouteName.OnboardingLegalDocuments]: 'onboarding/legalDocuments',

    // Modals
    [RouteName.Notifications]: 'notifications',
    [RouteName.Login]: 'login',
    [RouteName.LoginCallback]: 'login/callback',
    [RouteName.AuthError]: 'auth/error',
    [RouteName.ForgotPassword]: 'forgotPassword',
    [RouteName.VideoCall]: 'video-call/:roomName',
    [RouteName.Search]: 'search',

    // Apps from the HOLI store
    [RouteName.ChallengesApp]: {
      screens: {
        [RouteName.ChallengesAppHome]: 'apps/challenges',
      },
    },
    [RouteName.DonationsApp]: {
      screens: {
        [RouteName.DonationsAppHome]: 'donations',
        [RouteName.DonationsAppHomeOld]: 'apps/donations',
        [RouteName.DonationsAppHomeDE]: 'spenden',
        [RouteName.DonationsAppProjectDetail]: 'donations/:projectId',
        [RouteName.DonationsAppProjectDetailOld]: 'apps/donations/project/:projectId',
        [RouteName.DonationsAppProjectDetailDE]: 'spenden/:projectId',
      },
    },
    [RouteName.GoodNewsApp]: {
      screens: {
        [RouteName.GoodNewsAppHome]: 'apps/goodnews',
      },
    },
    [RouteName.VolunteeringApp]: {
      screens: {
        [RouteName.VolunteeringAppHome]: 'volunteering',
        [RouteName.VolunteeringAppHomeOld]: 'apps/volunteering',
        [RouteName.VolunteeringAppHomeDE]: 'ehrenamt',
        [RouteName.VolunteeringAppEngagmentDetail]: 'volunteering/:engagementId',
        [RouteName.VolunteeringAppEngagmentDetailOld]: 'apps/volunteering/engagement/:engagementId',
        [RouteName.VolunteeringAppEngagmentDetailDE]: 'ehrenamt/:engagementId',
      },
    },
    [RouteName.CreatePost]: {
      screens: {
        [RouteName.CreatePost]: 'feed-posts/create',
      },
    },
    [RouteName.EditPost]: {
      screens: {
        [RouteName.EditPost]: 'feed-posts/:idOrSlug/edit',
      },
    },
    [RouteName.FeedPosts]: {
      screens: {
        [RouteName.FeedPostDetailsPage]: 'feed-posts/:idOrSlug',
        [RouteName.FeedPostCommentPage]: 'feed-posts/:idOrSlug/comment',
      },
    },
    [RouteName.CreateReport]: {
      screens: {
        [RouteName.CreateReport]: 'report/:id/:type/:type3k',
      },
    },
    [RouteName.UserProfile]: 'profile/:userId',
    [RouteName.NotFound]: '404',
    [RouteName.Unsubscribe]: 'unsubscribe',
  },
}

export default linkingConfig
