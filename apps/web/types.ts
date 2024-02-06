import { I18nProps } from '@holi/web/helpers/addTranslations'
import { ApolloStateProps } from '@holi/web/helpers/useApolloSSRClient'

export interface NextJSPageProps extends ApolloStateProps, I18nProps, Record<string, unknown> {}
