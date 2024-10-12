import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { View } from 'react-native'
import renderer from 'react-test-renderer'

import SpaceSection from '@holi/core/screens/spaces/components/SpaceSection'

describe('SpaceSection', () => {
  it('renders correctly', () => {
    const generic = renderer.create(<SpaceSection title="editable section" editable />).toJSON()
    expect(generic).toHaveTextContent('global.edit')

    const location = renderer.create(<SpaceSection title="not editable section" />).toJSON()
    expect(location).toHaveTextContent('not editable section')
  })

  it('triggers the onPress method correctly', async () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <SpaceSection title="onpress test" editable onPressEdit={onPress} testID="test-onpress" />
    )

    fireEvent.press(getByTestId('btn-test-onpress'))

    expect(onPress).toHaveBeenCalled()
  })

  it('displays children correctly', () => {
    const { getByTestId } = render(
      <SpaceSection title="children test">
        <View testID="child-view" />
      </SpaceSection>
    )

    const view = getByTestId('child-view')
    expect(view).toBeDefined()
  })
})
