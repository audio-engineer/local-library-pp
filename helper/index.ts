import type { StatusCodes } from "http-status-codes";

export class HttpStatusError extends Error {
  public httpStatusCode: StatusCodes;

  public constructor(httpStatusCode: StatusCodes, message?: string) {
    super(message);

    this.httpStatusCode = httpStatusCode;
  }
}
