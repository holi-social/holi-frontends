export const getFormattedTimePart = (value: number) => (value < 10 ? `0${value}` : value.toString())
