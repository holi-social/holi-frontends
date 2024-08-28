import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import HoliTranslate from '@holi/core/components/HoliTranslate'
import { Comment } from '@holi/core/screens/comments/types'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliTextProps } from '@holi/ui/components/atoms/HoliText'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'

type CommentTextProps = HoliTextProps & {
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
        text={text}
        users={comment.mentions || []}
        {...textProps}
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
