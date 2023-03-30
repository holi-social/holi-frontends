import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { SpaceByIdResponse, spacePostsQuery } from '@holi/core/screens/spaces/queries'
import { Space, SpaceConnectionType, Visibility } from '@holi/core/screens/spaces/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'

interface SpaceUpdatesViewProps {
  space: Space
}

const SpaceUpdatesView = ({ space }: SpaceUpdatesViewProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { error, data } = useQuery<SpaceByIdResponse>(spacePostsQuery, {
    variables: { idOrName: space.id, offset: 0, limit: 10, visibility: Visibility.ALL },
  })

  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const headline = isMember ? t('spaces.updates.noResults.headline.member') : t('spaces.updates.noResults.headline')

  if (error) {
    displayError(error, t('spaces.updates.error'))
  }

  return (
    <HoliBox padding={24}>
      {data?.spaceById.posts?.data.length === 0 ? (
        <HoliNoResults
          firstText={t('spaces.updates.noResults.tagline')}
          secondText={headline}
          media={
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/spaceUpdatesEmptyState.svg')}
              label=""
              height={203}
              width={279}
              isSvg
            />
          }
        />
      ) : (
        <></>
      )}
    </HoliBox>
  )
}

export default SpaceUpdatesView
