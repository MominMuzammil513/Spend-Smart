"use server";

import { db } from "@/db/db";
import { budgets } from "@/db/schema";
import { authOptions } from "@/app/utils/authOptions";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export type Budget = {
  id: string;
  category: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export type BudgetsResult =
  | { error: string }
  | { Budgets: Budget[] };

export async function getBudgets(): Promise<BudgetsResult> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "Unauthorized" };
  }

  const userId = session.user?.id;
  if (!userId) {
    return { error: "User ID not found" };
  }

  try {
    const Budgets = await db
      .select({
        id: budgets.id,
        category: budgets.category,
        amount: budgets.amount,
        createdAt: budgets.createdAt,
        updatedAt: budgets.updatedAt,
      })
      .from(budgets)
      .where(eq(budgets.userId, userId));
    return { Budgets };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }
}