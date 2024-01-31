import { I18nProps } from '@holi/web/helpers/addTranslations'
import { ApolloStateProps } from '@holi/web/helpers/useApolloSSRClient'

export type NextJSPageProps = ApolloStateProps & I18nProps
