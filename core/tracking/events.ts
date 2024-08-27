/* eslint-disable @typescript-eslint/no-namespace */

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
  export const Engaging = {
    reacted: (reactableType: string, reactableId: string): TrackingEvent => ({
      name: 'reacted',
      properties: {
        reactableType,
        reactableId,
      },
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
    }),
    commented: (commentableType: string, commentableId: string): TrackingEvent => ({
      name: 'commented',
      properties: {
        commentableType,
        commentableId,
      },
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
    }),
  }

  export const FeedPosts = {
    created: {
      name: 'createdFeedPost',
      ...versionOne,
    },
    read: (postId: string): TrackingEvent => ({
      name: 'readFeedPost',
      properties: {
        postId,
      },
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
    }),
    shared: (postId: string): TrackingEvent => ({
      name: 'sharedFeedPost',
      properties: {
        postId,
      },
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
    }),
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
    created: (spaceId?: string): TrackingEvent => ({
      name: 'createdSpacePost',
      properties: { spaceId },
      ...versionOne,
    }),
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
    export const CommunityGuidelinesOnboardingStepCompleted: TrackingEvent = {
      name: 'communityGuidelinesOnboardingStepCompleted',
      ...versionOne,
    }
    export const InterestsOnboardingStepSkipped: TrackingEvent = {
      name: 'interestsOnboardingStepSkipped',
      ...versionOne,
    }
    export const LocationOnboardingStepSkipped: TrackingEvent = {
      name: 'locationOnboardingStepSkipped',
      ...versionOne,
    }
    export const PrivacyPolicyOnboardingStepCompleted: TrackingEvent = {
      name: 'privacyPolicyOnboardingStepCompleted',
      ...versionOne,
    }
    export const SuccessOnboardingStepCompleted: TrackingEvent = {
      name: 'successOnboardingStepCompleted',
      ...versionOne,
    }
  }

  export const ContentTranslated = (
    type: 'feed_post' | 'space_post' | 'comment' | 'reply',
    contentId: string
  ): TrackingEvent => ({
    name: 'content_translated',
    event_version__major: 1,
    event_version__minor: 0,
    event_version__patch: 0,
    properties: {
      type: type,
      contentId: contentId,
    },
  })

  export const RecommendationPressed = (
    type: 'space' | 'donation' | 'volunteering_opportunity' | 'goodnews',
    itemId: string,
    index: number
  ): TrackingEvent => ({
    name: 'recommendation_pressed',
    event_version__major: 1,
    event_version__minor: 0,
    event_version__patch: 0,
    properties: {
      type: type,
      itemId: itemId,
      index: index,
    },
  })

  export namespace InsightCard {
    export const CardPressed = (insightId: string): TrackingEvent => ({
      name: 'insightCard_pressed',
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
      properties: {
        insightId: insightId,
      },
    })
  }

  export namespace ChallengeCard {
    export const CardPressed = (challengeId: string, index: number): TrackingEvent => ({
      name: 'challengeCard_pressed',
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
      properties: {
        challengeId: challengeId,
        index: index,
      },
    })

    export const SubmissionPressed = (
      challengeId: string,
      submissionId: string,
      submissionIndex: number
    ): TrackingEvent => ({
      name: 'challengeCardSubmission_pressed',
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
      properties: {
        challengeId: challengeId,
        submissionId: submissionId,
        submissionIndex: submissionIndex,
      },
    })
  }
}
