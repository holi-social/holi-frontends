/* eslint-disable @typescript-eslint/no-namespace */
/**
 * The base type of all tracking events. `TrackingEvent` shall not be extended outside of this file to ensure this file
 * contains a complete reference of all tracking events.
 */
export abstract class TrackingEvent {
  /** The event name */
  public abstract name: string

  /** The screens name on which the event occurred. helps to identify the screen cross-platform so that events must not
   * be identified via both PostHog screen names (Mobile) and URLs (Web). */
  public abstract screen: string

  /** Additional properties that can be added to the event payload */
  public properties?: { [key: string]: unknown } = {}
}

/**
 * The `TrackingEvent` namespace contains all "custom tracking events" that can be sent to PostHog, thereby serving as
 * a *complete* reference. It contains sub-namespaces for the different screens of the application, each containing the
 * events that can be emitted by that screen.
 */
export namespace TrackingEvent {
  export namespace ProfileLoggedOut {
    export const RegisterButtonPressed = new (class extends TrackingEvent {
      name = 'registerButton_pressed'
      screen = 'profileLoggedOut'
    })()
    export const LoginButtonPressed = new (class extends TrackingEvent {
      name = 'loginButton_pressed'
      screen = 'profileLoggedOut'
    })()
  }
  export namespace OnboardingWelcome {
    export const RegisterButtonPressed = new (class extends TrackingEvent {
      name = 'registerButton_pressed'
      screen = 'onboardingWelcome'
    })()
    export const ContinueAsGuestButtonPressed = new (class extends TrackingEvent {
      name = 'continueAsGuestButton_pressed'
      screen = 'onboardingWelcome'
    })()
    export const LoginButtonPressed = new (class extends TrackingEvent {
      name = 'loginButton_pressed'
      screen = 'onboardingWelcome'
    })()
  }

  export namespace Registration {
    export const RegisterButtonPressed = new (class extends TrackingEvent {
      name = 'registerButton_pressed'
      screen = 'registration'
    })()
    export const LoginButtonPressed = new (class extends TrackingEvent {
      name = 'loginButton_pressed'
      screen = 'registration'
    })()
  }

  export namespace Login {
    export const LoginButtonPressed = new (class extends TrackingEvent {
      name = 'loginButton_pressed'
      screen = 'login'
    })()
    export const ForgotPasswordButtonPressed = new (class extends TrackingEvent {
      name = 'forgotPasswordButton_pressed'
      screen = 'login'
    })()
    export const RegisterButtonPressed = new (class extends TrackingEvent {
      name = 'registerButton_pressed'
      screen = 'login'
    })()
  }
  export namespace RecoverPassword {
    export const RegisterButtonPressed = new (class extends TrackingEvent {
      name = 'registerButton_pressed'
      screen = 'recoverPassword'
    })()
    export const LoginButtonPressed = new (class extends TrackingEvent {
      name = 'loginButton_pressed'
      screen = 'recoverPassword'
    })()
  }
}
