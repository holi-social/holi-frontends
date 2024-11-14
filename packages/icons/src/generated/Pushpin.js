import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgPushpin = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path
      fill="currentColor"
      d="m13.828 1.686 8.486 8.486-1.415 1.414-.707-.707-4.242 4.242-.707 3.536-1.415 1.414-4.242-4.243-4.95 4.95-1.414-1.414 4.95-4.95-4.243-4.242 1.414-1.415L8.88 8.05l4.242-4.242-.707-.707zm.708 3.536-4.671 4.67-2.822.565 6.5 6.5.564-2.822 4.671-4.67z"
    />
  </Svg>
)
export default SvgPushpin
