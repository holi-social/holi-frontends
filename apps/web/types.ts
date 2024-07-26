import type { Ni18nServerState } from 'ni18n'
import type { PostHogOptions } from 'posthog-node'

import type { SeoUrls } from '@holi/core/components/HoliHead/types'

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
const POSTHOG_BOOTSTRAP_PROP_NAME = '__POSTHOG_BOOTSTRAP__'

export interface CustomProps {
  seoTitle?: string
  urls?: SeoUrls
  blockIndexing?: boolean
}

export interface NextJSPageProps extends Ni18nServerState, Record<string, unknown> {
  origin?: string
  locale?: string
  customProps?: Partial<CustomProps>
  [APOLLO_STATE_PROP_NAME]?: Record<string, unknown>
  [POSTHOG_BOOTSTRAP_PROP_NAME]?: PostHogOptions['bootstrap']
}

type PagePropsOverrides = Pick<NextJSPageProps, 'origin' | 'locale' | 'customProps'> & {
  translations?: Ni18nServerState
  apolloState?: Record<string, unknown>
  posthogBootstrapValues?: PostHogOptions['bootstrap']
}

export class HoliPageProps {
  props: Partial<NextJSPageProps> = {}

  constructor(pageProps: Partial<NextJSPageProps> | { props?: Partial<NextJSPageProps> } = {}) {
    this.props = pageProps.props || pageProps
  }

  static from(overrides: PagePropsOverrides) {
    return new HoliPageProps().with(overrides)
  }

  with({ translations, apolloState, posthogBootstrapValues, ...overrides }: PagePropsOverrides) {
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

  get customProps() {
    return this.props.customProps
  }

  get origin() {
    return this.props.origin
  }
}
