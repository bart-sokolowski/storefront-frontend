export interface ApiResult<T> {
  isSuccess: boolean;
  data?: T;
  note?: string;
  errors?: string[];
}
