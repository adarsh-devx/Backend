/**
 * Standardized ApiError class for consistent error generation across controllers and middlewares.
 * Carries HTTP status code, operational error indicator, and optional error details.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 401, 403, 404, 500)
   * @param {string} message - Error description message
   * @param {Array|Object} [errors=[]] - Array of specific validation errors or details
   * @param {string} [stack=""] - Custom stack trace if available
   */
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

