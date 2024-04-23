import { Platform } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Initiative } from '@holi/core/screens/insights/types'

const useInitiativeLinkNavigation = (initiative: Initiative, insightId: string) => {
  const { navigate: _navigate } = useRouting()

  const holiLinkRegex = /^(https:\/\/(app\.holi\.social|staging\.dev\.holi\.social)\/)/

  const isInternalLink = holiLinkRegex.test(initiative.link)

  const initiativeLink = Platform.OS !== 'web' ? initiative.link.replace(holiLinkRegex, '/') : initiative.link

  const navigate = () =>
    isInternalLink ? _navigate(initiativeLink) : _navigate(`/insights/${insightId}/initiatives/${initiative.id}`)

  return {
    navigate,
  }
}

export default useInitiativeLinkNavigation
