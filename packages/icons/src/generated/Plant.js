import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgPlant = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#plant_svg__a)">
      <Path
        fill="currentColor"
        d="M6 2a7 7 0 0 1 6.197 3.741A6.49 6.49 0 0 1 17.5 3H21v2.5a6.5 6.5 0 0 1-6.5 6.5H13v1h5v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7h5v-2H9a7 7 0 0 1-7-7V2zm10 13H8v5h8zm3-10h-1.5A4.5 4.5 0 0 0 13 9.5v.5h1.5A4.5 4.5 0 0 0 19 5.5zM6 4H4a5 5 0 0 0 5 5h2a5 5 0 0 0-5-5"
      />
    </G>
    <Defs>
      <ClipPath id="plant_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgPlant
