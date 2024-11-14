import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgPlantFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#plant-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M21 3v2a7 7 0 0 1-7 7h-1v1h5v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7h5v-3a7 7 0 0 1 7-7zM5.5 2a7.49 7.49 0 0 1 6.124 3.169A7.95 7.95 0 0 0 10 10v1h-.5A7.5 7.5 0 0 1 2 3.5V2z"
      />
    </G>
    <Defs>
      <ClipPath id="plant-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgPlantFilled
