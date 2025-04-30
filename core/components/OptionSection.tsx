import React from 'react'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliSwitch from '@holi/ui/components/molecules/HoliSwitch'
import { Pressable } from 'react-native'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Text, TextLink } from 'holi-bricks/components/text'

interface Props {
  title: string
  description: string
  value?: boolean
  onToggle: () => void
}

const OptionSection = ({ title, description, value = false, onToggle }: Props) => {
  const { styles } = useStyles(stylesheet)
  return (
    <HoliBox padding={[8, 16, 16, 16]}>
      <Pressable style={styles.option} onPress={onToggle}>
        <TextLink size="md">{title}</TextLink>

        <HoliGap direction="horizontal" size="s" />

        <HoliSwitch value={value} onChange={onToggle} />
      </Pressable>

      <HoliGap direction="vertical" size="xs" />

      <Text size="md">{description}</Text>
    </HoliBox>
  )
}

export default OptionSection

const stylesheet = createStyleSheet({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
})
