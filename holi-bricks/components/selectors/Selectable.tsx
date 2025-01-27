import { ChipAction, type ChipActionProps } from 'holi-bricks/components/chips/ChipAction'
import { SelectorContext } from 'holi-bricks/components/selectors/Selector'
import type React from 'react'
import { useContext } from 'react'

import { SelectorCard, type SelectorCardProps } from './SelectorCard'
import type { GestureResponderEvent } from 'react-native'

export interface SelectableBaseProps {
  selected?: boolean
  onPress?: (event: GestureResponderEvent) => void | Promise<void>
  inputType?: string
}

export type SelectableProps<P extends SelectableBaseProps> = P & {
  id: string
}

const Selectable = <P extends SelectableBaseProps>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: SelectableProps<P>) => {
    const { contextOnPress, selectedOptions, inputType } = useContext(SelectorContext)

    const selected = !!selectedOptions[props.id]
    const handlePress = (event: GestureResponderEvent) => {
      props.onPress?.(event)
      contextOnPress?.(props.id)
    }

    return <Component selected={selected} onPress={handlePress} inputType={inputType} {...props} />
  }

  return WrappedComponent
}

export const SelectableCard = Selectable<SelectorCardProps>(SelectorCard)
export const SelectableChip = Selectable<ChipActionProps>(ChipAction)
