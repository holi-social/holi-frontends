import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgPencil = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#pencil_svg__a)">
      <Path
        fill="currentColor"
        d="m15.728 9.686-1.414-1.414L5 17.586V19h1.414zm1.414-1.414 1.414-1.414-1.414-1.414-1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.83a1 1 0 0 1 0 1.413L7.243 21z"
      />
    </G>
    <Defs>
      <ClipPath id="pencil_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgPencil
