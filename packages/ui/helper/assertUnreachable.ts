/**
 * Use of an exhaustive switch statement to check that all cases are handled when using enums.
 * https://dev.to/ddiprose/exhaustive-switch-statement-with-typescript-26dh
 **/
import { HoliError } from '@holi/core/errors/classes/HoliError'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const assertUnreachable = (_: never): never => {
  throw new HoliError('Should not have reached here!')
}
