import React, { SyntheticEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleSheet, ViewStyle } from 'react-native'

import HeartFilled from '@holi/ui/assets/img/icons/Heart_24x24_filled.svg'
import HeartOutlined from '@holi/ui/assets/img/icons/Heart_24x24_outlined.svg'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type MouseEnterOutEvent = SyntheticEvent<Element, SyntheticEvent<Element, MouseEvent>>

export interface HoliReactionsCountProps {
  type: 'post' | 'comment'
  fullName?: string
  count?: number
  active?: boolean
  onPress?: (event: SyntheticEvent | GestureResponderEvent) => void
  onMouseEnter?: (event: MouseEnterOutEvent) => void
  onMouseOut?: (event: MouseEnterOutEvent) => void
  style?: ViewStyle
  testID?: string
}

const HoliReactionsCount: React.VFC<HoliReactionsCountProps> = ({
  type,
  fullName,
  count = 0,
  active = false,
  onPress = () => null,
  onMouseEnter = () => null,
  onMouseOut = () => null,
  style,
  testID,
}) => {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(false)

  const notActiveText = fullName
    ? t(`insights.reactions.${type}.like`, { name: fullName })
    : t(`insights.reactions.${type}.like.noUser`)
  const activeText = t(`insights.reactions.${type}.unlike`)
  const labelText = active ? activeText : notActiveText

  const onNativeMouseEnter = useCallback(
    (event: MouseEnterOutEvent) => {
      setHovered(true)
      onMouseEnter?.(event)
    },
    [onMouseEnter, setHovered]
  )

  const onNativeMouseOut = useCallback(
    (event: MouseEnterOutEvent) => {
      setHovered(false)
      onMouseOut?.(event)
    },
    [onMouseOut, setHovered]
  )

  return (
    <HoliButton
      label={labelText}
      onPress={onPress}
      onMouseEnter={onNativeMouseEnter}
      onMouseOut={onNativeMouseOut}
      transparent
      style={[styles.outer, style]}
      contentStyle={styles.container}
      testID={testID}
    >
      <HoliText
        selectable={false}
        style={[styles.text, (active || hovered) && { color: 'black' }]}
        testID={`${testID}-counter`}
      >
        {count}
      </HoliText>
      <HoliLocalImage
        imageSource={HeartFilled}
        width={24}
        height={24}
        label={labelText}
        isSvg
        style={!(active || hovered) && { display: 'none' }}
      />

      <HoliLocalImage
        imageSource={HeartOutlined}
        width={24}
        height={24}
        label={labelText}
        isSvg
        style={(active || hovered) && { display: 'none' }}
      />
    </HoliButton>
  )
}

export default HoliReactionsCount

const styles = StyleSheet.create({
  outer: {
    width: 'auto',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: colors.foreground20,
    lineHeight: 24,
    marginBottom: -2,
  },
})
