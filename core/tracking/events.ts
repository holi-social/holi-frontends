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
  export namespace PostCard {
    export const TitlePressed = (postId: string): TrackingEvent => ({
      name: 'postCard_pressed',
      version: '1.0',
      properties: {
        element: 'title',
        postId,
      },
    })
    export const TextPressed = (postId: string): TrackingEvent => ({
      name: 'postCard_pressed',
      version: '1.0',
      properties: {
        element: 'text',
        postId,
      },
    })
    export const AuthorPressed = (postId: string): TrackingEvent => ({
      name: 'postCard_pressed',
      version: '1.0',
      properties: {
        element: 'author',
        postId,
      },
    })
    export const ImagePressed = (postId: string): TrackingEvent => ({
      name: 'postCard_pressed',
      version: '1.0',
      properties: {
        element: 'image',
        postId,
      },
    })
    export const CommentNowPressed = (postId: string): TrackingEvent => ({
      name: 'postCard_pressed',
      version: '1.0',
      properties: {
        element: 'commentNow',
        postId,
      },
    })
    export const ReadMorePressed = (postId: string): TrackingEvent => ({
      name: 'postCard_pressed',
      version: '1.0',
      properties: {
        element: 'readMore',
        postId,
      },
    })
    export const ReadLessPressed = (postId: string): TrackingEvent => ({
      name: 'postCard_pressed',
      version: '1.0',
      properties: {
        element: 'readLess',
        postId,
      },
    })
    export const LinkPressed = (postId: string, url: string): TrackingEvent => ({
      name: 'postCard_pressed',
      version: '1.0',
      properties: {
        element: 'link',
        postId,
        url,
      },
    })
  }

  export namespace PostActionDrawer {
    export const Opened = (postId: string): TrackingEvent => ({
      name: 'postActionDrawer_opened',
      version: '1.0',
      properties: {
        postId,
      },
    })
    export const Closed = (postId: string): TrackingEvent => ({
      name: 'postActionDrawer_closed',
      version: '1.0',
      properties: {
        postId,
      },
    })
  }

  export namespace PostShare {
    export const Pressed = (postId: string): TrackingEvent => ({
      name: 'postShare_pressed',
      version: '1.0',
      properties: {
        postId,
      },
    })
    export const Shared = (postId: string): TrackingEvent => ({
      name: 'postShare_shared',
      version: '1.0',
      properties: {
        postId,
      },
    })
    export const Dismissed = (postId: string): TrackingEvent => ({
      name: 'postShare_dismissed',
      version: '1.0',
      properties: {
        postId,
      },
    })
  }

  export namespace PostReactions {
    export const ReactionPressed = (
      postId: string,
      props: { loggedIn: false } | { loggedIn: true; reactionType: string; reactionAction: string }
    ): TrackingEvent => ({
      name: 'postReaction_pressed',
      version: '1.0',
      properties: {
        postId: postId,
        reactionType: props.loggedIn ? props.reactionType : undefined,
        reactionAction: props.loggedIn ? props.reactionAction : undefined,
      },
    })
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
