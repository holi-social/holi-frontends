import { configure } from '@testing-library/react-native'
import { configure as configureExpoTestingLibrary } from 'expo-router/testing-library'

const config = {
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
}

configure(config)
configureExpoTestingLibrary(config)
