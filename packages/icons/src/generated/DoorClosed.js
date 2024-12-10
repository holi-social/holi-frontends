import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgDoorClosed = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 20 19" {...props}>
    <Path
      fill="currentColor"
      d="M0 19v-2h2V2.835a1 1 0 0 1 .821-.984L12.293.13A.6.6 0 0 1 13 .72V2L17 2a1 1 0 0 1 1 1v14h2v2h-4V4h-3v15zM11 2.396 4 3.67V17h7zM10 9v2H8V9z"
    />
  </Svg>
)
export default SvgDoorClosed
