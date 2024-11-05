import type { FetchResult, MutationFunctionOptions } from '@apollo/client'
import { useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import type { ReportContentResponse } from '@holi/core/queries'
import { ContentType, ContentType3K, ReportContentMutation } from '@holi/core/queries'
import { ReportReason } from '@holi/core/screens/report/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export type UseReportContent = [boolean, (options?: MutationFunctionOptions) => Promise<FetchResult>]

export interface UseReportContentProps {
  id: string
  contentType: ContentType
  contentType3k: ContentType3K
  successMsg: string
  reason: ReportReason
  details?: string
}

const useReportContent = ({
  id,
  contentType,
  contentType3k,
  successMsg,
  details = 'no details',
  reason,
}: UseReportContentProps): UseReportContent => {
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()

  const [reportContent, { loading: isLoading }] = useMutation<ReportContentResponse>(ReportContentMutation, {
    variables: {
      objectId: id,
      contentType,
      moderationContentType: contentType3k,
      details,
      reason,
    },
    onCompleted: () => {
      openToast(successMsg, HoliToastType.SUCCESS)
    },
    onError: (e) => {
      let isAlreadyReported = false
      let isOwnContent

      try {
        isAlreadyReported = JSON.stringify(e.graphQLErrors).includes('You have already reported this post')
        isOwnContent = JSON.stringify(e.graphQLErrors).includes('You cannot report your own')
      } catch (error) {
        // ignore
      }

      displayError(e, 'Failed to report content', {
        location: 'useReportContent',
        id,
        contentType,
        ...((isAlreadyReported || isOwnContent) && {
          displayMessage: t(
            isAlreadyReported ? 'global.report.alreadyReportedMessage' : 'global.report.ownContentMessage'
          ),
        }),
      })
    },
  })

  return [isLoading, reportContent]
}

export default useReportContent
