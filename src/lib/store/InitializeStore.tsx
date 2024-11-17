"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store/store";
import { Transaction } from "../types/transaction";
import { TransactionsResult } from "@/app/actions/getTransactions";
import { CategoriesResult } from "@/app/actions/getCategory";
import { GetAccountTypesResult } from "@/app/actions/getAccountType";

interface InitializeStoreProps {
  transactionsResult: TransactionsResult;
  categoriesResult:CategoriesResult;
  accountList: GetAccountTypesResult
}

const InitializeStore: React.FC<InitializeStoreProps> = ({
  transactionsResult,
  categoriesResult,
  accountList,
}) => {
  const {
    setTransactionsPage,
    setTransactions,
    setCategories,
    setAccounts,
  } = useStore();

  useEffect(() => {
    if ('error' in transactionsResult) {
      setTransactionsPage(transactionsResult.error);
      setTransactions([]);
    } else {
      // Set the transactions if there are no errors
      setTransactions(transactionsResult.transactions);
    }
    if ('error' in categoriesResult) {
        setTransactionsPage(categoriesResult.error);
        setCategories([]);
      } else {
        // Set the transactions if there are no errors
        setCategories(categoriesResult.allCategories);
      }
      if ('error' in accountList) {
        setTransactionsPage(accountList.error);
        setAccounts([]);
      } else {
        // Set the transactions if there are no errors
        setAccounts(accountList);
      }
  }, [setTransactions, categoriesResult, accountList, transactionsResult, setAccounts, setCategories, setTransactionsPage]);

  return null;
};

export default InitializeStore;