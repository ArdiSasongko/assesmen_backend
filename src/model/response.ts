export class ResponseApi<T> {
  status_code: number;
  message: string;
  data?: T;
  errors?: T;
}
