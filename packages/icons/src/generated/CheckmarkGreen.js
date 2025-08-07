import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgCheckmarkGreen = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 16 16" {...props}>
    <Path
      fill="#82D952"
      d="M8 14.667A6.666 6.666 0 1 1 8 1.334a6.666 6.666 0 0 1 0 13.333m-.665-4 4.713-4.714-.942-.943-3.771 3.771-1.886-1.886-.943.943z"
    />
  </Svg>
)
export default SvgCheckmarkGreen
