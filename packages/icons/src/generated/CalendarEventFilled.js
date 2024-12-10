import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgCalendarEventFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#calendar-event-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1h2v2h6V1h2zM4 9v10h16V9zm2 4h5v4H6z"
      />
    </G>
    <Defs>
      <ClipPath id="calendar-event-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgCalendarEventFilled
