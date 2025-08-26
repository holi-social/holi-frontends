import type { Duration, Regularity } from '@holi/api/graphql/graphql-codegen'
import type { Channel } from '@holi/core/screens/notifications/hooks/useNotificationPreferences'
/* eslint-disable @typescript-eslint/no-namespace */
import type { SignupModalPressedTrigger } from '@holi/core/tracking/types'

type RecommendationType = 'space' | 'donation' | 'volunteering_opportunity' | 'goodnews' | 'space_task'

/**
 * The base type of all tracking events. `TrackingEvent` instances shall not be defined outside of this file to ensure
 * this file contains a complete reference of all tracking events.
 */
export interface TrackingEvent {
  /** The event name */
  name: string

  /**
   * The events version (must use semantic versioning).
   *
   * As filtering by version in PostHog is not easily done based on a string, we're adopting the approach of the
   * semver-flattener plugin (https://github.com/PostHog/semver-flattener-plugin/) that splits the string up in multiple
   * number-based fields. These can be filtered and compared for using <, >, =, ... operators.
   */
  event_version__major: number
  event_version__minor: number
  event_version__patch: number

  /** Additional properties that can be added to the event payload */
  properties?: { [key: string]: unknown }
}

const versionOne = {
  event_version__major: 1,
  event_version__minor: 0,
  event_version__patch: 0,
}

/**
 * The `TrackingEvent` namespace contains all "custom tracking events" that can be sent to PostHog, thereby serving as
 * a *complete* reference. It contains sub-namespaces for the different areas of the application.
 */
export namespace TrackingEvent {
  export const SearchButtonPressed: TrackingEvent = {
    name: 'searchButtonPressed',
    ...versionOne,
  }

  export type SearchResult = {
    query: string
    totalNrOfResults: number
    totalNrOfPages: number
    currentPage: number
    selectedFacets: string[]
    // deliberately untyped to not have to adopt for every document type added. this shall only contain document
    // properties and not Instantsearch.js metadata on docs, see `removeDeniedProps` in
    // core/screens/search/tracking.ts
    renderedResults: Record<string, any>[] // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  export const SearchResultPressed = ({
    itemPressed,
    itemPressedIndex,
    itemPressedType,
    itemPressedTitleDe,
    itemPressedTitleEn,
    searchResult,
  }: {
    itemPressed: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
    itemPressedIndex: number
    itemPressedType: string
    itemPressedTitleDe?: string
    itemPressedTitleEn?: string
    searchResult: SearchResult
  }): TrackingEvent => ({
    name: 'searchResultPressed',
    ...versionOne,
    properties: {
      itemPressed,
      itemPressedIndex,
      itemPressedType,
      itemPressedTitleDe,
      itemPressedTitleEn,
      ...searchResult,
    },
  })

  export const SearchResultsRendered = ({
    query,
    totalNrOfResults,
    totalNrOfPages,
    currentPage,
    selectedFacets,
    renderedResults,
  }: SearchResult): TrackingEvent => ({
    name: 'searchResultsRendered',
    ...versionOne,
    properties: {
      query,
      totalNrOfResults,
      totalNrOfPages,
      currentPage,
      renderedResults,
      selectedFacets,
    },
  })

  export const Favorites = {
    navigateToFavorited: ({ type, id }: { type: string; id: string }) => ({
      name: 'favorites_navigateToFavorited',
      properties: {
        type,
        id,
      },
      ...versionOne,
    }),
  }

  export const SpaceAskQuestion = {
    askedQuestion: {
      name: 'space_askQuestionButton_pressed',
      ...versionOne,
    },
    startedConversation: {
      name: 'space_startConversationButton_pressed',
      ...versionOne,
    },
  }

  interface TaskProperties {
    taskId: string
    taskName: string
    regularity?: Regularity
    duration?: Duration
  }

  export const Task = {
    detailPage: {
      visited: (props: TaskProperties) => ({
        name: 'task_detail_page_visited',
        properties: { ...props },
        ...versionOne,
      }),
    },

    CTAButton: {
      startedConversation: (props: TaskProperties) => ({
        name: 'task_cta_startConversation_pressed',
        properties: { ...props },
        ...versionOne,
      }),
      signedUp: (props: TaskProperties) => ({
        name: 'task_cta_signUp_pressed',
        properties: { ...props },
        ...versionOne,
      }),
      illDoIt: (props: TaskProperties) => ({
        name: 'task_cta_illDoIt_pressed',
        properties: { ...props },
        ...versionOne,
      }),
    },
  }

  export const Petitions = {
    seeAll: {
      name: 'petitions_seeAll_pressed',
      ...versionOne,
    },
    pressed: (petitionId: string) => ({
      name: 'petition_card_pressed',
      properties: {
        petitionId,
      },
      ...versionOne,
    }),
  }

  export const PetitionDetails = {
    viewed: (petitionId: string) => ({
      name: 'petition_details_viewed',
      properties: {
        petitionId,
      },
      ...versionOne,
    }),
    findMore: {
      name: 'petition_findMore_pressed',
      ...versionOne,
    },
  }

  export const EventDetails = {
    shared: (eventId: string) => ({
      name: 'event_shareButton_pressed',
      properties: {
        eventId,
      },
      ...versionOne,
    }),
    viewed: (eventId: string) => ({
      name: 'event_details_viewed',
      properties: {
        eventId,
      },
      ...versionOne,
    }),
    findMore: {
      name: 'events_findMore_pressed',
      ...versionOne,
    },
    videoCall: (eventId: string) => ({
      name: 'events_videoCallLink_pressed',
      properties: {
        eventId,
      },
      ...versionOne,
    }),
  }

  export const Events = {
    selected: (eventId: string) => ({
      name: 'event_selected',
      properties: {
        eventId,
      },
      ...versionOne,
    }),
    seeAll: {
      name: 'events_seeAll_pressed',
      ...versionOne,
    },
    filter: {
      name: 'events_filter_pressed',
      ...versionOne,
    },
    loadMore: {
      name: 'events_loadMore_pressed',
      ...versionOne,
    },
  }

  export const Engaging = {
    reacted: (reactableType: string, reactableId: string): TrackingEvent => ({
      name: 'reacted',
      properties: {
        reactableType,
        reactableId,
      },
      ...versionOne,
    }),
    commented: (commentableType: string, commentableId: string): TrackingEvent => ({
      name: 'commented',
      properties: {
        commentableType,
        commentableId,
      },
      ...versionOne,
    }),
  }

  export const FeedPosts = {
    read: (postId: string, title: string, author: { id: string; name: string; role?: string }): TrackingEvent => ({
      name: 'readFeedPost',
      properties: {
        postId,
        title,
        author,
      },
      ...versionOne,
    }),
    shared: (postId: string, title: string, author: { id: string; name: string; role?: string }): TrackingEvent => ({
      name: 'sharedFeedPost',
      properties: {
        postId,
        title,
        author,
      },
      ...versionOne,
    }),
    feedPostCreateStart: {
      name: 'feedPostCreateStart',
      ...versionOne,
    },
    viewSummary: (
      totalElements: number,
      feedPosts: number,
      spacePosts: number,
      goodNews: number,
      insights: number,
      volunteering: number
    ): TrackingEvent => ({
      name: 'feedViewSummary',
      properties: { totalElements, feedPosts, spacePosts, goodNews, insights, volunteering },
      ...versionOne,
    }),
  }

  export const Spaces = {
    followSpaceButtonPressed: (spaceId: string, isLoggedIn: boolean): TrackingEvent => ({
      name: 'followSpaceButtonPressed',
      properties: { spaceId, isLoggedIn },
      ...versionOne,
    }),

    joinSpaceButtonPressed: (spaceId: string, isLoggedIn: boolean): TrackingEvent => ({
      name: 'joinSpaceButtonPressed',
      properties: { spaceId, isLoggedIn },
      ...versionOne,
    }),

    User: {
      followed: (spaceId: string): TrackingEvent => ({
        name: 'userFollowedSpace',
        properties: { spaceId },
        ...versionOne,
      }),

      unfollowed: (spaceId: string): TrackingEvent => ({
        name: 'userUnfollowedSpace',
        properties: { spaceId },
        ...versionOne,
      }),

      left: (spaceId: string): TrackingEvent => ({
        name: 'userLeftSpace',
        properties: { spaceId },
        ...versionOne,
      }),

      gotAdminRights: (spaceId: string) => ({
        name: 'userGotSpaceAdminRights',
        properties: { spaceId },
        ...versionOne,
      }),

      lostAdminRights: (spaceId: string) => ({
        name: 'userLostSpaceAdminRights',
        properties: { spaceId },
        ...versionOne,
      }),

      wasRemoved: (spaceId: string) => ({
        name: 'userWasRemovedFromSpace',
        properties: { spaceId },
        ...versionOne,
      }),
    },

    Invitation: {
      sent: (spaceId: string): TrackingEvent => ({
        name: 'spaceInvitationSent',
        properties: { spaceId },
        ...versionOne,
      }),

      accepted: (spaceId: string): TrackingEvent => ({
        name: 'spaceInvitationAccepted',
        properties: { spaceId },
        ...versionOne,
      }),

      rejected: (spaceId: string): TrackingEvent => ({
        name: 'spaceInvitationRejected',
        properties: { spaceId },
        ...versionOne,
      }),

      withdrawn: (spaceId: string): TrackingEvent => ({
        name: 'spaceInvitationWithdrawn',
        properties: { spaceId },
        ...versionOne,
      }),
    },

    RequestToJoin: {
      sent: (spaceId: string): TrackingEvent => ({
        name: 'spaceRequestToJoinSent',
        properties: { spaceId },
        ...versionOne,
      }),

      accepted: (spaceId: string): TrackingEvent => ({
        name: 'spaceRequestToJoinAccepted',
        properties: { spaceId },
        ...versionOne,
      }),

      rejected: (spaceId: string): TrackingEvent => ({
        name: 'spaceRequestToJoinRejected',
        properties: { spaceId },
        ...versionOne,
      }),

      withdrawn: (spaceId: string): TrackingEvent => ({
        name: 'spaceRequestToJoinWithdrawn',
        properties: { spaceId },
        ...versionOne,
      }),
    },

    FileStorage: {
      accessed: (spaceId: string): TrackingEvent => ({
        name: 'spaceFileStorageAccessed',
        properties: { spaceId },
        ...versionOne,
      }),
    },

    LinkHub: {
      linkAdded: (spaceId: string, linkType: string): TrackingEvent => ({
        name: 'spaceLinkHubLinkAdded',
        properties: { spaceId, linkType },
        ...versionOne,
      }),
    },

    Onboarding: {
      updated: (spaceId: string): TrackingEvent => ({
        name: 'spaceOnboardingUpdated',
        properties: { spaceId },
        ...versionOne,
      }),
    },

    Profile: {
      externalLinkAdded: (spaceId: string): TrackingEvent => ({
        name: 'spaceProfileExternalLinkAdded',
        properties: { spaceId },
        ...versionOne,
      }),
    },
  }

  export const Donations = {
    pressed: (projectId: number | string): TrackingEvent => ({
      name: 'pressedDonateButton',
      properties: { projectId },
      ...versionOne,
    }),
  }

  export const Volunteering = {
    pressed: (
      engagementId: string,
      otherProperties: Record<string, string | number | string[] | undefined> = {}
    ): TrackingEvent => ({
      name: 'pressedVolunteeringEngagementButton',
      properties: { engagementId, ...otherProperties },
      ...versionOne,
    }),

    contacted: (
      engagementId: string,
      otherProperties: Record<string, string | number | string[] | undefined> = {}
    ): TrackingEvent => ({
      name: 'pressedVolunteeringContactButton',
      properties: { engagementId, ...otherProperties },
      ...versionOne,
    }),

    selfReportingFlow: {
      wantToDoIt: (
        engagementId: string,
        otherProperties: Record<string, string | number | undefined> = {}
      ): TrackingEvent => ({
        name: 'selfReportingFlow__wantToDoIt',
        properties: { engagementId, ...otherProperties },
        ...versionOne,
      }),

      contacted: (engagementId: string): TrackingEvent => ({
        name: 'selfReportingFlow__contacted',
        properties: { engagementId },
        ...versionOne,
      }),

      doing: (engagementId: string): TrackingEvent => ({
        name: 'selfReportingFlow__doing',
        properties: { engagementId },
        ...versionOne,
      }),
    },

    filterPillPressed: (
      filterCategory: 'location' | 'topics' | 'commitmentDurations' | 'commitmentLabels' | 'skills'
    ): TrackingEvent => ({
      name: 'filterPillPressed',
      properties: { filterCategory },
      ...versionOne,
    }),

    filterSelectionSaved: (
      filterCategory: 'location' | 'topics' | 'commitmentDurations' | 'commitmentLabels' | 'skills',
      selectedValues?: string | string[]
    ): TrackingEvent => ({
      name: 'filterSelectionSaved',
      properties: { filterCategory, selectedValues },
      ...versionOne,
    }),

    clearFiltersPressed: {
      name: 'clearFiltersPressed',
      ...versionOne,
    },
  }

  export const MyVolunteering = {
    pressed: (volunteeringId: string): TrackingEvent => ({
      name: 'pressedMyVolunteeringCard',
      properties: { volunteeringId },
      ...versionOne,
    }),
  }

  export const SpacePosts = {
    read: (postId: string, title: string, spaceId?: string): TrackingEvent => ({
      name: 'readSpacePost',
      properties: {
        spaceId,
        postId,
        title,
      },
      ...versionOne,
    }),
  }

  export namespace Auth {
    // Others
    export const RegisterButtonPressed: TrackingEvent = {
      name: 'registerButtonPressed',
      ...versionOne,
    }
    export const SocialRegisterButtonPressed = (provider: string): TrackingEvent => ({
      name: 'socialRegisterButtonPressed',
      ...versionOne,
      properties: {
        provider,
      },
    })

    export const LoginButtonPressed: TrackingEvent = {
      name: 'loginButtonPressed',
      ...versionOne,
    }
    export const SocialLoginButtonPressed = (provider: string): TrackingEvent => ({
      name: 'socialLoginButtonPressed',
      ...versionOne,
      properties: {
        provider,
      },
    })
    export const LoginCompleted: TrackingEvent = {
      name: 'loginCompleted',
      ...versionOne,
    }
    export const ContinueAsGuestButtonPressed: TrackingEvent = {
      name: 'continueAsGuestButtonPressed',
      ...versionOne,
    }
    export const ForgotPasswordButtonPressed: TrackingEvent = {
      name: 'forgotPasswordButtonPressed',
      ...versionOne,
    }
    export const ActivateAccountButtonPressed: TrackingEvent = {
      name: 'activateAccountButtonPressed',
      ...versionOne,
    }
    export const ResendEmailButtonPressed: TrackingEvent = {
      name: 'resendEmailButtonPressed',
      ...versionOne,
    }
  }

  export const ContentTranslated = (
    type: 'feed_post' | 'space_post' | 'comment' | 'reply',
    contentId: string
  ): TrackingEvent => ({
    name: 'content_translated',
    ...versionOne,
    properties: {
      type: type,
      contentId: contentId,
    },
  })

  type RecommendationProperties = {
    title?: string
    name?: string
    id?: string | number
    commitmentType?: string
    locationType?: string
    source?: string
    sourceSection?: 'Micro Action' | 'Volunteering' | 'Donations' // To be expanded when we add other recommended content types.
  }

  export const RecommendationPressed = (
    type: RecommendationType,
    itemId: string,
    index: number,
    otherProperties: RecommendationProperties
  ): TrackingEvent => ({
    name: 'recommendation_pressed',
    ...versionOne,
    properties: {
      type: type,
      itemId: itemId,
      index: index,
      ...otherProperties,
    },
  })

  export const RecommendationViewed = (
    type: RecommendationType | 'challenges',
    otherProperties: RecommendationProperties
  ): TrackingEvent => ({
    ...versionOne,
    name: 'recommendation_viewed',
    properties: {
      type,
      ...otherProperties,
    },
  })

  export namespace InsightCard {
    export const CardPressed = (insightId: string, title: string): TrackingEvent => ({
      name: 'insightCard_pressed',
      properties: {
        insightId,
        title,
      },
      ...versionOne,
    })
    export const CardViewed = (insightId: string, title: string): TrackingEvent => ({
      name: 'insightCard_viewed',
      properties: {
        insightId,
        title,
      },
      ...versionOne,
    })
  }

  export const InsightDetailPage = {
    viewed: (insightId: string, title: string): TrackingEvent => ({
      name: 'insightDetailPage_viewed',
      properties: { insightId, title },
      ...versionOne,
    }),
  }

  export namespace ChallengeCard {
    export const CardPressed = (challengeId: string, title: string, index: number, screen: string): TrackingEvent => ({
      name: 'challengeCard_pressed',
      properties: {
        title,
        challengeId,
        index,
        screen,
      },
      ...versionOne,
    })

    export const SubmissionPressed = (
      challengeId: string,
      title: string,
      submissionId: string,
      submissionIndex: number,
      screen: string
    ): TrackingEvent => ({
      name: 'challengeCardSubmission_pressed',
      properties: {
        challengeId,
        title,
        submissionId,
        submissionIndex,
        screen,
      },
      ...versionOne,
    })

    export const AllChallengesVisited = (screen: string, component: string): TrackingEvent => ({
      name: 'allChallengesVisited',
      properties: {
        screen,
        component,
      },
      ...versionOne,
    })
  }

  export const OnboardingStepCompleted = (
    step: 'welcome' | 'contentSelection' | 'locationSelection' | 'interestsSelection' | 'skillsSelection',
    answers: string[],
    buttonPressed: 'continue' | 'skip' | 'back'
  ): TrackingEvent => ({
    name: 'onboardingStepCompleted',
    properties: {
      step,
      answers,
      buttonPressed,
    },
    ...versionOne,
  })

  export const SignupStepCompleted = (
    properties:
      | {
          step: 'emailAndPassword'
          answer: 'signUp' | 'continueAsGuest' | 'login'
        }
      | {
          step: 'verificationCode'
          answer: 'verifyAccount' | 'continueAsGuest'
        }
      | { step: 'name'; answer: 'continue' }
  ): TrackingEvent => ({
    name: 'signupStepCompleted',
    properties,
    ...versionOne,
  })

  export const SignUpModalPressed = (trigger: SignupModalPressedTrigger, answer: string): TrackingEvent => ({
    name: 'signUpModalPressed',
    properties: { trigger, answer },
    ...versionOne,
  })

  export namespace Chat {
    interface ChatMessageMetadataBase {
      roomId: string
      content: 'text' | 'file' | 'image'
    }

    interface ChatUserMessageMetadata extends ChatMessageMetadataBase {
      type: 'direct_message'
    }

    interface ChatSpaceMessageMetadata extends ChatMessageMetadataBase {
      type: 'space_message'
      spaceId: string
      spaceName: string
    }

    interface ChatSpaceTaskMessageMetadata extends ChatMessageMetadataBase {
      type: 'space_task_message'
      spaceId: string
      spaceName: string
      taskName: string
      taskId: string
    }

    type ChatMessageMetadata = ChatUserMessageMetadata | ChatSpaceMessageMetadata | ChatSpaceTaskMessageMetadata

    export const MessageSent = (metadata: ChatMessageMetadata): TrackingEvent => ({
      name: 'chatMessageSent',
      properties: {
        ...metadata,
      },
      ...versionOne,
    })
  }

  export const NotYetAvailableFeaturePressed = (feature: string): TrackingEvent => ({
    name: 'notYetAvailableFeaturePressed',
    properties: { feature },
    ...versionOne,
  })

  export const UserConnectionRequested = (requesterId: string, recipientId: string): TrackingEvent => ({
    name: 'userConnectionRequested',
    properties: { requesterId, recipientId },
    ...versionOne,
  })

  export const UserConnectionAccepted = (requesterId: string, recipientId: string): TrackingEvent => ({
    name: 'userConnectionAccepted',
    properties: { requesterId, recipientId },
    ...versionOne,
  })

  export const UserConnectionRejected = (requesterId: string, recipientId: string): TrackingEvent => ({
    name: 'userConnectionRejected',
    properties: { requesterId, recipientId },
    ...versionOne,
  })

  export const UserConnectionRevoked = (requesterId: string, recipientId: string): TrackingEvent => ({
    name: 'userConnectionRevoked',
    properties: { requesterId, recipientId },
    ...versionOne,
  })

  export const PollVoteSubmitted = (pollId: string, type: 'regular' | 'good_deed'): TrackingEvent => ({
    name: 'pollVoteSubmitted',
    properties: { pollId, type },
    ...versionOne,
  })

  export const UserProfile = {
    editPressed: (): TrackingEvent => ({
      name: 'userProfileEdit_pressed',

      ...versionOne,
    }),
    completionDismissed: (page: 'profile' | 'home_feed'): TrackingEvent => ({
      name: 'userProfile_Completion_dismissed',
      properties: {
        page: page,
      },
      ...versionOne,
    }),
    globalGoodDeedsTabOpened: (): TrackingEvent => ({
      name: 'userProfile_GlobalGoodDeedsTab_opened',
      ...versionOne,
    }),
    myVolunteerTabOpened: (): TrackingEvent => ({
      name: 'userProfile_MyVolunteerTab_opened',
      ...versionOne,
    }),
    moreTabOpened: (): TrackingEvent => ({
      name: 'userProfile_MoreTab_opened',
      ...versionOne,
    }),
    favoritesSubpageOpened: (): TrackingEvent => ({
      name: 'userProfile_FavoritesSubpage_opened',
      ...versionOne,
    }),
    profileSubpageOpened: (): TrackingEvent => ({
      name: 'userProfile_ProfileSubpage_opened',
      ...versionOne,
    }),
    postsSubpageOpened: (): TrackingEvent => ({
      name: 'userProfile_PostsSubpage_opened',
      ...versionOne,
    }),
    spacesSubpageOpened: (): TrackingEvent => ({
      name: 'userProfile_SpacesSubpage_opened',
      ...versionOne,
    }),
    connectionsSubpageOpened: (): TrackingEvent => ({
      name: 'userProfile_ConnectionsSubpage_opened',
      ...versionOne,
    }),
  }

  export const NotificationPreferenceChanged = (
    workflowId: string,
    workflowName: string,
    channel: Channel,
    newState: boolean
  ): TrackingEvent => ({
    ...versionOne,
    name: 'notificationPreferenceChanged',
    properties: {
      workflowId,
      channel,
      newState,
    },
  })
}

export const Unknown: TrackingEvent = {
  name: 'unknown',
  ...versionOne,
}
