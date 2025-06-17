
export  function createPaginationFilter(page = 1, limit = 10) {
  return {
    page: page,
    limit: limit,
  };
}
export function toPaginationFilter(filter) {
  if (!filter) {
    return createPaginationFilter();
  }
  return {
    page: filter.page ,
    limit: filter.limit ,
  };
}