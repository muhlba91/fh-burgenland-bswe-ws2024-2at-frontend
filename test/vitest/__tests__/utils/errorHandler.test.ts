import { describe, it, expect } from 'vitest'
import { ErrorHandler } from '../../../../src/utils/errorHandler'
import type { AxiosError } from 'axios'

describe('ErrorHandler', () => {
  describe('createError', () => {
    it('handles basic error with default message', () => {
      const error = new Error('Some error')
      const result = ErrorHandler.createError(error, 'Default message')
      expect(result).toEqual({
        message: 'Default message.'
      })
    })

    it('formats Axios error with response data', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {
            message: 'Resource not found'
          }
        },
        code: 'ERR_NOT_FOUND'
      } as AxiosError

      const result = ErrorHandler.createError(axiosError, 'Default message')
      expect(result).toEqual({
        message: 'Resource not found.',
        status: 404,
        code: 'ERR_NOT_FOUND'
      })
    })

    it('uses default message when Axios error has no response message', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500
        },
        code: 'ERR_SERVER_ERROR'
      } as AxiosError

      const result = ErrorHandler.createError(axiosError, 'Internal server error')
      expect(result).toEqual({
        message: 'Internal server error.',
        status: 500,
        code: 'ERR_SERVER_ERROR'
      })
    })

    it('adds period to messages without ending punctuation', () => {
      const error = new Error('Incomplete message')
      const result = ErrorHandler.createError(error, 'Incomplete message')
      expect(result.message).toBe('Incomplete message.')
    })

    it('preserves existing punctuation', () => {
      const messages = ['Error occurred!', 'What happened?', 'Operation failed.']

      messages.forEach((msg) => {
        const result = ErrorHandler.createError(new Error(), msg)
        expect(result.message).toBe(msg)
      })
    })
  })
})
