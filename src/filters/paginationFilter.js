
export  function createPaginationFilter() {
  return {
    page: 1,
    limit: 10,
  };
}
export function toPaginationFilter(filter) {
  if (!filter) {
    return createPaginationFilter();
  }
  return {
    page: filter.page || 1,
    limit: filter.limit || 10,
  };
}