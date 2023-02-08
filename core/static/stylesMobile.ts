/**
 * See docu: https://meliorence.github.io/react-native-render-html/docs/guides/styling
 **/
import { MixedStyleDeclaration } from 'react-native-render-html'

import { colors } from '@holi/ui/styles/globalVars'

const styles: Record<string, MixedStyleDeclaration> = {
  body: {
    color: colors.foreground30,
  },
  h1: {
    marginBottom: 20,
  },
  h2: {
    marginBottom: 20,
  },
  a: {
    color: colors.fontColorHighlighted,
  },
  p: {
    padding: 0,
    margin: 0,
    marginBottom: 20,
  },
  ul: {
    margin: 0,
    paddingLeft: 24,
  },
  li: {
    paddingLeft: 6,
  },
}

export default styles
