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

  export const Posts = {
    created: (spaceId?: string): TrackingEvent => ({
      name: 'createdPost',
      properties: { spaceId },
      ...versionOne,
    }),
    read: (postId: string): TrackingEvent => ({
      name: 'readPost',
      properties: {
        postId,
      },
      ...versionOne,
    }),
  }

  export namespace Auth {
    export const RegisterButtonPressed: TrackingEvent = {
      name: 'registerButton_pressed',
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
    }
    export const LoginButtonPressed: TrackingEvent = {
      name: 'loginButton_pressed',
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
    }
    export const ContinueAsGuestButtonPressed: TrackingEvent = {
      name: 'continueAsGuestButton_pressed',
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
    }
    export const ForgotPasswordButtonPressed: TrackingEvent = {
      name: 'forgotPasswordButton_pressed',
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
    }
  }

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
