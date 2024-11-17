"use server";

import { auth } from "@/auth";
import { db } from "@/db/db";
import { transactions } from "@/db/schema";
import { Transaction } from "@/lib/types/transaction";
import { eq } from "drizzle-orm";
export type TransactionsResult =
  | { error: string }
  | { transactions: Transaction[] };

export async function getTransactions(): Promise<TransactionsResult> {
  const session = await auth()
  if (!session) {
    return { error: "Unauthorized" };
  }

  const userId = session.user?.id;
  if (!userId) {
    return { error: "User ID not found" };
  }

  try {
    const allTransactions = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        date: transactions.date,
        account: transactions.account,
        amount: transactions.amount,
        category: transactions.category, // Directly select the category name
        note: transactions.note,
        description: transactions.description,
        userId: transactions.userId,
        bookmarked:transactions.bookmarked,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId));
    return { transactions: allTransactions };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }
}
