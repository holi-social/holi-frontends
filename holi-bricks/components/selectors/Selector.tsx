import { Spacing } from 'holi-bricks/tokens'
import React, { ReactElement, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import HoliText from '@holi/ui/components/atoms/HoliText'

import { SelectorCard, SelectorCardInputType } from './SelectorCard'

export interface SelectionElementProps {
  selected?: boolean
  onPress?: () => void
  id: string
}

type SelectorProps = {
  title?: string
  children: ReactElement<SelectionElementProps>[]
  inputType?: SelectorCardInputType
  row?: boolean
  onSelect?: (id: string) => void
  onChange?: (selectedOptions: string[]) => void
  initiallySelectedOptions?: string[]
}

export const Selector = ({
  title,
  children,
  inputType,
  row = false,
  onSelect,
  onChange,
  initiallySelectedOptions,
}: SelectorProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  useEffect(() => {
    children.forEach((child) => {
      if (initiallySelectedOptions?.includes(child.props.id)) {
        setSelectedOptions((prevOptions) => [...prevOptions, child.props.id])
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency: runs only once on mount

  const arraysEqual = (arr1: string[], arr2: string[]) => {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index])
  }

  const handleChange = (id: string) => {
    if (inputType === 'radio') {
      setSelectedOptions((prevSelected) => {
        const newSelected = prevSelected.includes(id) ? prevSelected.filter((item) => item !== id) : [id]
        if (!arraysEqual(prevSelected, newSelected)) {
          onChange?.(newSelected)
        }
        return newSelected
      })
    } else {
      setSelectedOptions((prevSelected) => {
        const newSelected = prevSelected.includes(id)
          ? prevSelected.filter((item) => item !== id)
          : [...prevSelected, id]
        if (!arraysEqual(prevSelected, newSelected)) {
          onChange?.(newSelected)
        }
        return newSelected
      })
    }
  }

  const content = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const { id } = child.props
      return React.cloneElement(child, {
        ...child.props,
        onPress: () => {
          handleChange(id) // Selection behaviour
          onSelect?.(id) // Callback of parent component
          child.props.onPress?.() // Callback of children components if exist
        },
        selected: selectedOptions.includes(id),
        ...(child.type === SelectorCard ? { inputType } : {}),
      })
    }
    return child
  })

  return (
    <View style={styles.container}>
      {title && <HoliText bold>{title}</HoliText>}
      <View style={[styles.cardContainer, row && styles.row]}>{content}</View>
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
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: Spacing.xs,
  },
  item: {
    marginBottom: Spacing.xxs,
  },
  cardContainer: {
    flex: 1,
    gap: Spacing.xxs,
  },
})
