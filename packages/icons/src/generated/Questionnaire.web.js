import * as React from 'react'
const SvgQuestionnaire = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#questionnaire_svg__a)">
      <path
        fill="currentColor"
        d="M5.763 17H20V5H4v13.385zm.692 2L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1zM11 14h2v2h-2zM8.567 8.813A3.5 3.5 0 1 1 12 13h-1v-2h1a1.5 1.5 0 1 0-1.471-1.794z"
      />
    </g>
    <defs>
      <clipPath id="questionnaire_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgQuestionnaire
