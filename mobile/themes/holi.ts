
// TODO: clearify: this is from shared - can I use it here ?!
import chroma from "chroma-js"
import { styleVars } from 'shared/styles/globalVars'

export default {
  dark: false,
  colors: {
    primary: styleVars.primaryColor,
    background: styleVars.backgroundColor,
    card: '#fff',
    text: styleVars.fontColor,
    border: styleVars.borderColor,
    notification: chroma(styleVars.primaryColor).brighten(1).hex(),
  },
}



