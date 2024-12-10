import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgHelp = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G fill="currentColor" fillRule="evenodd" clipPath="url(#help_svg__a)" clipRule="evenodd">
      <Path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16m0 2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10" />
      <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6m0 2a5 5 0 1 0 0-10 5 5 0 0 0 0 10" />
      <Path d="m14.293 8.293 3-3 1.414 1.414-3 3zM14.293 15.707l3 3 1.414-1.414-3-3zM9.707 8.293l-3-3-1.414 1.414 3 3zM9.707 15.707l-3 3-1.414-1.414 3-3z" />
    </G>
    <Defs>
      <ClipPath id="help_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgHelp
