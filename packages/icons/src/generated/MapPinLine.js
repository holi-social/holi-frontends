import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgMapPinLine = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 28 28" {...props}>
    <Path
      fill="currentColor"
      d="m14 24.386 5.775-5.775a8.166 8.166 0 1 0-11.55 0zm0 3.3L6.575 20.26a10.5 10.5 0 1 1 14.85 0zm0-12.517a2.334 2.334 0 1 0 0-4.667 2.334 2.334 0 0 0 0 4.667m0 2.334a4.667 4.667 0 1 1 0-9.334 4.667 4.667 0 0 1 0 9.334"
    />
  </Svg>
)
export default SvgMapPinLine
