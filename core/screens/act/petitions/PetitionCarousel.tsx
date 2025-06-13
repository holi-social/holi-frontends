import React, { useState } from 'react'
import RecoSlider from '@holi/core/components/RecoSlider'
import { useTranslation } from 'react-i18next'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import PetitionCard from '@holi/core/screens/act/petitions/PetitionCard'
import { CalendarEventFilled } from '@holi/icons/src/generated'
import petitions from './petitions.json'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { TrackingEvent } from '@holi/core/tracking'

type PetitionCarouselProps = {
  cardWidth: number
}

const PetitionCarousel = ({ cardWidth }: PetitionCarouselProps) => {
  const { t } = useTranslation()
  const user = useLoggedInUser()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  if (!petitions) return

  return (
    <>
      <RecoSlider
        name="petitions"
        renderItem={({ item }) => <PetitionCard petition={item} maxCardWidth={cardWidth} />}
        data={petitions}
        loading={user.isLoading}
        icon={CalendarEventFilled}
        heading={t('act.petitions.title')}
        subline={t('act.petitions.subline')}
        labelSeeMore={t('act.petitions.showAll')}
        cardWidth={cardWidth}
        size="sm"
        onPressSeeMore={() => setShowConfirmationModal(true)}
        seeMoreTrackingEvent={TrackingEvent.Petitions.seeAll}
      />
      <HoliConfirmation
        show={showConfirmationModal}
        label={t('act.petitions.seeAllModal.title')}
        title={t('act.petitions.seeAllModal.title')}
        description={t('act.petitions.seeAllModal.description')}
        secondaryButtonVariant="primary"
        secondaryText={t('global.gotIt')}
        onDismiss={() => setShowConfirmationModal(false)}
      />
    </>
  )
}

export default PetitionCarousel
