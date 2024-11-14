import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgKey2Filled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#key-2-filled_svg__a)">
      <Path
        fill="currentColor"
        d="m10.311 11.566 7.94-7.94 2.121 2.121-1.414 1.414 2.121 2.121-3.535 3.536-2.12-2.121-2.99 2.99a5.002 5.002 0 0 1-7.97 5.849 5 5 0 0 1 5.847-7.97m-.899 5.848a2 2 0 1 0-2.779-2.877 2 2 0 0 0 2.78 2.877"
      />
    </G>
    <Defs>
      <ClipPath id="key-2-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgKey2Filled
