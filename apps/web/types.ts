import type { Ni18nServerState } from 'ni18n'
import type { PostHogOptions } from 'posthog-node'

import type { SeoUrls } from '@holi/core/components/HoliHead/types'

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
const POSTHOG_BOOTSTRAP_PROP_NAME = '__POSTHOG_BOOTSTRAP__'
const USER_PROP_NAME = '__USER__'

export interface CustomProps {
  seoTitle?: string
  urls?: SeoUrls
  blockIndexing?: boolean
}

export interface UserPageProps {
  id?: string
  isLoggedOut: boolean
}

export interface NextJSPageProps extends Ni18nServerState, Record<string, unknown> {
  origin?: string
  locale?: string
  customProps?: Partial<CustomProps>
  [APOLLO_STATE_PROP_NAME]?: Record<string, unknown>
  [POSTHOG_BOOTSTRAP_PROP_NAME]?: PostHogOptions['bootstrap']
  [USER_PROP_NAME]?: UserPageProps
}

type PagePropsOverrides = Pick<NextJSPageProps, 'origin' | 'locale' | 'customProps'> & {
  translations?: Ni18nServerState
  apolloState?: Record<string, unknown>
  posthogBootstrapValues?: PostHogOptions['bootstrap']
  user?: UserPageProps
}

export class HoliPageProps {
  props: Partial<NextJSPageProps> = {}

  constructor(pageProps: Partial<NextJSPageProps> | { props?: Partial<NextJSPageProps> } = {}) {
    this.props = pageProps.props || pageProps
  }

  static from(overrides: PagePropsOverrides) {
    return new HoliPageProps().with(overrides)
  }

  with({ translations, apolloState, posthogBootstrapValues, user, ...overrides }: PagePropsOverrides) {
    const newProps: Partial<NextJSPageProps> = {
      ...overrides,
      ...translations,
    }
    if (apolloState) {
      newProps[APOLLO_STATE_PROP_NAME] = apolloState
    }
    if (posthogBootstrapValues) {
      newProps[POSTHOG_BOOTSTRAP_PROP_NAME] = posthogBootstrapValues
    }
    if (user) {
      newProps[USER_PROP_NAME] = user
    }

    return new HoliPageProps({
      ...this.props,
      ...newProps,
    })
  }

  get apolloState() {
    return this.props[APOLLO_STATE_PROP_NAME]
  }

  get posthogBootstrapValues() {
    return this.props[POSTHOG_BOOTSTRAP_PROP_NAME]
  }

  get user() {
    return this.props[USER_PROP_NAME]
  }

  get customProps() {
    return this.props.customProps
  }

  get origin() {
    return this.props.origin
  }

  get locale() {
    return this.props.locale
  }
}
