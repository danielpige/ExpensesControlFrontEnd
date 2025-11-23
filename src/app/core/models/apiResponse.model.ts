export interface ApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T;
}

export interface ApiErrorResponse {
  Success: boolean;
  Message: string;
  errors: any;
}
