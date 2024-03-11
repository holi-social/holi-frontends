import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgStar = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 14 14" {...props}>
    <Path
      fill="currentColor"
      d="m7 10.651-4.115 2.303.919-4.625L.342 5.128l4.682-.555L7 .29l1.976 4.282 4.682.555-3.462 3.201.919 4.625-4.115-2.303Zm0-1.337 2.477 1.387-.554-2.785 2.085-1.928-2.82-.334L7 3.076 5.811 5.655l-2.82.333 2.085 1.928-.554 2.785 2.477-1.387Z"
    />
  </Svg>
)
export default SvgStar
