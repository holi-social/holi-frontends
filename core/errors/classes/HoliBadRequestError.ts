import { HoliError } from '@holi/core/errors/classes/HoliError'

/** @description HoliBadRequest is HoliError subclass for HTTP 400 status code */
export class HoliBadRequestError extends HoliError {
  statusCode = 400
}
