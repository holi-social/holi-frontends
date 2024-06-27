/* eslint-disable @typescript-eslint/no-namespace */

/**
 * The base type of all tracking events. `TrackingEvent` instances shall not be defined outside of this file to ensure
 * this file contains a complete reference of all tracking events.
 */
export interface TrackingEvent {
  /** The event name */
  name: string

  /** The events version (must use semantic versioning) */
  version: string

  /** Additional properties that can be added to the event payload */
  properties?: { [key: string]: unknown }
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
      version: '1.0',
    }),
    commented: (commentableType: string, commentableId: string): TrackingEvent => ({
      name: 'commented',
      properties: {
        commentableType,
        commentableId,
      },
      version: '1.0',
    }),
  }

  export const FeedPosts = {
    created: {
      name: 'createdFeedPost',
      version: '1.0',
    },
    read: (postId: string): TrackingEvent => ({
      name: 'readFeedPost',
      properties: {
        postId,
      },
      version: '1.0',
    }),
    shared: (postId: string): TrackingEvent => ({
      name: 'sharedFeedPost',
      properties: {
        postId,
      },
      version: '1.0',
    }),
  }

  export namespace Auth {
    export const RegisterButtonPressed: TrackingEvent = {
      name: 'registerButton_pressed',
      version: '1.0',
    }
    export const LoginButtonPressed: TrackingEvent = {
      name: 'loginButton_pressed',
      version: '1.0',
    }
    export const ContinueAsGuestButtonPressed: TrackingEvent = {
      name: 'continueAsGuestButton_pressed',
      version: '1.0',
    }
    export const ForgotPasswordButtonPressed: TrackingEvent = {
      name: 'forgotPasswordButton_pressed',
      version: '1.0',
    }
  }

  export const RecommendationPressed = (
    type: 'space' | 'donation' | 'volunteering_opportunity' | 'goodnews',
    itemId: string,
    index: number
  ): TrackingEvent => ({
    name: 'recommendation_pressed',
    version: '1.0',
    properties: {
      type: type,
      itemId: itemId,
      index: index,
    },
  })

  export namespace InsightCard {
    export const CardPressed = (insightId: string): TrackingEvent => ({
      name: 'insightCard_pressed',
      version: '1.0',
      properties: {
        insightId: insightId,
      },
    })
  }

  export namespace ChallengeCard {
    export const CardPressed = (challengeId: string, index: number): TrackingEvent => ({
      name: 'challengeCard_pressed',
      version: '1.0',
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
      version: '1.0',
      properties: {
        challengeId: challengeId,
        submissionId: submissionId,
        submissionIndex: submissionIndex,
      },
    })
  }
}
