import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgFolderLockFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#folder-lock-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M12.414 5H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414zM15 13v-1a3 3 0 0 0-6 0v1H8v4h8v-4zm-2 0h-2v-1a1 1 0 0 1 2 0z"
      />
    </G>
    <Defs>
      <ClipPath id="folder-lock-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgFolderLockFilled
