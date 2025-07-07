import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { Text } from 'holi-bricks/components/text/Text'
import { type LayoutProps, layoutStyle, Spacing } from 'holi-bricks/foundations'
import type React from 'react'
import { useCallback, useState } from 'react'
import { createContext } from 'react'
import { StyleSheet, View } from 'react-native'

import type { SelectorCardInputType } from './SelectorCard'

type OptionsState = { [key: string]: boolean }

type SelectorProps = AccessibilityProps &
  LayoutProps & {
    title?: string
    inputType?: SelectorCardInputType
    row?: boolean
    onSelect?: (id: string) => void
    onChange?: (selectedOptions: string[]) => void
    initiallySelectedOptions?: string[]
  }

type SelectorContextType = {
  selectedOptions: OptionsState
  contextOnPress?: (id: string) => void
  inputType?: SelectorCardInputType
}
export const SelectorContext = createContext<SelectorContextType>({
  selectedOptions: {},
  contextOnPress: undefined,
  inputType: 'radio',
})

export const Selector = ({
  title,
  children,
  inputType = 'radio',
  row = false,
  onChange,
  initiallySelectedOptions = [],
  onSelect,
  ...rest
}: React.PropsWithChildren<SelectorProps>) => {
  const initiallySelectedOptionsAsObject: OptionsState = Object.fromEntries(
    initiallySelectedOptions.map((option) => [option, true])
  )

  const [selectedOptions, setSelectedOptions] = useState<OptionsState>(initiallySelectedOptionsAsObject || {})

  const onPress = useCallback(
    (id: string) => {
      onSelect?.(id)
      const newSelectedOptions =
        inputType === 'radio' ? { [id]: true } : { ...selectedOptions, [id]: !selectedOptions[id] }
      const newSelectedOptionsAsStringArray = Object.keys(newSelectedOptions).filter((key) => newSelectedOptions[key])
      onChange?.(newSelectedOptionsAsStringArray)
      setSelectedOptions(newSelectedOptions)
    },
    [inputType, onChange, onSelect, selectedOptions]
  )

  return (
    <View {...accessibilityProps(rest)} style={[styles.container, layoutStyle(rest)]}>
      {title && <Text size="lg">{title}</Text>}
      <SelectorContext.Provider value={{ contextOnPress: onPress, selectedOptions, inputType }}>
        <View style={[styles.cardContainer, row && styles.row]}>{children}</View>
      </SelectorContext.Provider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: Spacing.xs,
  },
  cardContainer: {
    flex: 1,
    gap: Spacing.xxs,
  },
})
