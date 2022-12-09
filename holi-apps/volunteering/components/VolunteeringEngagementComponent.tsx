import React from 'react'
import { View } from 'react-native'

import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLink from '@holi/ui/components/molecules/HoliLink'

import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringEngagementComponentProps = {
  engagement: VolunteeringEngagement
}

const VolunteeringEngagementComponent: React.VFC<VolunteeringEngagementComponentProps> = (props) => {
  const constrainedListing = (strings: string[]) =>
    strings.length > 3 ? `${strings.slice(0, 3).join(',')}, ... (${strings.length - 3} more)` : strings.join(',')
  const engagement = props.engagement
  return (
    <View testID="volunteering-list-item" style={{ paddingBottom: 20 }}>
      <HoliText size={'large'}>Title: {engagement.title}</HoliText>
      <HoliText>Description: {engagement.description}</HoliText>
      <HoliText>
        Link:{' '}
        <HoliLink href={engagement.link} external label={'Link'}>
          {engagement.link}
        </HoliLink>
      </HoliText>
      {engagement.image && (
        <HoliImage
          source={{ uri: engagement.image }}
          label={engagement.imageOrga || 'Image organization'}
          style={{
            height: 100,
            width: 'auto',
          }}
        />
      )}
      <HoliText>Source: {engagement.source}</HoliText>
      {engagement.uses.length > 0 && <HoliText>Uses: {constrainedListing(engagement.uses)}</HoliText>}
      {engagement.hashTags.length > 0 && <HoliText>HashTags: {constrainedListing(engagement.hashTags)}</HoliText>}
      <HoliText>Orga: {engagement.orga}</HoliText>
      {engagement.imageOrga && <HoliText>ImageOrga: {engagement.imageOrga}</HoliText>}
      {engagement.location && <HoliText>Location: {engagement.location}</HoliText>}
      {engagement.latitude && <HoliText>Latitude: {engagement.latitude}</HoliText>}
      {engagement.longitude && <HoliText>Longitude: {engagement.longitude}</HoliText>}
    </View>
  )
}

export default VolunteeringEngagementComponent
