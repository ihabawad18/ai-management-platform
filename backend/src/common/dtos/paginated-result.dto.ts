export interface PaginatedResult<T> {
  items: T[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}
