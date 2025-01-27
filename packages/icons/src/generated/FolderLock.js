import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgFolderLock = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#folder-lock_svg__a)">
      <Path
        fill="currentColor"
        d="M12.414 5H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414zM4 5v14h16V7h-8.414l-2-2zm11 8h1v4H8v-4h1v-1a3 3 0 0 1 6 0zm-2 0v-1a1 1 0 0 0-2 0v1z"
      />
    </G>
    <Defs>
      <ClipPath id="folder-lock_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgFolderLock
