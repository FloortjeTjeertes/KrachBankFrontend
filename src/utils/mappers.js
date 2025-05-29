// @ts-nocheck
import AccountTypes from "../models/accountTypes";

export function mapToTransaction(transaction) {
  if (!transaction) {
    throw new Error("No transaction provided, returning null");
  }
  if (typeof transaction !== "object") {
    throw new Error("Invalid transaction type, expected an object");
  }
  console.log("Mapping transaction:", transaction);
  if (
    !transaction.amount ||
    !transaction.sender ||
    !transaction.receiver ||
    !transaction.description ||
    !transaction.initiator ||
    !transaction.createdAt
  ) {
    throw new Error("Incomplete transaction object, returning null");
  }

  return {
    amount: transaction.amount,
    to: transaction.sender,
    from: transaction.receiver,
    description: transaction.description,
    initiator: transaction.initiator,
    createdAt: transaction.createdAt,
  };
}

//maybe move to other file
export function mapToAccount(apiObject) {
  if (!apiObject) {
    console.warn("No API object provided, returning null");
    return null;
  }
  if (typeof apiObject !== "object") {
    console.warn("Invalid API object type, returning null");
    return null;
  }
  if (
    !apiObject.owner ||
    !apiObject.balance ||
    !apiObject.IBAN ||
    !apiObject.absoluteLimit ||
    !apiObject.type
  ) {
    console.warn("Incomplete API object, returning null");
    return null;
  }
  return {
    owner: apiObject.owner,
    balance: apiObject.balance,
    IBAN: apiObject.IBAN,
    absoluteLimit: apiObject.absoluteLimit,
    type: AccountTypes[apiObject.type.toUpperCase()] || AccountTypes.CHECKING,
  };
}
