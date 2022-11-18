import { useNavigationContext } from '@holi/core/navigation/hooks/NavigationContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'

export const useUnifiedNavigation = () => {
  const context = useNavigationContext()
  const { navigate, navigateBack, replaceRoute, query } = useRouting()

  return {
    navigate,
    navigateBack,
    replaceRoute,
    query,
    ...context,
  }
}
