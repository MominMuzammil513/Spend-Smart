import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Transaction } from "../types/transaction";
import { formSchema } from "../zod/zodSchemas";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleResponse = (
  response: Response,
  successMessage: string,
  failureMessage: string
) => {
  if (response.status === 200 || response.status === 201) {
    toast({
      title: "Success",
      description: successMessage,
      duration: 2000,
    });
    return true;
  } else {
    throw new Error(failureMessage);
  }
};

export const handleCatchError = (errorMessage: string) => {
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
    duration: 2000,
  });
};

export const onSubmitTransaction = async (
  values: z.infer<typeof formSchema>,
  editingTransaction: Transaction | null,
  setIsLoading: (isLoading: boolean) => void,
  setIsOpen: (isOpen: boolean) => void,
  setEditingTransaction: (transaction: Transaction | null) => void,
  router: ReturnType<typeof useRouter>
) => {
  setIsLoading(true);
  try {
    const dataToSend = editingTransaction
      ? { id: editingTransaction.id, ...values }
      : values;
    const response = await fetch("/api/transactions", {
      method: editingTransaction ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });
    if (
      handleResponse(
        response,
        "Transaction added successfully!",
        "Failed to add transaction"
      )
    ) {
      setIsOpen(false);
      setEditingTransaction(null);
      router.refresh();
    }
  } catch (error) {
    handleCatchError("Failed to add transaction. Please try again." + error);
  } finally {
    setIsLoading(false);
  }
};

export const handleDeleteTransaction = async (
  id: string,
  setIsOpen: (isOpen: boolean) => void,
  router: ReturnType<typeof useRouter>
) => {
  try {
    const response = await fetch(`/api/transactions`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (
      handleResponse(
        response,
        "Transaction deleted successfully!",
        "Failed to delete transaction"
      )
    ) {
      setIsOpen(false);
      router.refresh();
    }
  } catch (error) {
    handleCatchError("Failed to delete transaction. Please try again." + error);
  }
};

export const handleDeleteCategory = async (
  categoryId: string,
  router: ReturnType<typeof useRouter>
) => {
  try {
    const response = await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId: [categoryId] }),
    });
    if (
      handleResponse(
        response,
        "Category deleted successfully!",
        "Failed to delete category"
      )
    ) {
      router.refresh();
    }
  } catch (error) {
    handleCatchError("Failed to delete category. Please try again." + error);
  }
};

export const handleDeleteAccount = async (
  accountId: string,
  router: ReturnType<typeof useRouter>
) => {
  try {
    const response = await fetch("/api/account-type", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId: [accountId] }),
    });
    if (
      handleResponse(
        response,
        "Account deleted successfully!",
        "Failed to delete account"
      )
    ) {
      router.refresh();
    }
  } catch (error) {
    handleCatchError("Failed to delete account. Please try again." + error);
  }
};

export const handleBookmarkTransaction = async (
    id: string,
    setIsOpen: (isOpen: boolean) => void,
    router: AppRouterInstance,
) => {
    try {
        const response = await fetch(`/api/transactions/bookmark`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id}),
        });
    if (
      handleResponse(
        response,
        "Transaction bookmarked successfully.",
        "Failed to delete account"
      )
    ) {
      router.refresh();
    }
  } catch (error) {
    handleCatchError("Failed to bookmark transaction."  + error);
  }
};

export const getSortedTransactions = (transactions: Transaction[]) => {
  return transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getFilteredTransactions = (
  sortedTransactions: Transaction[],
  currentMonth: number,
  currentYear: number
) => {
  return sortedTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });
};

export const getSearchResults = (
  filteredTransactions: Transaction[],
  searchQuery: string
) => {
  return filteredTransactions.filter((transaction) => {
    return (
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.account.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
};

export const getGroupedTransactions = (searchResults: Transaction[]) => {
  const groupedTransactions = searchResults.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    const dayOfWeek = new Date(transaction.date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    const key = `${date}-${dayOfWeek}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  Object.entries(groupedTransactions).forEach(([key, transactions]) => {
    groupedTransactions[key] = transactions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  });

  return groupedTransactions;
};

export const getTotals = (searchResults: Transaction[]) => {
  const totalIncome = searchResults
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = searchResults
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const overallTotal = totalIncome - totalExpenses;

  return { totalIncome, totalExpenses, overallTotal };
};
