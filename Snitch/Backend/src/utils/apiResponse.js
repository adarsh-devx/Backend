/**
 * Standardized ApiResponse envelope for uniform API output across all endpoints.
 */
export class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (200, 201, etc.)
   * @param {*} data - Response payload (object, array, etc.)
   * @param {string} [message="Success"] - Informative message for frontend
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

