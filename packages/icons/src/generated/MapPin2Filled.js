import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgMapPin2Filled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#map-pin-2-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M18.364 17.364 12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
      />
    </G>
    <Defs>
      <ClipPath id="map-pin-2-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgMapPin2Filled
