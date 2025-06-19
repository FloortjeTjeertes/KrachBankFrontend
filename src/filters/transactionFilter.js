
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
    senderIban: filter.sender || null,
    receiverIban: filter.receiver || null,
    minAmount: filter.amount?.min || null,
    maxAmount: filter.amount?.max || null,
    beforeDate: filter.date?.before || null,
    afterDate: filter.date?.after || null,
  };
}
