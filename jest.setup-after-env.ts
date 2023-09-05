import '@shopify/flash-list/jestSetup'
import '@testing-library/jest-native/extend-expect'
import { configure } from '@testing-library/react-native'

configure({
  defaultDebugOptions: {
    // this only prints testable xml attributes of the visual tree to console
    // when using screen.debug()

    mapProps: (props: Record<string, unknown>) => {
      return {
        testID: props.testID,
        accessibilityLabel: props.accessibilityLabel,
        accessibilityRole: props.accessibilityRole,
      }
    },
  },
})
