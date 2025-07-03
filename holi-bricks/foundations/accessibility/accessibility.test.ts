import { type AccessibilityProps, accessibilityProps } from './accessibility'

type TestProps = AccessibilityProps & {
  variant: string
  text: string
}

describe('accessibility', () => {
  it('Should only extract acccessibility props', () => {
    const widerProps: TestProps = {
      role: 'button',
      'aria-label': "Let's go",
      variant: 'ghost',
      text: 'GO!',
    }

    const props = accessibilityProps(widerProps)

    expect(props).toEqual({
      role: 'button',
      'aria-label': "Let's go",
    })
  })
})
