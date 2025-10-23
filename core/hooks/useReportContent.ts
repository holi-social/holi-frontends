import { CombinedGraphQLErrors, type ApolloLink } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import type { ReportContentResponse } from '@holi/core/queries'
import { type ContentType, type ContentType3K, ReportContentMutation } from '@holi/core/queries'
import type { ReportReason } from '@holi/core/screens/report/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useCallback } from 'react'

export type UseReportContent = [boolean, (options?: useMutation.MutationFunctionOptions) => Promise<ApolloLink.Result>]

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
    onCompleted: () => {
      openToast(successMsg, HoliToastType.SUCCESS)
    },
    onError: (e) => {
      let isAlreadyReported = false
      let isOwnContent

      try {
        if (e instanceof CombinedGraphQLErrors) {
          isAlreadyReported = JSON.stringify(e.errors).includes('You have already reported')
          isOwnContent = JSON.stringify(e.errors).includes('You cannot report your own')
        }
      } catch (error) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
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

  const reportContentCallback = useCallback(
    () =>
      reportContent({
        variables: {
          objectId: id,
          contentType,
          moderationContentType: contentType3k,
          details,
          reason,
        },
      }),
    [reportContent, id, contentType, contentType3k, details, reason]
  )

  return [isLoading, reportContentCallback]
}

export default useReportContent
