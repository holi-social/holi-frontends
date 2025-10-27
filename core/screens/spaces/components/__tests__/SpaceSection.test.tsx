import { render, screen, userEvent } from 'expo-router/testing-library'
import React from 'react'
import { View } from 'react-native'

import SpaceSection from '@holi/core/screens/spaces/components/SpaceSection'
import SpaceSectionEditable from '@holi/core/screens/spaces/components/SpaceSectionEditable'

describe('SpaceSection', () => {
  it('renders correctly', async () => {
    render(<SpaceSectionEditable title="editable section" onEditPress={jest.fn()} />)
    expect(await screen.findByRole('button', { name: 'global.edit' })).toBeOnTheScreen()

    render(<SpaceSection title="editable section" />)
    expect(screen.queryByRole('button', { name: 'global.edit' })).not.toBeOnTheScreen()
  })

  it('triggers the onPress method correctly', async () => {
    const onPress = jest.fn()
    render(<SpaceSectionEditable title="onpress test" onEditPress={onPress} testID="test-onpress" />)

    await userEvent.press(screen.getByRole('button', { name: 'global.edit' }))
    expect(onPress).toHaveBeenCalled()
  })

  it('displays children correctly', () => {
    render(
      <SpaceSection title="children test">
        <View testID="child-view" />
      </SpaceSection>
    )

    expect(screen.getByTestId('child-view')).toBeOnTheScreen()
  })
})
