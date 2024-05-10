import type { I18nProps } from '@holi/web/helpers/addTranslations'
import type { ApolloStateProps } from '@holi/web/helpers/useApolloSSRClient'

export interface CustomProps {
  seoTitle: string
}

interface ServerSideCustomProps {
  customProps: Partial<CustomProps>
}

export interface NextJSPageProps extends ApolloStateProps, I18nProps, ServerSideCustomProps, Record<string, unknown> {}
