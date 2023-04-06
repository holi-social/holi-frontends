import React from 'react'
import { StyleSheet, View } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type NoDataCardProps = {
  image: StaticImageData
  title: string | undefined
  description: string | undefined
  buttonLabel?: string | undefined
  onPress?: () => void
}
const NoDataCard: React.VFC<NoDataCardProps> = ({
  image,
  title,
  description,
  buttonLabel,
  onPress,
}: NoDataCardProps) => {
  const imageWidth = 251

  return (
    <View style={styles.noDataContainer}>
      <HoliLocalImage
        imageSource={image}
        width={imageWidth}
        height={imageWidth * 0.6}
        label={''}
        isSvg={true}
        resizeMode="stretch"
        style={styles.illustration}
      />
      <HoliText size="small">{title}</HoliText>
      <HoliText size="large" style={styles.noDataDescription}>
        {description}
      </HoliText>
      {buttonLabel && (
        <HoliButton label={buttonLabel} onPress={onPress} style={styles.button}>
          <HoliText>{buttonLabel}</HoliText>
        </HoliButton>
      )}
    </View>
  )
}

export default NoDataCard

const styles = StyleSheet.create({
  noDataContainer: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background30,
    backgroundColor: colors.background10,
    margin: 24,
    padding: 24,
    alignItems: 'center',
  },
  illustration: {
    marginTop: 32,
    marginBottom: 24,
  },
  noDataDescription: { textAlign: 'center', marginTop: 8, color: colors.foreground30 },
  button: {
    marginTop: 24,
  },
})
