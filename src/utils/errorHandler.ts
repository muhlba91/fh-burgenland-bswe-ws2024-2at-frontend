import axios from 'axios'
import type { ApiError } from 'src/model/apiError'

/**
 * Utility class for handling and formatting error messages consistently across the application.
 * Provides special handling for Axios errors to extract relevant information from API responses.
 */
export class ErrorHandler {
  /**
   * Creates a standardized error object from various error types.
   * For Axios errors, extracts status code and error code if available.
   *
   * @param err - The error object to process. Can be an AxiosError or any other error type.
   * @param defaultMessage - Fallback message to use if no specific error message is available.
   * @returns A standardized ApiError object with a formatted message and optional status/code.
   */
  static createError(err: unknown, defaultMessage: string): ApiError {
    if (axios.isAxiosError(err)) {
      return {
        message: this.formatErrorMessage(err.response?.data?.message || defaultMessage),
        status: err.response?.status,
        code: err.code
      }
    }
    return {
      message: this.formatErrorMessage(defaultMessage)
    }
  }

  /**
   * Ensures error messages end with proper punctuation.
   * Adds a period if the message doesn't end with a period, exclamation mark, or question mark.
   *
   * @private
   * @param message - The error message to format
   * @returns The formatted message with proper ending punctuation
   */
  private static formatErrorMessage(message: string): string {
    if (!message.endsWith('.') && !message.endsWith('!') && !message.endsWith('?')) {
      message += '.'
    }
    return message
  }
}
