import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgAppsSoon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G fill="currentColor" clipPath="url(#apps-soon_svg__a)">
      <Path d="M11 7v5H7v2h6V7z" />
      <Path
        fillRule="evenodd"
        d="M22 6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4zm-2 12v-5.994a8 8 0 0 1-16 0V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m0-12v5.994a8 8 0 0 0-16 0V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2M6 12a6 6 0 1 0 12 0 6 6 0 0 0-12 0"
        clipRule="evenodd"
      />
    </G>
    <Defs>
      <ClipPath id="apps-soon_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgAppsSoon
