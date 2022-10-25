import { colors } from 'packages/ui/styles/globalVars'
import React from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export type SettingsItemProps = {
  label: string
  icon: string
  navigateTo?: string
  style?: StyleProp<ViewStyle>
}

const SettingsItem: React.VoidFunctionComponent<SettingsItemProps> = (props: SettingsItemProps) => {
  const { navigate } = useRouting()
  const disabled = !props.navigateTo

  return (
    <HoliButton
      label={props.label}
      inline
      disabled={disabled}
      onPress={() => (props.navigateTo ? navigate(props.navigateTo) : {})}
      transparent
      style={styles.settingsItem}
      contentStyle={{ alignItems: 'center', flexDirection: 'row' }}
    >
      <HoliIcon icon={props.icon} size={24} filled={false} style={disabled ? styles.disabled : {}} />
      <HoliText style={[styles.itemText, disabled ? styles.disabled : {}]}>{props.label}</HoliText>
      <HoliIcon icon="arrow-right-s" size={24} filled={false} style={disabled ? styles.disabled : {}} />
    </HoliButton>
  )
}

export default SettingsItem

const styles = StyleSheet.create({
  settingsItem: {
    marginVertical: 20,
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
  },
  disabled: {
    color: colors.fontColorGrey,
  },
})
