import React, { useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { ReportCategory } from '@holi/core/screens/report/types'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

type CreateReportDetailsProps = {
  category: ReportCategory
}

const CreateReportDetails = ({ category }: CreateReportDetailsProps) => {
  const [description, setDescription] = useState('')

  return (
    <View style={styles.container}>
      <HoliHeading>You&apos;re reporting {category.title}</HoliHeading>
      <View style={styles.reportDetails}>
        <HoliText>{category.description}</HoliText>
        <HoliText color={'gray300'}>Example: |Example Text|</HoliText>
      </View>
      <View style={styles.descriptionContainer}>
        <HoliText>Description</HoliText>
        <HoliTextInput
          aria-label="Description"
          placeholder="Please provide additional information"
          value={description}
          onChange={setDescription}
          maxNoOfVisibleLines={14}
          style={styles.descriptionInput}
        />
      </View>
    </View>
  )
}

export default CreateReportDetails

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      native: {
        paddingTop: 46,
      },
    }),
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#BFBEBE',
  },
  cardContainer: {
    paddingVertical: 16,
  },
  textContainer: {
    ...Platform.select({
      web: {
        flexWrap: 'wrap',
        flex: 1,
      },
    }),
  },
  reportDetails: {
    marginTop: 16,
    marginBottom: 24,
    gap: 8,
  },
  descriptionInput: {
    marginTop: 8,
    height: 280,
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 24,
    flex: 1,
  },
})
