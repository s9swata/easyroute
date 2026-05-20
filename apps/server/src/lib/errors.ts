export const ErrorCode = {
  NOT_FOUND: "NOT_FOUND",
  FORBIDDEN: "FORBIDDEN",
  UNAUTHORIZED: "UNAUTHORIZED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CONFLICT: "CONFLICT",
  INTERNAL: "INTERNAL",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
