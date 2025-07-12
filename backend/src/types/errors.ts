export class AppError extends Error {
  public readonly code: number;
  public readonly status: number;

  constructor(message: string, errorCode: { code: number; status: number }) {
    super(message);
    this.name = 'AppError';
    this.code = errorCode.code;
    this.status = errorCode.status;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}
