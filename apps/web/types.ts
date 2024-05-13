import { SeoUrls } from '@holi/core/components/HoliHead/types'
import type { I18nProps } from '@holi/web/helpers/addTranslations'
import type { ApolloStateProps } from '@holi/web/helpers/useApolloSSRClient'

export interface CustomProps {
  seoTitle?: string
  urls?: SeoUrls
}

interface ServerSideCustomProps {
  customProps: Partial<CustomProps>
  origin: string
}

export interface NextJSPageProps extends ApolloStateProps, I18nProps, ServerSideCustomProps, Record<string, unknown> { }
