/**
 * Represents an error that can occur during API operations.
 * Can be either a detailed error with status code and error code,
 * or a simple error with just a message.
 */
export type ApiError =
  | {
      /** Human-readable error message */
      message: string
      /** HTTP status code if available */
      status: number | undefined
      /** Error code from the API if available */
      code: string | undefined
    }
  | {
      /** Human-readable error message */
      message: string
      /** No status code for simple errors */
      status?: never
      /** No error code for simple errors */
      code?: never
    }
