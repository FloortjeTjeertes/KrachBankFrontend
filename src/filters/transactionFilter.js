
export function createTransactionFilter() {
  return {
    sender: "",
    receiver: "",
    amount: {
      min: null,
      max: null,
    },
    date: {
      before: null,
      after: null,
    },
  };
}

export function toTransactionFilter(filter) {
  if (!filter) {
    return createTransactionFilter();
  }
  return {
    sender: filter.sender || null,
    receiver: filter.receiver || null,
    amountMin: filter.amount?.min || null,
    amountMax: filter.amount?.max || null,
    dateBefore: filter.date?.before || null,
    dateAfter: filter.date?.after || null,
  };
}
