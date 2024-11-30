export interface BaseResponse<T> {
    data?: T;
    success: boolean;
    errorMessage?: string;
  }