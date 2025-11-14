import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgLockUnlock = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      fill="currentColor"
      fillRule="evenodd"
      d="M6 7v2H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1H8V7a4 4 0 0 1 7.5-1.937L17.196 4A6 6 0 0 0 12 1a6 6 0 0 0-6 6m13 4v10H5V11zm-8 5.732a2 2 0 1 1 2 0V19h-2z"
      clipRule="evenodd"
    />
  </Svg>
)
export default SvgLockUnlock
