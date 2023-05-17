import { useMutation } from '@apollo/client'
import type { FetchResult, MutationFunctionOptions } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { logError } from '@holi/core/errors/helpers'
import { BlockUserMutation } from '@holi/core/queries'
import type { BlockUserResponse } from '@holi/core/queries'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export type UseBlockUser = [boolean, (options?: MutationFunctionOptions) => Promise<FetchResult>]

const useBlockUser = (userId: string, successMsg: string): UseBlockUser => {
  const { t } = useTranslation()
  const { openToast } = useToast()

  const [blockUser, { loading: isLoadingBlockUser }] = useMutation<BlockUserResponse>(BlockUserMutation, {
    variables: { userId },
    onCompleted: () => {
      openToast(successMsg, HoliToastType.SUCCESS)
    },
    onError: (e) => {
      openToast(t('global.technicalError'), HoliToastType.ERROR, 3000)
      logError(e, t('global.technicalError'))
    },
  })

  return [isLoadingBlockUser, blockUser]
}

export default useBlockUser
