import { accessibilityProps } from 'holi-bricks/accessiblity/accessibility'

describe('accessibility', () => {
  it('Should only extract acccessibility props', () => {
    const props = accessibilityProps({
      role: 'button',
      'aria-label': "Let's go",
      variant: 'ghost',
      text: 'GO!',
    })

    expect(props).toEqual({
      role: 'button',
      'aria-label': "Let's go",
    })
  })
})
