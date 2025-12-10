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

export interface PagedResult<T> {
  Items: T[];
  TotalCount: number;
  PageNumber: number;
  PageSize: number;
  TotalPages: number;
  HasPreviousPage: boolean;
  HasNextPage: boolean;
}

export interface ApiErrorResponse {
  Success: boolean;
  Message: string;
}
