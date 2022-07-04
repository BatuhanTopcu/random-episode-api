export type TMDB_res<T> = {
  results: T[];
  page: number;
  total_results: number;
  total_pages: number;
};
