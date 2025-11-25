import React from 'react'
import RecoSlider from '@holi/core/components/RecoSlider'
import { useTranslation } from 'react-i18next'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import PetitionCard from '@holi/core/screens/act/petitions/PetitionCard'
import { PencilFilled } from '@holi/icons/src/generated'
import { TrackingEvent } from '@holi/core/tracking'
import { usePetitions } from '@holi/core/screens/act/petitions/hooks/usePetitions'

const MAX_ITEMS_TO_DISPLAY = 5

type PetitionCarouselProps = {
  cardWidth: number
}

const PetitionCarousel = ({ cardWidth }: PetitionCarouselProps) => {
  const { t } = useTranslation()
  const user = useLoggedInUser()

  const { petitions, isLoading } = usePetitions({ displayErrors: true })

  if (isLoading || !petitions || petitions.length == 0) {
    return null
  }

  return (
    <>
      <RecoSlider
        name="petitions"
        renderItem={({ item }) => <PetitionCard petition={item} maxCardWidth={cardWidth} />}
        data={petitions.slice(0, MAX_ITEMS_TO_DISPLAY)}
        loading={user.isLoading}
        icon={PencilFilled}
        heading={t('act.petitions.title')}
        subline={t('act.petitions.subline')}
        seeAllPath="/petitions"
        seeMoreTrackingEvent={TrackingEvent.Petitions.seeAll}
      />
    </>
  )
}

export default PetitionCarousel
