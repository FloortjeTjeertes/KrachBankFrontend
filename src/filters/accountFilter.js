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