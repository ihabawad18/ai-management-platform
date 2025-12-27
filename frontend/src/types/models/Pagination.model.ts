export type PaginationMeta = {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export type Paginated<T> = {
  items: T[];
  meta: PaginationMeta;
};
