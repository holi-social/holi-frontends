import '@testing-library/jest-native/extend-expect'
import { configure } from '@testing-library/react-native'
import { initializeBricks } from 'holi-bricks/config'

initializeBricks()

configure({
  defaultDebugOptions: {
    // this only prints testable xml attributes of the visual tree to console
    // when using screen.debug()

    mapProps: (props: Record<string, unknown>) => {
      return {
        testID: props.testID,
        'aria-label': props['aria-label'],
        role: props.role,
      }
    },
  },
})
