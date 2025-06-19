// @ts-nocheck
import AccountTypes from "../models/accountTypes";

export function mapToTransaction(transaction) {
  if (!transaction) {
    throw new Error("No transaction provided, returning null");
  }
  if (typeof transaction !== "object") {
    throw new Error("Invalid transaction type, expected an object");
  }
  if (
    !transaction.amount ||
    !transaction.sender ||
    !transaction.receiver ||
    !transaction.initiator ||
    !transaction.createdAt
  ) {
    throw new Error("Incomplete transaction object, returning null");
  }

  return {
    amount: transaction.amount,
    to: transaction.receiver,
    from: transaction.sender,
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
  if( apiObject.owner==null ||
    apiObject.balance==null ||
    apiObject.iban==null ||
    apiObject.absoluteLimit==null ||
    apiObject.type===null 
  ) {
    throw Error("Incomplete API object, returning null");
  }

  if (
    apiObject.owner === undefined ||
    apiObject.balance === undefined ||
    apiObject.iban === undefined ||
    apiObject.absoluteLimit === undefined ||
    apiObject.type === undefined
  ) {
    throw Error("Incomplete API object, returning null");
  }
  return {
    owner: apiObject.owner,
    balance: apiObject.balance,
    IBAN: apiObject.iban,
    absoluteLimit: apiObject.absoluteLimit,
    type: AccountTypes[apiObject.type.toUpperCase()] || AccountTypes.CHECKING,
  };
}
