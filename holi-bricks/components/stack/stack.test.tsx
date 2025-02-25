import React from 'react'
import { render } from '@testing-library/react-native'
import { Stack } from './'
import { Spacing, BorderRadius } from 'holi-bricks/tokens'

describe('Stack Component', () => {
  it('renders children when shouldRender is true', () => {
    const { getByTestId } = render(
      <Stack>
        <Stack>
          <Stack testID="child" />
        </Stack>
      </Stack>
    )
    expect(getByTestId('child')).toBeTruthy()
  })

  it('does not render when shouldRender is false', () => {
    const { queryByTestId } = render(
      <Stack shouldRender={false}>
        <Stack testID="child" />
      </Stack>
    )
    expect(queryByTestId('child')).toBeNull()
  })

  it('renders as a Pressable when onPress is provided', () => {
    const { getByRole } = render(
      <Stack onPress={() => {}}>
        <Stack />
      </Stack>
    )
    expect(getByRole('button')).toBeTruthy()
  })

  it('renders without an accessibility role when onPress is not provided', () => {
    const { getByTestId } = render(
      <Stack testID="container">
        <Stack />
      </Stack>
    )
    const container = getByTestId('container')
    expect(container.props.accessibilityRole).toBe('none')
  })

  it('applies padding styles correctly', () => {
    const { getByTestId } = render(
      <Stack padding="md" testID="container">
        <Stack />
      </Stack>
    )
    const container = getByTestId('container')
    expect(container.props.style).toEqual(
      expect.objectContaining({
        paddingTop: Spacing.md,
        paddingBottom: Spacing.md,
        paddingLeft: Spacing.md,
        paddingRight: Spacing.md,
      })
    )
  })

  it('applies margin styles', () => {
    const { getByTestId } = render(
      <Stack margin={{ top: 'sm', bottom: 'lg' }} testID="container">
        <Stack />
      </Stack>
    )
    const container = getByTestId('container')
    expect(container.props.style).toEqual(
      expect.objectContaining({
        marginTop: Spacing.sm,
        marginBottom: Spacing.lg,
      })
    )
  })

  it('applies borderRadius', () => {
    const { getByTestId } = render(
      <Stack borderRadius={{ topLeft: 'xs', bottomRight: 'pill' }} testID="container">
        <Stack />
      </Stack>
    )
    const container = getByTestId('container')
    expect(container.props.style).toEqual(
      expect.objectContaining({
        borderTopLeftRadius: BorderRadius.xs,
        borderBottomRightRadius: BorderRadius.pill,
      })
    )
  })

  it('applies flex-related styles', () => {
    const { getByTestId } = render(
      <Stack flex={1} justifyContent="center" alignItems="flex-end" testID="container">
        <Stack />
      </Stack>
    )
    const container = getByTestId('container')
    expect(container.props.style).toEqual(
      expect.objectContaining({
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
      })
    )
  })

  it('disables Pressable when disabled is true', () => {
    const { getByRole } = render(
      <Stack onPress={() => {}} disabled>
        <Stack />
      </Stack>
    )
    expect(getByRole('button').props.accessibilityState).toEqual({ disabled: true })
  })

  it('sets the accessibility label when provided', () => {
    const { getByRole } = render(
      <Stack onPress={() => {}} accessibilityLabel="Custom Label">
        <Stack />
      </Stack>
    )
    expect(getByRole('button').props.accessibilityLabel).toBe('Custom Label')
  })
})
