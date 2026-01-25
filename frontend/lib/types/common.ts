export type UUID = string;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}
