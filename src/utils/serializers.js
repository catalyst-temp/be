export function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };
}

export function serializeTransaction(transaction) {
  return {
    id: transaction.id,
    type: transaction.type,
    category: transaction.category,
    note: transaction.note || transaction.category,
    amount: transaction.amount,
    transactionDate: transaction.transactionDate,
    createdAt: transaction.createdAt,
  };
}
