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
  export const SpaceAskQuestion = {
    askedQuestion: {
      name: 'askQuestionButton_pressed',
      ...versionOne,
    },
    startedConversation: {
      name: 'startConversationButton_pressed',
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
    read: (postId: string): TrackingEvent => ({
      name: 'readFeedPost',
      properties: {
        postId,
      },
      ...versionOne,
    }),
    shared: (postId: string): TrackingEvent => ({
      name: 'sharedFeedPost',
      properties: {
        postId,
      },
      ...versionOne,
    }),
    feedPostCreateStart: {
      name: 'feedPostCreateStart',
      ...versionOne,
    },
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
    pressed: (projectId: number): TrackingEvent => ({
      name: 'pressedDonateButton',
      properties: { projectId },
      ...versionOne,
    }),
  }

  export const Volunteering = {
    pressed: (engagementId: string): TrackingEvent => ({
      name: 'pressedVolunteeringEngagementButton',
      properties: { engagementId },
      ...versionOne,
    }),
  }

  export const SpacePosts = {
    read: (postId: string, spaceId?: string): TrackingEvent => ({
      name: 'readSpacePost',
      properties: {
        spaceId,
        postId,
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

    export const LoginButtonPressed: TrackingEvent = {
      name: 'loginButtonPressed',
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

  export const RecommendationPressed = (type: RecommendationType, itemId: string, index: number): TrackingEvent => ({
    name: 'recommendation_pressed',
    ...versionOne,
    properties: {
      type: type,
      itemId: itemId,
      index: index,
    },
  })

  export const RecommendationViewed = (
    type: RecommendationType | 'challenge',
    otherProperties: Record<string, string | number>
  ): TrackingEvent => ({
    ...versionOne,
    name: 'recommendation_viewed',
    properties: {
      type,
      ...otherProperties,
    },
  })

  export namespace InsightCard {
    export const CardPressed = (insightId: string): TrackingEvent => ({
      name: 'insightCard_pressed',
      properties: {
        insightId: insightId,
      },
      ...versionOne,
    })
    export const CardViewed = (insightId: string): TrackingEvent => ({
      name: 'insightCard_viewed',
      properties: {
        insightId: insightId,
      },
      ...versionOne,
    })
  }

  export namespace ChallengeCard {
    export const CardPressed = (challengeId: string, index: number): TrackingEvent => ({
      name: 'challengeCard_pressed',
      properties: {
        challengeId: challengeId,
        index: index,
      },
      ...versionOne,
    })

    export const SubmissionPressed = (
      challengeId: string,
      submissionId: string,
      submissionIndex: number
    ): TrackingEvent => ({
      name: 'challengeCardSubmission_pressed',
      properties: {
        challengeId: challengeId,
        submissionId: submissionId,
        submissionIndex: submissionIndex,
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
      | { step: 'emailAndPassword'; answer: 'signUp' | 'continueAsGuest' | 'login' }
      | { step: 'verificationCode'; answer: 'verifyAccount' | 'continueAsGuest' }
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

  export const NotYetAvailableFeaturePressed = (feature: string): TrackingEvent => ({
    name: 'notYetAvailableFeaturePressed',
    properties: { feature },
    ...versionOne,
  })
}

export const Unknown: TrackingEvent = {
  name: 'unknown',
  ...versionOne,
}
