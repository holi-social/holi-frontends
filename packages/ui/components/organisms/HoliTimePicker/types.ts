import type { HoliDatePickerBaseProps } from '@holi/ui/components/organisms/HoliDatePicker/types'

export type HoliTimePickerProps = Omit<HoliDatePickerBaseProps, 'minimumDate' | 'maximumDate'>
