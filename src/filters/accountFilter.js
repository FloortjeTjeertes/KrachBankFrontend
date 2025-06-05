export function createAccountFilter() {
  return {
    id: null,
    iban: "",
    balance: {
      min: null,
      max: null,
    },
    accountType: "",
  };
}
export function toAccountFilter(filter) {
  if (!filter) {
    return createAccountFilter();
  }
  
  return {
    id: filter.id || null,
    iban: filter.iban || null,
    balanceMin: filter.balance?.min || null,
    balanceMax: filter.balance?.max || null,
    accountType: filter.accountType || null,
  };
}