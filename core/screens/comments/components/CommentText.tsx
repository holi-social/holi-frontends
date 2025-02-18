import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import HoliTranslate from '@holi/core/components/HoliTranslate'
import type { Comment } from '@holi/core/screens/comments/types'
import { TrackingEvent } from '@holi/core/tracking'
import HoliRichTextOutput, { type HoliRichTextProps } from '@holi/ui/components/organisms/HoliRichTextOutput'

type CommentTextProps = Omit<HoliRichTextProps, 'text'> & {
  comment: Comment
  linkMentionsToProfile?: boolean
}

const CommentText = ({ comment, ...textProps }: CommentTextProps) => {
  const [loadingTranslation, setLoadingTranslation] = useState(false)
  const { i18n } = useTranslation()

  const [text, setText] = useState(comment.text)
  const isTranslatable = comment.language && comment.language !== i18n.language

  return (
    <>
      <HoliRichTextOutput
        {...textProps}
        text={text}
        users={comment.mentions || []}
        allowAllLinks
        loading={loadingTranslation}
        skeletonOptions={{ numberOfLines: 3 }}
        style={{ width: '100%' }}
      />
      {isTranslatable && (
        <HoliTranslate
          primaryText={{
            text,
            setText,
          }}
          loading={loadingTranslation}
          setLoading={setLoadingTranslation}
          trackingEvent={TrackingEvent.ContentTranslated('comment', comment.id)}
        />
      )}
    </>
  )
}

export default CommentText
