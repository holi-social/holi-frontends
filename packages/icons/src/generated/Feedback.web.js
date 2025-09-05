import * as React from 'react'
const SvgFeedback = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#feedback_svg__a)">
      <path
        fill="currentColor"
        d="M6.455 19 2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1zM4 18.385 5.763 17H20V5H4zM11 13h2v2h-2zm0-6h2v5h-2z"
      />
    </g>
    <defs>
      <clipPath id="feedback_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgFeedback
