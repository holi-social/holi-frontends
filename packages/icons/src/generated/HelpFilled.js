import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg'

const SvgHelpFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G fill="currentColor" clipPath="url(#help-filled_svg__a)">
      <Path d="M10 3 6 6l3 3 3-1 3 1 3-3-4-3h-4ZM10 21l-4-3 3-3 3 1 3-1 3 3-4 3h-4Z" />
      <Path
        fillRule="evenodd"
        d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0 2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
        clipRule="evenodd"
      />
      <Path
        fillRule="evenodd"
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 2a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
        clipRule="evenodd"
      />
      <Path
        fillRule="evenodd"
        d="m14.293 8.293 3-3 1.414 1.414-3 3-1.414-1.414ZM14.293 15.707l3 3 1.414-1.414-3-3-1.414 1.414ZM9.707 8.293l-3-3-1.414 1.414 3 3 1.414-1.414ZM9.707 15.707l-3 3-1.414-1.414 3-3 1.414 1.414Z"
        clipRule="evenodd"
      />
    </G>
    <Defs>
      <ClipPath id="help-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgHelpFilled
