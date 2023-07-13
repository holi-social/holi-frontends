import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg'

const SvgTeamFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#team-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M12 11a5 5 0 0 1 5 5v6H7v-6a5 5 0 0 1 5-5Zm-6.712 3.006a6.984 6.984 0 0 0-.28 1.65L5 16v6H2v-4.5a3.5 3.5 0 0 1 3.119-3.48l.17-.014h-.001Zm13.424 0A3.501 3.501 0 0 1 22 17.5V22h-3v-6c0-.693-.1-1.362-.288-1.994ZM5.5 8a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm13 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM12 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
      />
    </G>
    <Defs>
      <ClipPath id="team-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgTeamFilled
