import { VolunteeringRecoCard } from '@holi-apps/volunteering/components/VolunteeringRecoCard'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { useRecoCardWidth } from '@holi/core/helpers/useRecoCardWidth'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { withProfiler } from '@sentry/react'
import { Stack } from 'holi-bricks/components/stack'
import { Spacing } from 'holi-bricks/foundations'
import type React from 'react'
import { FlatList } from 'react-native'

export const MAX_RECOS_COUNT = 4

type VolunteeringSimilarRecosProps = {
  recos: LocalizedTypesenseDocument[]
}

const VolunteeringSimilarRecosSlider: React.FC<VolunteeringSimilarRecosProps> = ({
  recos,
}: VolunteeringSimilarRecosProps) => {
  const recosToRender = recos.slice(0, MAX_RECOS_COUNT)
  const { width: screenWidth } = useClientWindowDimensions()
  const horizontal = screenWidth >= dimensions.breakpointL
  const cardWidth = useRecoCardWidth()

  if (horizontal) {
    return (
      <FlatList
        horizontal
        contentContainerStyle={{ gap: Spacing['3xs'] }}
        data={recosToRender}
        renderItem={(info) => <VolunteeringRecoCard engagement={info.item} index={info.index} fixedWidth={cardWidth} />}
      />
    )
  }

  return (
    <Stack gap="3xs">
      {recosToRender.map((reco, index) => (
        <VolunteeringRecoCard key={reco.id} engagement={reco} index={index} />
      ))}
    </Stack>
  )
}

export default withProfiler(VolunteeringSimilarRecosSlider, { name: 'VolunteeringRecos' })
